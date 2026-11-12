import { ArchivoPdf } from '../../../core/interfaces/emision-certificados/documento-digital.interface';

/** PDF válido con texto WinAnsi y espacios de firma reales en el stream, sin HTML. */
export function pdfPrueba(firmantes: { nombre: string; cargo: string }[] = []): ArchivoPdf {
  const literal = (texto: string) => Array.from(texto, c => {
    const codigo = c.charCodeAt(0);
    return codigo > 126 || /[()\\]/.test(c) ? `\\${codigo.toString(8).padStart(3, '0')}` : c;
  }).join('');
  let contenido = 'BT /F1 18 Tf 40 520 Td (Certificado - Beneficiario - QR ABC123) Tj ET\n';
  firmantes.forEach((f, i) => {
    const x = 40 + i * 360;
    contenido += `${x} 140 m ${x + 280} 140 l S\nBT /F1 14 Tf ${x} 115 Td (Firma ${i + 1}) Tj 0 -20 Td (${literal(f.nombre)}) Tj 0 -20 Td (${literal(f.cargo)}) Tj ET\n`;
  });
  const objetos = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    `<< /Length ${contenido.length} >>\nstream\n${contenido}endstream`,
  ];
  let pdf = '%PDF-1.4\n'; const offsets = [0];
  objetos.forEach((objeto, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${objeto}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n` + offsets.slice(1).map(n => `${String(n).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return { blob: new Blob([pdf], { type: 'application/pdf' }), nombre: 'certificado.pdf' };
}

export const FIRMANTES_PDF_PRUEBA = [
  { nombre: 'Antón Talián', cargo: 'Jefe de Informática' },
  { nombre: 'Maria Perez', cargo: 'Especialista de RR.HH.' },
];
