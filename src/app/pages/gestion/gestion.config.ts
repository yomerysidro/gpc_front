import { GestionEntidad } from '../../core/services/gestion/gestion.models';

export interface CampoGestion {
  key: string;
  label: string;
  tipo?: 'texto' | 'fecha' | 'booleano' | 'relacion';
  requerido?: boolean;
  max?: number;
  relacion?: GestionEntidad;
  despuesDe?: string;
}

export interface ColumnaGestion { key: string; label: string }
export interface ConfiguracionGestion {
  titulo: string;
  singular: string;
  descripcion: string;
  campos: CampoGestion[];
  columnas: ColumnaGestion[];
  relacionados?: GestionEntidad[];
}

const persona: CampoGestion = { key: 'id_persona', label: 'Persona', tipo: 'relacion', relacion: 'persona', requerido: true };
const area: CampoGestion = { key: 'id_area', label: 'Área', tipo: 'relacion', relacion: 'area', requerido: true };
const institucion: CampoGestion = { key: 'id_institucion', label: 'Institución', tipo: 'relacion', relacion: 'institucion', requerido: true };
const estado = (max: number): CampoGestion => ({ key: 'estado', label: 'Estado', requerido: true, max });
const fechas = (inicio = 'fecha_inicio'): CampoGestion[] => [
  { key: inicio, label: inicio === 'fecha_ingreso' ? 'Fecha de ingreso' : 'Fecha de inicio', tipo: 'fecha', requerido: true },
  { key: 'fecha_fin', label: 'Fecha de fin', tipo: 'fecha', despuesDe: inicio },
];

