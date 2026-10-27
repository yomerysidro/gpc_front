import { RecursoEmision } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';

export interface CampoEmision {
  nombre: string;
  titulo: string;
  tipo?: 'numero' | 'fecha' | 'fecha-hora' | 'booleano' | 'secreto' | 'multilinea';
  opcional?: boolean;
  max?: number;
  opciones?: readonly string[];
  relacion?: RecursoEmision | 'gestion';
}
export interface ConfiguracionEmision {
  titulo: string;
  clave: string;
  campos: readonly CampoEmision[];
  columnas: readonly CampoEmision[];
  filtros: readonly CampoEmision[];
  aviso?: string;
}
const numero = (nombre: string, titulo: string, relacion?: CampoEmision['relacion'], opcional = false): CampoEmision =>
  ({ nombre, titulo, tipo: 'numero', relacion, opcional });
const texto = (nombre: string, titulo: string, max?: number): CampoEmision => ({ nombre, titulo, max });
const fecha = (nombre: string, titulo: string): CampoEmision => ({ nombre, titulo, tipo: 'fecha' });
const estado = texto('estado', 'Estado', 30);
const trabajador = numero('id_persona_trabajador', 'Trabajador', 'gestion');
const firma = numero('id_firma', 'Firma', 'firmas');
const certificado = numero('id_certificado', 'Certificado', 'certificados');
const codigo = texto('codigo_verificacion', 'Código de verificación', 30);
const origenes = [
  numero('id_reconocimiento', 'Reconocimiento de origen', 'reconocimientos', true),
  numero('id_participacion', 'Participación de origen', 'gestion', true),
  numero('id_practica', 'Práctica de origen', 'gestion', true),
];
const camposCertificado: CampoEmision[] = [
  numero('id_persona', 'Persona', 'gestion'), numero('id_tipo_certificado', 'Tipo de certificado', 'tipos-certificado'),
  ...origenes, { ...fecha('fecha_emision', 'Fecha de emisión'), opcional: true },
  { nombre: 'estado', titulo: 'Activo', tipo: 'booleano' },
  { nombre: 'notificado', titulo: 'Notificado', tipo: 'booleano' },
  { nombre: 'fecha_notificacion', titulo: 'Fecha de notificación', tipo: 'fecha-hora', opcional: true },
];
const camposReconocimiento: CampoEmision[] = [trabajador, texto('titulo', 'Título', 150),
  { ...texto('descripcion', 'Descripción', 500), tipo: 'multilinea' },
  { ...texto('motivo', 'Motivo', 500), tipo: 'multilinea' }, fecha('fecha_reconocimiento', 'Fecha de reconocimiento'), estado];
const documentoEstado: CampoEmision = { ...estado, opciones: ['GENERADO', 'ANULADO'] };
const camposDocumento: CampoEmision[] = [certificado, codigo,
  texto('ruta_archivo', 'Ruta del PDF privado existente', 255),
  { ...texto('motivo_reemision', 'Motivo de reemisión', 255), opcional: true },
  documentoEstado, fecha('fecha_generacion', 'Fecha de generación')];
const camposFirma: CampoEmision[] = [trabajador, texto('ruta_archivo_pfx', 'Ruta del PFX privado existente', 255),
  { ...texto('passphrase', 'Contraseña del PFX', 255), tipo: 'secreto' }, fecha('fecha_firma', 'Fecha de firma')];
const camposAsignacion: CampoEmision[] = [numero('id_actividad', 'Actividad', 'gestion'), firma,
  numero('orden_firma', 'Orden de firma')];
const camposFirmaAplicada: CampoEmision[] = [numero('id_certificado_documento', 'Documento'), firma,
  fecha('fecha_firma', 'Fecha de firma'), numero('orden_firma', 'Orden de firma')];
const camposConsulta: CampoEmision[] = [numero('id_certificado_documento', 'Documento'),
  texto('dni_consulta', 'DNI consultado', 8), texto('codigo_consulta', 'Código consultado', 50),
  { nombre: 'fecha_consulta', titulo: 'Fecha de consulta', tipo: 'fecha-hora' }, texto('resultado', 'Resultado', 50)];

export const CONFIGURACION_EMISION: Record<RecursoEmision, ConfiguracionEmision> = {
  certificados: {
    titulo: 'Certificados', clave: 'id_certificado', campos: camposCertificado,
    columnas: [camposCertificado[0], camposCertificado[1], camposCertificado[5], camposCertificado[6]],
    filtros: [camposCertificado[0], camposCertificado[1], camposCertificado[6]],
    aviso: 'Puedes seleccionar un origen: reconocimiento, participación o práctica. Son mutuamente excluyentes y la persona debe coincidir con el origen elegido.',
  },
  'tipos-certificado': {
    titulo: 'Tipos de certificado', clave: 'id_tipo_certificado',
    campos: [texto('nombre_tipo', 'Nombre del tipo', 64), texto('estado', 'Estado', 64)],
    columnas: [texto('nombre_tipo', 'Nombre'), estado], filtros: [texto('nombre_tipo', 'Nombre'), estado],
  },
  reconocimientos: {
    titulo: 'Reconocimientos', clave: 'id_reconocimiento', campos: camposReconocimiento,
    columnas: [trabajador, camposReconocimiento[1], camposReconocimiento[4], estado], filtros: [trabajador, estado],
  },
  'certificados-documentos': {
    titulo: 'Documentos', clave: 'id_certificado_documento', campos: camposDocumento,
    columnas: [certificado, codigo, documentoEstado, camposDocumento[5]], filtros: [certificado, codigo, documentoEstado],
    aviso: 'Solo se registran PDF que ya existen en el almacenamiento privado autorizado. No hay carga, generación ni descarga de PDF disponible. Los documentos históricos no se eliminan.',
  },
  firmas: {
    titulo: 'Firmas', clave: 'id_firma', campos: camposFirma,
    columnas: [trabajador, camposFirma[3]], filtros: [trabajador],
    aviso: 'El PFX debe existir en el almacenamiento privado autorizado. Su contraseña no se guarda en el navegador. Registrar el PFX no firma digitalmente un documento.',
  },
  'actividades-firmas': {
    titulo: 'Asignar firmantes', clave: 'id_actividad_firma', campos: camposAsignacion,
    columnas: camposAsignacion, filtros: [camposAsignacion[0], firma],
    aviso: 'Esta asignación define el orden de los firmantes de una actividad existente. No aplica una firma digital.',
  },
  'certificados-firmas': {
    titulo: 'Firmas aplicadas', clave: 'id_certificado_firma', campos: [],
    columnas: camposFirmaAplicada, filtros: [camposFirmaAplicada[0], firma],
    aviso: 'Consulta de solo lectura. La aplicación de firmas digitales aún no está disponible.',
  },
  'consultas-certificado': {
    titulo: 'Historial de consultas', clave: 'id_consulta_certificado', campos: [],
    columnas: camposConsulta, filtros: [camposConsulta[1], camposConsulta[2]],
    aviso: 'Historial de solo lectura. No se modifican los resultados de consultas anteriores.',
  },
};

export function esEditable(recurso: RecursoEmision): recurso is Exclude<RecursoEmision, 'certificados-firmas' | 'consultas-certificado'> {
  return recurso !== 'certificados-firmas' && recurso !== 'consultas-certificado';
}
export function esEliminable(recurso: RecursoEmision): recurso is Exclude<RecursoEmision, 'certificados-firmas' | 'consultas-certificado' | 'certificados-documentos'> {
  return esEditable(recurso) && recurso !== 'certificados-documentos';
}
