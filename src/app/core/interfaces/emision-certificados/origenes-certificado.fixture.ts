import {
  EvaluacionOrigen, EvaluacionPonenteSesion, OrigenDocumental, PonentesActividadCertificacion, PonentesCertificacion,
} from './origenes-certificado.interface';

/** Datos sintéticos; no consultan ni certifican a la persona real. IDs independientes de producción. */
export function ponenteActividadPrueba(): PonentesActividadCertificacion {
  return { modalidad_reconocimiento: 'actividad', id_actividad: 7, id_sesion: null, ponentes: [{
    id_actividad_ponente: 71, id_actividad: 7, id_persona: 31, id_persona_ponente: 61,
    nombres: 'Maria', apellido_paterno: 'Perez', apellido_materno: null,
    reconocimiento: { origen: 'ponente_actividad', modalidad_reconocimiento: 'actividad', id_origen: 71, id_actividad_ponente: 71,
      id_actividad: 7, actividad: 'Capacitación Personal', id_sesion: null, id_persona: 31, id_persona_ponente: 61,
      id_area: 8, id_tipo_certificado: 47, tipo_certificado: 'Reconocimiento', nombres: 'Maria', apellido_paterno: 'Perez', apellido_materno: null,
      datos_origen: { titulo: 'Reconocimiento como ponente', estado_actividad: 'Cerrada', fecha_inicio_actividad: '2026-01-01', fecha_fin_actividad: '2026-06-30' },
      estado_elegibilidad: 'Elegible', puede_preparar: true, puede_generar_pdf: true, puede_emitir: false,
      puede_consultar_certificado_existente: false, certificados_existentes: [], motivos_bloqueo: [] },
  }] };
}

/** Evaluación real de un vínculo ponente–sesión, con la sesión y su fecha acreditadas. */
export function ponenteSesionPrueba(elegible = true): EvaluacionPonenteSesion {
  return { origen: 'ponente_sesion', modalidad_reconocimiento: 'sesion', id_origen: 71, id_actividad_ponente: 71,
    id_actividad: 7, actividad: 'Capacitación Personal', id_sesion: 15, sesion: 'Sesión N.º 001', fecha_sesion: '2026-02-10',
    id_persona: 31, id_persona_ponente: 61, id_area: 8, id_tipo_certificado: 47, tipo_certificado: 'Reconocimiento',
    nombres: 'Maria', apellido_paterno: 'Perez', apellido_materno: null,
    datos_origen: { titulo: 'Reconocimiento como ponente', estado_actividad: 'Cerrada', fecha_inicio_actividad: '2026-01-01', fecha_fin_actividad: '2026-06-30' },
    estado_elegibilidad: elegible ? 'Elegible' : 'Pendiente de validación', puede_preparar: elegible, puede_generar_pdf: elegible,
    puede_emitir: false, puede_consultar_certificado_existente: false, certificados_existentes: [],
    motivos_bloqueo: elegible ? [] : ['La sesión debe estar Finalizada y tener fecha real no futura.'] };
}

export function ponentesSesionPrueba(sesion = 15, actividad = 7): PonentesCertificacion {
  const reconocimiento = ponenteSesionPrueba();
  Object.assign(reconocimiento, { id_actividad: actividad, id_sesion: sesion });
  return { origen: 'ponente_sesion', id_actividad: actividad, id_sesion: sesion, ponentes_actividad: [],
    ponentes_sesion: [{ id_actividad_ponente: 71, id_actividad: actividad, id_persona: 31,
      id_persona_ponente: 61, nombres: 'Maria', apellido_paterno: 'Perez', apellido_materno: null,
      cargo: 'Especialista', institucion: 'Municipalidad Distrital de Morales', reconocimiento }],
    relacion_ponente_sesion_disponible: true, puede_preparar: true, puede_generar_pdf: true, puede_emitir: false, motivos_bloqueo: [] };
}

export function evaluacionOrigenPrueba(origen: OrigenDocumental, elegible = true): EvaluacionOrigen {
  return { origen, id_origen: 71, id_persona: 31, id_area: 8, id_actividad: null, id_sesion: null,
    id_tipo_certificado: origen === 'practica' ? 93 : 47, tipo_certificado: origen === 'practica' ? 'Prácticas' : 'Reconocimiento',
    [origen]: { nombres: 'Ana', apellido_paterno: 'Municipal', apellido_materno: null, estado: origen === 'practica' ? 'activo' : 'ca',
      titulo: origen === 'reconocimiento' ? 'Servicio municipal' : undefined, motivo: 'Motivo autorizado',
      fecha_inicio: origen === 'practica' ? '2026-01-01' : undefined, fecha_fin: '2026-06-30', area: 'Recursos Humanos' },
    estado_elegibilidad: elegible ? 'Elegible' : 'Pendiente de validación', puede_preparar: elegible,
    puede_generar_pdf: elegible, puede_emitir: false, puede_consultar_certificado_existente: false,
    motivos_bloqueo: elegible ? [] : ['Falta la aprobación institucional.'], certificados_existentes: [] };
}