/** Campos, longitudes y obligatoriedad del Validator de cada controlador Laravel. */
export const GESTION_CONFIG: Record<GestionEntidad, ConfiguracionGestion> = {
  persona: {
    titulo: 'Personas', singular: 'persona',
    descripcion: 'Registro de personas y sus datos de contacto. Los documentos se administran en la opción Documentos.',
    campos: [
      { key: 'nombres', label: 'Nombres', requerido: true, max: 150 },
      { key: 'apellido_paterno', label: 'Apellido paterno', requerido: true, max: 150 },
      { key: 'apellido_materno', label: 'Apellido materno', max: 150 },
      { key: 'telefono', label: 'Teléfono', max: 20 },
      { key: 'direccion', label: 'Dirección', max: 200 },
      { key: 'correo', label: 'Correo', max: 255 },
      { key: 'fecha_registro', label: 'Fecha de registro', tipo: 'fecha', requerido: true },
    ],
    columnas: [
      { key: 'nombre_completo', label: 'Persona' }, { key: 'documentos', label: 'Documentos' },
      { key: 'correo', label: 'Correo' }, { key: 'telefono', label: 'Teléfono' },
      { key: 'fecha_registro', label: 'Registro' },
    ],
    relacionados: ['persona_documento', 'tipo_documento'],
  },
  persona_documento: {
    titulo: 'Documentos', singular: 'documento',
    descripcion: 'Documentos de identidad vinculados a las personas registradas.',
    campos: [persona,
      { key: 'id_tipo_documento', label: 'Tipo de documento', tipo: 'relacion', relacion: 'tipo_documento', requerido: true },
      { key: 'numero_documento', label: 'Número de documento', requerido: true, max: 100 }, estado(100)],
    columnas: [{ key: 'id_persona', label: 'Persona' }, { key: 'id_tipo_documento', label: 'Tipo de documento' },
      { key: 'numero_documento', label: 'Número' }, { key: 'estado', label: 'Estado' }],
  },
  persona_trabajador: {
    titulo: 'Trabajadores', singular: 'trabajador',
    descripcion: 'Vinculación laboral de una persona con un área de la municipalidad.',
    campos: [persona, area, { key: 'cargo', label: 'Cargo', requerido: true, max: 150 }, ...fechas('fecha_ingreso'),
      { key: 'estado', label: 'Estado activo', tipo: 'booleano', requerido: true }],
    columnas: [{ key: 'id_persona', label: 'Persona' }, { key: 'id_area', label: 'Área' },
      { key: 'cargo', label: 'Cargo' }, { key: 'fecha_ingreso', label: 'Ingreso' }, { key: 'estado', label: 'Estado' }],
  },
  persona_practicante: {
    titulo: 'Practicantes', singular: 'practicante',
    descripcion: 'Personas habilitadas como practicantes. Registra aquí al practicante antes de crear su práctica.',
    campos: [persona, { key: 'codigo', label: 'Código', requerido: true, max: 50 }, estado(30)],
    columnas: [{ key: 'id_persona', label: 'Persona' }, { key: 'codigo', label: 'Código' }, { key: 'estado', label: 'Estado' }],
  },
  practica: {
    titulo: 'Prácticas', singular: 'práctica',
    descripcion: 'Prácticas vinculadas a un practicante, una institución y un área municipal.',
    campos: [
      { key: 'id_persona_practicante', label: 'Practicante', tipo: 'relacion', relacion: 'persona_practicante', requerido: true },
      institucion, area, { key: 'carrera', label: 'Carrera', requerido: true, max: 55 }, ...fechas(), estado(100)],
    columnas: [{ key: 'id_persona_practicante', label: 'Practicante' }, { key: 'id_institucion', label: 'Institución' },
      { key: 'id_area', label: 'Área' }, { key: 'carrera', label: 'Carrera' }, { key: 'fecha_inicio', label: 'Inicio' },
      { key: 'estado', label: 'Estado' }],
    relacionados: ['persona'],
  },
  practica_supervisor: {
    titulo: 'Supervisores', singular: 'asignación de supervisor',
    descripcion: 'Asignación de trabajadores municipales como supervisores de una práctica.',
    campos: [
      { key: 'id_practica', label: 'Práctica', tipo: 'relacion', relacion: 'practica', requerido: true },
      { key: 'id_persona_trabajador', label: 'Trabajador supervisor', tipo: 'relacion', relacion: 'persona_trabajador', requerido: true },
      { key: 'tipo_supervision', label: 'Tipo de supervisión', requerido: true, max: 150 }, ...fechas(), estado(100)],
    columnas: [{ key: 'id_practica', label: 'Práctica' }, { key: 'id_persona_trabajador', label: 'Supervisor' },
      { key: 'tipo_supervision', label: 'Tipo de supervisión' }, { key: 'fecha_inicio', label: 'Inicio' },
      { key: 'fecha_fin', label: 'Fin' }, { key: 'estado', label: 'Estado' }],
    relacionados: ['persona', 'persona_practicante', 'area'],
  },
  persona_ponente: {
    titulo: 'Ponentes', singular: 'ponente',
    descripcion: 'Personas ponentes, su especialidad y la institución a la que pertenecen.',
    campos: [persona, { ...institucion, requerido: false },
      { key: 'cargo', label: 'Cargo', max: 150 }, { key: 'especialidad', label: 'Especialidad', max: 100 }],
    columnas: [{ key: 'id_persona', label: 'Persona' }, { key: 'id_institucion', label: 'Institución' },
      { key: 'cargo', label: 'Cargo' }, { key: 'especialidad', label: 'Especialidad' }],
  },
  area: {
    titulo: 'Áreas', singular: 'área', descripcion: 'Áreas municipales para trabajadores y prácticas.',
    campos: [{ key: 'nombre', label: 'Nombre', requerido: true, max: 100 }],
    columnas: [{ key: 'nombre', label: 'Nombre' }],
  },
  tipo_documento: {
    titulo: 'Tipos de documento', singular: 'tipo de documento', descripcion: 'Catálogo de tipos de documento de identidad.',
    campos: [{ key: 'nombre', label: 'Nombre', requerido: true, max: 150 },
      { key: 'estado', label: 'Estado activo', tipo: 'booleano' }],
    columnas: [{ key: 'nombre', label: 'Nombre' }, { key: 'estado', label: 'Estado' }],
  },
  institucion: {
    titulo: 'Instituciones', singular: 'institución', descripcion: 'Instituciones de procedencia de practicantes y ponentes.',
    campos: [{ key: 'nombre_institucion', label: 'Nombre de la institución', requerido: true, max: 150 },
      { key: 'pais', label: 'País', requerido: true, max: 50 }, { key: 'tipo', label: 'Tipo', requerido: true, max: 30 }],
    columnas: [{ key: 'nombre_institucion', label: 'Institución' }, { key: 'pais', label: 'País' }, { key: 'tipo', label: 'Tipo' }],
  },
};
