const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Comprobar el archivo local real: declarar un nombre en TypeScript no garantiza que exista su glifo.
const root = path.resolve(__dirname, '..');
const font = fs.readFileSync(path.join(root, 'public/fonts/material-symbols-outlined.ttf'));
const u16 = p => font.readUInt16BE(p);
const u32 = p => font.readUInt32BE(p);
const tables = {};
for (let i = 0; i < u16(4); i++) {
  const p = 12 + i * 16;
  tables[font.toString('ascii', p, p + 4)] = u32(p + 8);
}
const characters = new Map();
const cmap = tables.cmap;
for (let i = 0; i < u16(cmap + 2); i++) {
  const p = cmap + u32(cmap + 8 + i * 8);
  if (u16(p) !== 4) continue;
  const n = u16(p + 6) / 2;
  const ends = p + 14, starts = ends + n * 2 + 2, deltas = starts + n * 2, ranges = deltas + n * 2;
  for (let c = 32; c < 127; c++) {
    for (let j = 0; j < n; j++) {
      if (c < u16(starts + j * 2) || c > u16(ends + j * 2)) continue;
      const delta = u16(deltas + j * 2), range = u16(ranges + j * 2);
      let glyph = range ? u16(ranges + j * 2 + range + (c - u16(starts + j * 2)) * 2) : c;
      if (glyph) glyph = (glyph + delta) & 65535;
      characters.set(glyph, String.fromCharCode(c));
      break;
    }
  }
}
function coverage(p) {
  const ids = [];
  if (u16(p) === 1) {
    for (let i = 0; i < u16(p + 2); i++) ids.push(u16(p + 4 + i * 2));
  } else {
    for (let i = 0; i < u16(p + 2); i++) {
      const q = p + 4 + i * 6;
      for (let g = u16(q); g <= u16(q + 2); g++) ids.push(g);
    }
  }
  return ids;
}
const ligatures = new Set();
function readLigatures(p, type) {
  if (type === 7) return readLigatures(p + u32(p + 4), u16(p + 2));
  if (type !== 4) return;
  const first = coverage(p + u16(p + 2));
  for (let i = 0; i < u16(p + 4); i++) {
    const set = p + u16(p + 6 + i * 2);
    for (let j = 0; j < u16(set); j++) {
      const l = set + u16(set + 2 + j * 2), ids = [first[i]];
      for (let k = 1; k < u16(l + 2); k++) ids.push(u16(l + 2 + k * 2));
      ligatures.add(ids.map(id => characters.get(id) ?? '?').join(''));
    }
  }
}
const lookups = tables.GSUB + u16(tables.GSUB + 8);
for (let i = 0; i < u16(lookups); i++) {
  const p = lookups + u16(lookups + 2 + i * 2);
  for (let j = 0; j < u16(p + 4); j++) readLigatures(p + u16(p + 6 + j * 2), u16(p));
}

test('todos los iconos del sidebar y del catálogo tienen ligadura en la fuente instalada', () => {
  const sidebar = fs.readFileSync(path.join(root, 'src/app/components/sidebar/modulos-navegacion.ts'), 'utf8');
  const catalog = fs.readFileSync(path.join(root, 'src/app/shared/utils/iconos-disponibles.ts'), 'utf8');
  const names = [...sidebar.matchAll(/icon: '([^']+)'/g), ...catalog.matchAll(/'([a-z_]+)'/g)].map(m => m[1]);
  assert.ok(names.length > 50);
  for (const name of names) assert.ok(ligatures.has(name), `Glifo ausente: ${name}`);
});

test('se conservan las ligaduras previas utilizadas por las pantallas existentes', () => {
  for (const name of 'create mode mode_edit mode_edit_outline error_outline error_circle_rounded check_circle_outline check_circle_filled insert_invitation lock_outline people_alt people_outline remove_red_eye warning_amber report_problem'.split(' ')) {
    assert.ok(ligatures.has(name), `Ligadura anterior ausente: ${name}`);
  }
});
