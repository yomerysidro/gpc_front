// Comprobación local autorizada. No persiste ni imprime DNI, respuestas o credenciales.
const { spawnSync } = require('node:child_process');
const path = require('node:path');

async function main() {
  const backend = path.resolve(__dirname, '../../gpc_back');
  const php = String.raw`
    require getcwd().'/vendor/autoload.php';
    $app = require getcwd().'/bootstrap/app.php';
    $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
    try {
      Illuminate\Support\Facades\DB::beginTransaction();
      Illuminate\Support\Facades\DB::statement('SET TRANSACTION READ ONLY');
      $rows = Illuminate\Support\Facades\DB::table('certificado.certificado_documento as d')
        ->join('certificado.certificado as c', 'c.id_certificado', '=', 'd.id_certificado')
        ->join('gestion.persona_documento as pd', 'pd.id_persona', '=', 'c.id_persona')
        ->join('gestion.tipo_documento as td', 'td.id_tipo_documento', '=', 'pd.id_tipo_documento')
        ->where('td.nombre', 'DNI')->where('c.estado', 'PENDIENTE_FIRMA')->where('d.estado', 'Vigente')
        ->orderBy('d.id_certificado_documento')->limit(10)->get(['pd.numero_documento']);
      $selected = null;
      foreach ($rows as $row) {
        if (!preg_match('/^[0-9]{8}$/', (string) $row->numero_documento)) continue;
        if (count(app(App\Services\PublicCertificateLookup::class)->search((string) $row->numero_documento)) > 0) {
          $selected = (string) $row->numero_documento; break;
        }
      }
      echo json_encode(['dni' => $selected]);
    } catch (Throwable $e) {
      echo json_encode(['error' => 'No se pudo seleccionar un documento mediante lectura autorizada.']);
    } finally {
      while (Illuminate\Support\Facades\DB::transactionLevel() > 0) Illuminate\Support\Facades\DB::rollBack();
    }
  `;
  const child = spawnSync('php', ['-r', php], { cwd: backend, encoding: 'utf8', windowsHide: true, timeout: 30000 });
  let selected;
  try { selected = JSON.parse(child.stdout); } catch { throw new Error('La selección de solo lectura no pudo completarse.'); }
  if (!/^[0-9]{8}$/.test(selected?.dni ?? '')) throw new Error('No se obtuvo un DNI con documento confirmado para esta comprobación.');
  const summaries = [];
  for (const [contexto, base] of [['laravel', 'http://127.0.0.1:8000'], ['proxy-angular', 'http://localhost:4200']]) {
    const response = await fetch(base + '/api/portal-certificados/consultar-dni', {
      method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ dni: selected.dni }), credentials: 'omit', redirect: 'error', signal: AbortSignal.timeout(30000),
    });
    let data; try { data = await response.json(); } catch { data = null; }
    const rows = data?.data?.certificados;
    const text = v => v === null || typeof v === 'string';
    const valid = data?.success === true && Array.isArray(rows) && rows.every(r => r
      && /^[a-f0-9]{64}$/.test(r.referencia_publica) && /^[a-f0-9]{30}$/.test(r.codigo_verificacion)
      && typeof r.origen === 'string' && typeof r.estado_disponibilidad === 'string'
      && typeof r.disponible_rrhh === 'boolean' && typeof r.pdf_publicado === 'boolean'
      && [r.tipo_certificado, r.actividad, r.sesion, r.fecha_sesion, r.url_documento].every(text));
    summaries.push({ contexto, http: response.status, contrato_valido: valid,
      certificados: Array.isArray(rows) ? rows.length : null,
      disponibles: Array.isArray(rows) ? rows.filter(r => r.disponible_rrhh === true).length : null,
      pdf_publicados: Array.isArray(rows) ? rows.filter(r => r.pdf_publicado === true).length : null,
      sin_jwt: true, sin_cookies: true });
  }
  selected = null;
  console.log(JSON.stringify({ verificacion_http_real: summaries }));
  if (summaries.some(r => r.http !== 200 || !r.contrato_valido || !r.certificados)) process.exitCode = 1;
}
main().catch(() => { console.error('No se completó la verificación HTTP real. No se muestran datos ni detalles internos.'); process.exitCode = 1; });
