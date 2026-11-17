import {
  EmisionCertificadosService,
  PERMISOS_EMISION
} from "./chunk-4FUGVTHD.js";
import {
  AuthService
} from "./chunk-W2463ZNS.js";
import {
  PersonService
} from "./chunk-C4J44J4Z.js";
import {
  aErrorApi
} from "./chunk-LSGUT5KG.js";
import {
  takeUntilDestroyed
} from "./chunk-IJ23LC2U.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormControl,
  FormControlName,
  FormGroup,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-YLHEVWGL.js";
import {
  DestroyRef,
  PLATFORM_ID,
  catchError,
  forkJoin,
  from,
  inject,
  input,
  isPlatformBrowser,
  map,
  mergeMap,
  of,
  output,
  shareReplay,
  signal,
  tap,
  toArray,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-3ZDGBTDF.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-ZX6IUAQ5.js";

// src/app/pages/emision-certificados/compartidos/emision.config.ts
var numero = (nombre, titulo, relacion, opcional = false) => ({ nombre, titulo, tipo: "numero", relacion, opcional });
var texto = (nombre, titulo, max) => ({ nombre, titulo, max });
var fecha = (nombre, titulo) => ({ nombre, titulo, tipo: "fecha" });
var estado = texto("estado", "Estado", 30);
var trabajador = numero("id_persona_trabajador", "Trabajador", "gestion");
var firma = numero("id_firma", "Firma", "firmas");
var certificado = numero("id_certificado", "Certificado", "certificados");
var codigo = texto("codigo_verificacion", "C\xF3digo de verificaci\xF3n", 30);
var origenes = [
  numero("id_reconocimiento", "Reconocimiento de origen", "reconocimientos", true),
  numero("id_participacion", "Participaci\xF3n de origen", "gestion", true),
  numero("id_practica", "Pr\xE1ctica de origen", "gestion", true)
];
var camposCertificado = [
  numero("id_persona", "Persona", "gestion"),
  numero("id_tipo_certificado", "Tipo de certificado", "tipos-certificado"),
  ...origenes,
  __spreadProps(__spreadValues({}, fecha("fecha_emision", "Fecha de emisi\xF3n")), { opcional: true }),
  { nombre: "estado", titulo: "Activo", tipo: "booleano" },
  { nombre: "notificado", titulo: "Notificado", tipo: "booleano" },
  { nombre: "fecha_notificacion", titulo: "Fecha de notificaci\xF3n", tipo: "fecha-hora", opcional: true }
];
var camposReconocimiento = [
  trabajador,
  texto("titulo", "T\xEDtulo", 150),
  __spreadProps(__spreadValues({}, texto("descripcion", "Descripci\xF3n", 500)), { tipo: "multilinea" }),
  __spreadProps(__spreadValues({}, texto("motivo", "Motivo", 500)), { tipo: "multilinea" }),
  fecha("fecha_reconocimiento", "Fecha de reconocimiento"),
  estado
];
var documentoEstado = __spreadProps(__spreadValues({}, estado), { opciones: ["GENERADO", "ANULADO"] });
var camposDocumento = [
  certificado,
  codigo,
  texto("ruta_archivo", "Ruta del PDF privado existente", 255),
  __spreadProps(__spreadValues({}, texto("motivo_reemision", "Motivo de reemisi\xF3n", 255)), { opcional: true }),
  documentoEstado,
  fecha("fecha_generacion", "Fecha de generaci\xF3n")
];
var camposFirma = [
  trabajador,
  texto("ruta_archivo_pfx", "Ruta del PFX privado existente", 255),
  __spreadProps(__spreadValues({}, texto("passphrase", "Contrase\xF1a del PFX", 255)), { tipo: "secreto" }),
  fecha("fecha_firma", "Fecha de firma")
];
var camposAsignacion = [
  numero("id_actividad", "Actividad", "gestion"),
  firma,
  numero("orden_firma", "Orden de firma")
];
var camposFirmaAplicada = [
  numero("id_certificado_documento", "Documento"),
  firma,
  fecha("fecha_firma", "Fecha de firma"),
  numero("orden_firma", "Orden de firma")
];
var camposConsulta = [
  numero("id_certificado_documento", "Documento"),
  texto("dni_consulta", "DNI consultado", 8),
  texto("codigo_consulta", "C\xF3digo consultado", 50),
  { nombre: "fecha_consulta", titulo: "Fecha de consulta", tipo: "fecha-hora" },
  texto("resultado", "Resultado", 50)
];
var actividad = numero("id_actividad", "Actividad", "gestion");
var camposActividad = [
  numero("id_area", "\xC1rea", "gestion"),
  numero("id_tipo_actividad", "Tipo de actividad", "gestion"),
  texto("nombre", "Nombre", 100),
  __spreadProps(__spreadValues({}, texto("descripcion", "Descripci\xF3n", 255)), { opcional: true, tipo: "multilinea" }),
  fecha("fecha_inicio", "Inicio"),
  fecha("fecha_fin", "Fin"),
  __spreadProps(__spreadValues({}, texto("sede", "Sede", 100)), { opcional: true }),
  __spreadProps(__spreadValues({}, estado), { opciones: ["Activa", "Cerrada"] })
];
var camposSesion = [
  actividad,
  texto("nombre", "Nombre", 150),
  fecha("fecha", "Fecha"),
  { nombre: "hora_inicio", titulo: "Hora de inicio", tipo: "hora" },
  { nombre: "hora_fin", titulo: "Hora de fin", tipo: "hora" },
  __spreadProps(__spreadValues({}, texto("lugar", "Lugar", 200)), { opcional: true }),
  estado
];
var camposParticipacion = [
  numero("id_persona", "Persona existente de Gesti\xF3n", "gestion"),
  actividad,
  numero("id_tipo_participacion", "Tipo de participaci\xF3n", "gestion"),
  fecha("fecha_inscripcion", "Inscripci\xF3n"),
  estado
];
var camposAsistencia = [
  numero("id_participacion", "Participaci\xF3n", "gestion"),
  numero("id_actividad_sesion", "Sesi\xF3n", "gestion"),
  { nombre: "hora_entrada", titulo: "Hora de entrada", tipo: "hora", opcional: true },
  { nombre: "hora_salida", titulo: "Hora de salida", tipo: "hora", opcional: true },
  estado
];
var camposPonente = [actividad, numero("id_persona_ponente", "Ponente existente de Gesti\xF3n", "gestion")];
var camposTipoActividad = [texto("nombre", "Nombre", 100), __spreadProps(__spreadValues({}, texto("descripcion", "Descripci\xF3n", 255)), { opcional: true }), __spreadProps(__spreadValues({}, estado), { tipo: "booleano" })];
var camposTipoParticipacion = [texto("nombre", "Nombre", 50), __spreadProps(__spreadValues({}, estado), { tipo: "booleano" })];
var CONFIGURACION_EMISION = {
  activity: { titulo: "Actividades", clave: "id_actividad", campos: camposActividad, columnas: camposActividad, filtros: [camposActividad[2], camposActividad[7]] },
  "activity-session": { titulo: "Sesiones", clave: "id_actividad_sesion", campos: camposSesion, columnas: camposSesion, filtros: [actividad, camposSesion[2]] },
  "activity-speaker": { titulo: "Ponentes de actividades", clave: "id_actividad_ponente", campos: camposPonente, columnas: camposPonente, filtros: camposPonente },
  "ativicty-type": { titulo: "Tipos de actividad", clave: "id_tipo_actividad", campos: camposTipoActividad, columnas: camposTipoActividad, filtros: [camposTipoActividad[0]] },
  participation: { titulo: "Participantes", clave: "id_participacion", campos: camposParticipacion, columnas: camposParticipacion, filtros: [camposParticipacion[0], actividad, estado] },
  "participation-type": { titulo: "Tipos de participaci\xF3n", clave: "id_tipo_participacion", campos: camposTipoParticipacion, columnas: camposTipoParticipacion, filtros: [camposTipoParticipacion[0]] },
  attendance: { titulo: "Asistencias", clave: "id_asistencia", campos: camposAsistencia, columnas: camposAsistencia, filtros: [camposAsistencia[0], camposAsistencia[1], estado] },
  certificados: {
    titulo: "Certificados",
    clave: "id_certificado",
    campos: camposCertificado,
    columnas: [camposCertificado[0], camposCertificado[1], camposCertificado[5], camposCertificado[6]],
    filtros: [camposCertificado[0], camposCertificado[1], camposCertificado[6]],
    aviso: "Puedes seleccionar un origen: reconocimiento, participaci\xF3n o pr\xE1ctica. Son mutuamente excluyentes y la persona debe coincidir con el origen elegido."
  },
  "tipos-certificado": {
    titulo: "Tipos de certificado",
    clave: "id_tipo_certificado",
    campos: [texto("nombre_tipo", "Nombre del tipo", 64), texto("estado", "Estado", 64)],
    columnas: [texto("nombre_tipo", "Nombre"), estado],
    filtros: [texto("nombre_tipo", "Nombre"), estado]
  },
  reconocimientos: {
    titulo: "Reconocimientos",
    clave: "id_reconocimiento",
    campos: camposReconocimiento,
    columnas: [trabajador, camposReconocimiento[1], camposReconocimiento[4], estado],
    filtros: [trabajador, estado]
  },
  "certificados-documentos": {
    titulo: "Documentos",
    clave: "id_certificado_documento",
    campos: camposDocumento,
    columnas: [certificado, codigo, documentoEstado, camposDocumento[5]],
    filtros: [certificado, codigo, documentoEstado],
    aviso: "Solo se registran PDF que ya existen en el almacenamiento privado autorizado. No hay carga, generaci\xF3n ni descarga de PDF disponible. Los documentos hist\xF3ricos no se eliminan."
  },
  firmas: {
    titulo: "Firmas",
    clave: "id_firma",
    campos: camposFirma,
    columnas: [trabajador, camposFirma[3]],
    filtros: [trabajador],
    aviso: "El PFX debe existir en el almacenamiento privado autorizado. Su contrase\xF1a no se guarda en el navegador. Registrar el PFX no firma digitalmente un documento."
  },
  "actividades-firmas": {
    titulo: "Asignar firmantes",
    clave: "id_actividad_firma",
    campos: camposAsignacion,
    columnas: camposAsignacion,
    filtros: [camposAsignacion[0], firma],
    aviso: "Esta asignaci\xF3n define el orden de los firmantes de una actividad existente. No aplica una firma digital."
  },
  "certificados-firmas": {
    titulo: "Firmas aplicadas",
    clave: "id_certificado_firma",
    campos: [],
    columnas: camposFirmaAplicada,
    filtros: [camposFirmaAplicada[0], firma],
    aviso: "Consulta de solo lectura. La aplicaci\xF3n de firmas digitales a\xFAn no est\xE1 disponible."
  },
  "consultas-certificado": {
    titulo: "Historial de consultas",
    clave: "id_consulta_certificado",
    campos: [],
    columnas: camposConsulta,
    filtros: [camposConsulta[1], camposConsulta[2]],
    aviso: "Historial de solo lectura. No se modifican los resultados de consultas anteriores."
  }
};
function esEditable(recurso) {
  return recurso !== "certificados-firmas" && recurso !== "consultas-certificado";
}
function esEliminable(recurso) {
  return esEditable(recurso) && recurso !== "certificados-documentos";
}

// src/app/pages/emision-certificados/actividades/estados-sesiones-asistencia.ts
var ESTADOS_SESIONES = [
  { valor: "activo", etiqueta: "Activo" },
  { valor: "cerrado", etiqueta: "Cerrado" },
  { valor: "culminado", etiqueta: "Culminado" }
];
var ESTADOS_ASISTENCIAS = [
  { valor: "presente", etiqueta: "Presente" },
  { valor: "ausente", etiqueta: "Ausente" },
  { valor: "activo", etiqueta: "Activo (hist\xF3rico)" },
  { valor: "inactivo", etiqueta: "Inactivo (hist\xF3rico)" }
];
function resultadoPresencia(fila) {
  if (fila["duplicada"])
    return "duplicada";
  if (!fila["id_asistencia"])
    return "pendiente";
  const estado2 = String(fila["estado"] ?? "").trim().toLocaleLowerCase();
  return estado2 === "presente" || estado2 === "ausente" ? estado2 : "sin_clasificar";
}
function resumenPresencia(filas) {
  const cantidad = (estado2) => filas.filter((fila) => resultadoPresencia(fila) === estado2).length;
  return {
    inscritos: filas.length,
    presentes: cantidad("presente"),
    ausentes: cantidad("ausente"),
    pendientes: cantidad("pendiente"),
    porRevisar: cantidad("sin_clasificar") + cantidad("duplicada")
  };
}
function estadoListado(valor, asistencia) {
  const texto2 = String(valor ?? "").trim().toLocaleLowerCase();
  if (!asistencia && texto2 === "activa")
    return "activo";
  if (!asistencia && texto2 === "cerrada")
    return "cerrado";
  return texto2;
}
function etiquetaEstado(valor, asistencia) {
  const opciones = asistencia ? ESTADOS_ASISTENCIAS : ESTADOS_SESIONES;
  return opciones.find((opcion) => opcion.valor === estadoListado(valor, asistencia))?.etiqueta ?? (asistencia ? "Estado sin clasificaci\xF3n" : String(valor ?? ""));
}

// src/app/pages/emision-certificados/configuracion/tipos-certificado/clasificaciones-listado.ts
var ESTADOS_CLASIFICACIONES = [{ valor: "1", etiqueta: "Activo" }, { valor: "0", etiqueta: "Inactivo" }];
function estadoClasificacion(valor) {
  if (valor === true || valor === 1 || valor === "1" || valor === "true")
    return "1";
  if (valor === false || valor === 0 || valor === "0" || valor === "false")
    return "0";
  return "";
}
var normalizar = (texto2) => texto2.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();
var ClasificacionesListado = class _ClasificacionesListado {
  api = inject(EmisionCertificadosService);
  recurso;
  filas = [];
  invalidar() {
    this.recurso = void 0;
  }
  cargar(recurso) {
    if (this.recurso === recurso)
      return of(void 0);
    return this.api.listarTodos(recurso).pipe(tap((filas) => {
      this.filas = filas;
      this.recurso = recurso;
    }), map(() => void 0));
  }
  paginar(nombre, estado2, numero2, cantidad) {
    const campo = this.recurso === "tipos-certificado" ? "nombre_tipo" : "nombre";
    const texto2 = normalizar(nombre);
    const filas = this.filas.filter((fila) => (!texto2 || normalizar(String(fila[campo] ?? "")).includes(texto2)) && (!estado2 || estadoClasificacion(fila["estado"]) === estado2));
    const ultima = Math.max(1, Math.ceil(filas.length / cantidad));
    const pagina = Math.max(1, Math.min(numero2, ultima));
    return {
      data: filas.slice((pagina - 1) * cantidad, pagina * cantidad),
      total: filas.length,
      current_page: pagina,
      last_page: ultima,
      per_page: cantidad
    };
  }
  static \u0275fac = function ClasificacionesListado_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ClasificacionesListado)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ClasificacionesListado, factory: _ClasificacionesListado.\u0275fac });
};

// src/app/pages/emision-certificados/compartidos/formulario-emision.component.ts
var _forTrack0 = ($index, $item) => $item.nombre;
var _forTrack1 = ($index, $item) => $item.valor;
var _forTrack2 = ($index, $item) => $item.id;
var _c0 = () => [];
function FormularioEmisionComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 0);
    \u0275\u0275text(1, "No tienes permiso para realizar esta operaci\xF3n.");
    \u0275\u0275elementEnd();
  }
}
function FormularioEmisionComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 1);
    \u0275\u0275text(1, "Cargando registro\u2026");
    \u0275\u0275elementEnd();
  }
}
function FormularioEmisionComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 0);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 3);
    \u0275\u0275listener("click", function FormularioEmisionComponent_Conditional_2_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargar());
    });
    \u0275\u0275text(3, "Reintentar");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.errorCarga());
  }
}
function FormularioEmisionComponent_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.config.aviso);
  }
}
function FormularioEmisionComponent_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 0);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_3_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const estado_r4 = ctx.$implicit;
    \u0275\u0275property("value", estado_r4.valor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(estado_r4.etiqueta);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "select", 13);
    \u0275\u0275repeaterCreate(1, FormularioEmisionComponent_Conditional_3_For_8_Conditional_3_For_2_Template, 2, 2, "option", 17, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campo_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", ctx_r1.recurso() + "-" + campo_r5.nombre)("formControlName", campo_r5.nombre);
    \u0275\u0275attribute("aria-invalid", !!ctx_r1.errorCampo(campo_r5))("aria-describedby", ctx_r1.recurso() + "-" + campo_r5.nombre + "-error");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.estadosClasificaciones);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 18);
    \u0275\u0275text(1, "Seleccionar estado");
    \u0275\u0275elementEnd();
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_4_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const estado_r6 = ctx.$implicit;
    \u0275\u0275property("value", estado_r6.valor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(estado_r6.etiqueta);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 4);
    \u0275\u0275text(1, "Estado actual sin clasificaci\xF3n. Selecciona un estado de asistencia para regularizarlo.");
    \u0275\u0275elementEnd();
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "select", 13);
    \u0275\u0275template(1, FormularioEmisionComponent_Conditional_3_For_8_Conditional_4_Conditional_1_Template, 2, 0, "option", 18);
    \u0275\u0275repeaterCreate(2, FormularioEmisionComponent_Conditional_3_For_8_Conditional_4_For_3_Template, 2, 2, "option", 17, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, FormularioEmisionComponent_Conditional_3_For_8_Conditional_4_Conditional_4_Template, 2, 0, "small", 4);
  }
  if (rf & 2) {
    const campo_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", ctx_r1.recurso() + "-" + campo_r5.nombre)("formControlName", campo_r5.nombre);
    \u0275\u0275attribute("aria-invalid", !!ctx_r1.errorCampo(campo_r5))("aria-describedby", ctx_r1.recurso() + "-" + campo_r5.nombre + "-error");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.estadoHistorico() !== null ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.estadosAsistencias);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.estadoHistorico() ? 4 : -1);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 14);
  }
  if (rf & 2) {
    const campo_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", ctx_r1.recurso() + "-" + campo_r5.nombre)("formControlName", campo_r5.nombre);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_6_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const actual_r8 = ctx;
    \u0275\u0275property("value", actual_r8);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Trabajador #", actual_r8, " \xB7 selecci\xF3n actual");
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_6_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opcion_r9 = ctx.$implicit;
    \u0275\u0275property("value", opcion_r9.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(opcion_r9.texto);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_6_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1, "Se requiere el permiso institucional de lectura de trabajadores para seleccionar uno. No se pueden registrar personas desde este formulario.");
    \u0275\u0275elementEnd();
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_6_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 22);
    \u0275\u0275text(1, "No hay trabajadores con esta b\xFAsqueda. Los trabajadores se registran exclusivamente desde Gesti\xF3n.");
    \u0275\u0275elementEnd();
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 19);
    \u0275\u0275text(1, "Buscar por nombre, apellido, cargo o ID de trabajador");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "input", 20);
    \u0275\u0275listener("input", function FormularioEmisionComponent_Conditional_3_For_8_Conditional_6_Template_input_input_2_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.busquedaTrabajador.set($event.target.value));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 13)(4, "option", 21);
    \u0275\u0275text(5, "Seleccionar trabajador registrado");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, FormularioEmisionComponent_Conditional_3_For_8_Conditional_6_Conditional_6_Template, 2, 2, "option", 17);
    \u0275\u0275repeaterCreate(7, FormularioEmisionComponent_Conditional_3_For_8_Conditional_6_For_8_Template, 2, 2, "option", 17, _forTrack2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(9, FormularioEmisionComponent_Conditional_3_For_8_Conditional_6_Conditional_9_Template, 2, 0, "p", 4)(10, FormularioEmisionComponent_Conditional_3_For_8_Conditional_6_Conditional_10_Template, 2, 0, "p", 22);
  }
  if (rf & 2) {
    let tmp_17_0;
    const campo_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r1.busquedaTrabajador());
    \u0275\u0275advance();
    \u0275\u0275property("id", ctx_r1.recurso() + "-" + campo_r5.nombre)("formControlName", campo_r5.nombre);
    \u0275\u0275attribute("aria-invalid", !!ctx_r1.errorCampo(campo_r5))("aria-describedby", ctx_r1.recurso() + "-" + campo_r5.nombre + "-error");
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_17_0 = ctx_r1.trabajadorSinOpcion()) ? 6 : -1, tmp_17_0);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.opcionesTrabajador());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r1.puedeLeerTrabajadores ? 9 : !ctx_r1.cargandoRelacion().has(campo_r5.nombre) && !ctx_r1.errorRelacion()[campo_r5.nombre] && !ctx_r1.opcionesTrabajador().length ? 10 : -1);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_7_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const estado_r10 = ctx.$implicit;
    \u0275\u0275property("value", estado_r10);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(estado_r10);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_7_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 1);
    \u0275\u0275text(1, "Consultando estados\u2026");
    \u0275\u0275elementEnd();
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_7_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "small", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 3);
    \u0275\u0275listener("click", function FormularioEmisionComponent_Conditional_3_For_8_Conditional_7_Conditional_6_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.cargarEstados());
    });
    \u0275\u0275text(3, "Reintentar estados");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_7_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 1);
    \u0275\u0275text(1, "No hay estados registrados. Se requiere definir el cat\xE1logo institucional en Laravel antes de registrar el primer reconocimiento.");
    \u0275\u0275elementEnd();
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "select", 13)(1, "option", 21);
    \u0275\u0275text(2, "Seleccionar estado registrado");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, FormularioEmisionComponent_Conditional_3_For_8_Conditional_7_For_4_Template, 2, 2, "option", 17, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, FormularioEmisionComponent_Conditional_3_For_8_Conditional_7_Conditional_5_Template, 2, 0, "small", 1)(6, FormularioEmisionComponent_Conditional_3_For_8_Conditional_7_Conditional_6_Template, 4, 1)(7, FormularioEmisionComponent_Conditional_3_For_8_Conditional_7_Conditional_7_Template, 2, 0, "small", 1);
  }
  if (rf & 2) {
    let tmp_18_0;
    const campo_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", ctx_r1.recurso() + "-" + campo_r5.nombre)("formControlName", campo_r5.nombre);
    \u0275\u0275attribute("aria-invalid", !!ctx_r1.errorCampo(campo_r5))("aria-describedby", ctx_r1.recurso() + "-" + campo_r5.nombre + "-error");
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.estadosReconocimiento());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.cargandoEstados() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_18_0 = ctx_r1.errorEstados()) ? 6 : !ctx_r1.cargandoEstados() && !ctx_r1.estadosReconocimiento().length ? 7 : -1, tmp_18_0);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_8_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opcion_r12 = ctx.$implicit;
    \u0275\u0275property("value", opcion_r12);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(opcion_r12);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "select", 13)(1, "option", 21);
    \u0275\u0275text(2, "Seleccionar");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, FormularioEmisionComponent_Conditional_3_For_8_Conditional_8_For_4_Template, 2, 2, "option", 17, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campo_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", ctx_r1.recurso() + "-" + campo_r5.nombre)("formControlName", campo_r5.nombre);
    \u0275\u0275attribute("aria-invalid", !!ctx_r1.errorCampo(campo_r5))("aria-describedby", ctx_r1.recurso() + "-" + campo_r5.nombre + "-error");
    \u0275\u0275advance(3);
    \u0275\u0275repeater(campo_r5.opciones);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "textarea", 13);
  }
  if (rf & 2) {
    const campo_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", ctx_r1.recurso() + "-" + campo_r5.nombre)("formControlName", campo_r5.nombre);
    \u0275\u0275attribute("maxlength", campo_r5.max)("aria-invalid", !!ctx_r1.errorCampo(campo_r5))("aria-describedby", ctx_r1.recurso() + "-" + campo_r5.nombre + "-error");
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_10_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opcion_r13 = ctx.$implicit;
    \u0275\u0275property("value", opcion_r13.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(opcion_r13.texto);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "select", 13)(1, "option", 21);
    \u0275\u0275text(2, "Seleccionar registro existente");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, FormularioEmisionComponent_Conditional_3_For_8_Conditional_10_For_4_Template, 2, 2, "option", 17, _forTrack2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_15_0;
    const campo_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", ctx_r1.recurso() + "-" + campo_r5.nombre)("formControlName", campo_r5.nombre);
    \u0275\u0275attribute("autofocus", ctx_r1.enDialogo() && campo_r5 === ctx_r1.config.campos[0] ? true : null);
    \u0275\u0275advance(3);
    \u0275\u0275repeater((tmp_15_0 = ctx_r1.opciones()[campo_r5.nombre]) !== null && tmp_15_0 !== void 0 ? tmp_15_0 : \u0275\u0275pureFunction0(3, _c0));
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 15);
  }
  if (rf & 2) {
    const campo_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", ctx_r1.recurso() + "-" + campo_r5.nombre)("formControlName", campo_r5.nombre)("type", campo_r5.tipo === "secreto" ? "password" : campo_r5.tipo === "numero" ? "number" : campo_r5.tipo === "fecha" ? "date" : campo_r5.tipo === "hora" ? "time" : campo_r5.tipo === "fecha-hora" ? "datetime-local" : "text");
    \u0275\u0275attribute("min", campo_r5.tipo === "numero" ? 1 : null)("maxlength", campo_r5.max)("autocomplete", campo_r5.tipo === "secreto" ? "new-password" : "off")("list", campo_r5.relacion ? ctx_r1.recurso() + "-" + campo_r5.nombre + "-opciones" : null)("aria-invalid", !!ctx_r1.errorCampo(campo_r5))("aria-describedby", ctx_r1.recurso() + "-" + campo_r5.nombre + "-error");
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_12_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function FormularioEmisionComponent_Conditional_3_For_8_Conditional_12_Conditional_0_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r14);
      const campo_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cargarOpciones(campo_r5));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campo_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.cargandoRelacion().has(campo_r5.nombre));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.cargandoRelacion().has(campo_r5.nombre) ? "Cargando\u2026" : "Ver registros disponibles");
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_12_Conditional_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opcion_r15 = ctx.$implicit;
    \u0275\u0275property("value", opcion_r15.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(opcion_r15.texto);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_12_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "datalist", 25);
    \u0275\u0275repeaterCreate(1, FormularioEmisionComponent_Conditional_3_For_8_Conditional_12_Conditional_1_For_2_Template, 2, 2, "option", 17, _forTrack2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_14_0;
    const campo_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", ctx_r1.recurso() + "-" + campo_r5.nombre + "-opciones");
    \u0275\u0275advance();
    \u0275\u0275repeater((tmp_14_0 = ctx_r1.opciones()[campo_r5.nombre]) !== null && tmp_14_0 !== void 0 ? tmp_14_0 : \u0275\u0275pureFunction0(1, _c0));
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_12_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, FormularioEmisionComponent_Conditional_3_For_8_Conditional_12_Conditional_0_Template, 2, 2, "button", 24)(1, FormularioEmisionComponent_Conditional_3_For_8_Conditional_12_Conditional_1_Template, 3, 2, "datalist", 25);
    \u0275\u0275elementStart(2, "small", 4);
    \u0275\u0275text(3, "Selecciona un registro existente. Los cat\xE1logos se administran en su m\xF3dulo de origen.");
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, FormularioEmisionComponent_Conditional_3_For_8_Conditional_12_Conditional_4_Template, 2, 1, "small", 23);
  }
  if (rf & 2) {
    let tmp_14_0;
    const campo_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(!(ctx_r1.actividadContexto() && campo_r5.nombre === "id_actividad") ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.enDialogo() ? 1 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_14_0 = ctx_r1.errorRelacion()[campo_r5.nombre]) ? 4 : -1, tmp_14_0);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_13_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_13_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 1);
    \u0275\u0275text(1, "Cargando trabajadores\u2026");
    \u0275\u0275elementEnd();
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_13_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 27);
    \u0275\u0275listener("click", function FormularioEmisionComponent_Conditional_3_For_8_Conditional_13_Conditional_2_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r16);
      const campo_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cargarOpciones(campo_r5));
    });
    \u0275\u0275text(3, "Reintentar");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, FormularioEmisionComponent_Conditional_3_For_8_Conditional_13_Conditional_0_Template, 2, 1, "p", 22)(1, FormularioEmisionComponent_Conditional_3_For_8_Conditional_13_Conditional_1_Template, 2, 0, "p", 1)(2, FormularioEmisionComponent_Conditional_3_For_8_Conditional_13_Conditional_2_Template, 4, 1);
  }
  if (rf & 2) {
    let tmp_12_0;
    let tmp_14_0;
    const campo_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_12_0 = ctx_r1.advertenciaTrabajador()) ? 0 : -1, tmp_12_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.cargandoRelacion().has(campo_r5.nombre) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_14_0 = ctx_r1.errorRelacion()[campo_r5.nombre]) ? 2 : -1, tmp_14_0);
  }
}
function FormularioEmisionComponent_Conditional_3_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "label", 12);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, FormularioEmisionComponent_Conditional_3_For_8_Conditional_3_Template, 3, 4, "select", 13)(4, FormularioEmisionComponent_Conditional_3_For_8_Conditional_4_Template, 5, 6)(5, FormularioEmisionComponent_Conditional_3_For_8_Conditional_5_Template, 1, 2, "input", 14)(6, FormularioEmisionComponent_Conditional_3_For_8_Conditional_6_Template, 11, 7)(7, FormularioEmisionComponent_Conditional_3_For_8_Conditional_7_Template, 8, 6)(8, FormularioEmisionComponent_Conditional_3_For_8_Conditional_8_Template, 5, 4, "select", 13)(9, FormularioEmisionComponent_Conditional_3_For_8_Conditional_9_Template, 1, 5, "textarea", 13)(10, FormularioEmisionComponent_Conditional_3_For_8_Conditional_10_Template, 5, 4, "select", 13)(11, FormularioEmisionComponent_Conditional_3_For_8_Conditional_11_Template, 1, 9, "input", 15)(12, FormularioEmisionComponent_Conditional_3_For_8_Conditional_12_Template, 5, 3)(13, FormularioEmisionComponent_Conditional_3_For_8_Conditional_13_Template, 3, 3);
    \u0275\u0275elementStart(14, "small", 16);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const campo_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("for", ctx_r1.recurso() + "-" + campo_r5.nombre);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", campo_r5.titulo, "", ctx_r1.opcional(campo_r5) ? " (opcional)" : "", "");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.clasificacion() && ctx_r1.recurso() === "tipos-certificado" && campo_r5.nombre === "estado" ? 3 : ctx_r1.recurso() === "attendance" && campo_r5.nombre === "estado" ? 4 : campo_r5.tipo === "booleano" ? 5 : ctx_r1.recurso() === "reconocimientos" && campo_r5.nombre === "id_persona_trabajador" ? 6 : ctx_r1.recurso() === "reconocimientos" && campo_r5.nombre === "estado" ? 7 : campo_r5.opciones ? 8 : campo_r5.tipo === "multilinea" ? 9 : campo_r5.relacion ? 10 : 11);
    \u0275\u0275advance(9);
    \u0275\u0275conditional(campo_r5.relacion && !(ctx_r1.recurso() === "reconocimientos" && campo_r5.nombre === "id_persona_trabajador") ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.recurso() === "reconocimientos" && campo_r5.nombre === "id_persona_trabajador" ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("id", ctx_r1.recurso() + "-" + campo_r5.nombre + "-error");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.errorCampo(campo_r5));
  }
}
function FormularioEmisionComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275template(0, FormularioEmisionComponent_Conditional_3_Conditional_0_Template, 2, 1, "p", 4)(1, FormularioEmisionComponent_Conditional_3_Conditional_1_Template, 2, 1, "p", 0);
    \u0275\u0275elementStart(2, "form", 5);
    \u0275\u0275listener("ngSubmit", function FormularioEmisionComponent_Conditional_3_Template_form_ngSubmit_2_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.guardar());
    });
    \u0275\u0275elementStart(3, "fieldset", 6)(4, "legend");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 7);
    \u0275\u0275repeaterCreate(7, FormularioEmisionComponent_Conditional_3_For_8_Template, 16, 8, "div", 8, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 9)(10, "button", 10);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "button", 11);
    \u0275\u0275listener("click", function FormularioEmisionComponent_Conditional_3_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cancelar.emit());
    });
    \u0275\u0275text(13, "Cancelar");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.config.aviso ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_2_0 = ctx_r1.errorGeneral()) ? 1 : -1, tmp_2_0);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r1.form());
    \u0275\u0275attribute("aria-busy", ctx_r1.enviando());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.enviando());
    \u0275\u0275advance();
    \u0275\u0275classProp("sr-only", ctx_r1.enDialogo());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.id() === null ? "Nuevo registro" : "Editar registro #" + ctx_r1.id());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.config.campos);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.enviando());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.enviando() ? "Guardando\u2026" : ctx_r1.recurso() === "reconocimientos" && ctx_r1.id() === null ? "Registrar reconocimiento" : "Guardar");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.enviando());
  }
}
var FormularioEmisionComponent = class _FormularioEmisionComponent {
  recurso = input.required();
  id = input(null);
  enDialogo = input(false);
  clasificacion = input(false);
  actividadContexto = input(null);
  asistenciaContexto = input(null);
  personasApi = inject(PersonService);
  estadosClasificaciones = ESTADOS_CLASIFICACIONES;
  guardado = output();
  cancelar = output();
  api = inject(EmisionCertificadosService);
  auth = inject(AuthService);
  destroyRef = inject(DestroyRef);
  plataforma = inject(PLATFORM_ID);
  carga;
  original = null;
  form = signal(new FormGroup({}));
  hayCambiosSinGuardar() {
    return this.form().dirty;
  }
  cargando = signal(false);
  enviando = signal(false);
  errorCarga = signal(null);
  errorGeneral = signal(null);
  errores = signal({});
  opciones = signal({});
  errorRelacion = signal({});
  cargandoRelacion = signal(/* @__PURE__ */ new Set());
  estadosReconocimiento = signal([]);
  errorEstados = signal(null);
  advertenciaTrabajador = signal(null);
  cargandoEstados = signal(false);
  busquedaTrabajador = signal("");
  estadosAsistencias = ESTADOS_ASISTENCIAS;
  estadoHistorico = signal(null);
  get puedeLeerTrabajadores() {
    return this.auth.tienePermiso("ponentes-firmantes.ver");
  }
  opcionesTrabajador() {
    const busqueda = this.busquedaTrabajador().trim().toLocaleLowerCase();
    const seleccionado = String(this.form().controls["id_persona_trabajador"]?.value ?? "");
    return (this.opciones()["id_persona_trabajador"] ?? []).filter((fila) => String(fila.id) === seleccionado || fila.texto.toLocaleLowerCase().includes(busqueda));
  }
  trabajadorSinOpcion() {
    const valor = String(this.form().controls["id_persona_trabajador"]?.value ?? "");
    return valor && !this.opcionesTrabajador().some((fila) => String(fila.id) === valor) ? valor : null;
  }
  get config() {
    return CONFIGURACION_EMISION[this.recurso()];
  }
  get permitido() {
    return this.auth.tienePermiso(`${PERMISOS_EMISION[this.recurso()]}.${this.id() === null ? "crear" : "editar"}`);
  }
  ngOnChanges() {
    this.carga?.unsubscribe();
    this.original = null;
    this.estadoHistorico.set(null);
    this.errorCarga.set(null);
    this.errorGeneral.set(null);
    this.errores.set({});
    this.opciones.set({});
    this.errorRelacion.set({});
    this.estadosReconocimiento.set([]);
    this.errorEstados.set(null);
    this.advertenciaTrabajador.set(null);
    const controles = {};
    for (const campo of this.config.campos) {
      const reglas = [];
      if (!this.opcional(campo) && campo.tipo !== "booleano")
        reglas.push(Validators.required);
      if (this.recurso() === "reconocimientos" && campo.tipo === "multilinea")
        reglas.push((control) => String(control.value).trim() ? null : { required: true });
      if (this.recurso() === "reconocimientos" && !campo.tipo && !campo.relacion)
        reglas.push((control) => String(control.value).trim() ? null : { required: true });
      if (campo.max)
        reglas.push(Validators.maxLength(campo.max));
      if (campo.tipo === "numero")
        reglas.push(Validators.min(1), Validators.pattern(/^\d+$/));
      if (this.recurso() === "reconocimientos" && campo.tipo === "fecha")
        reglas.push((control) => {
          const valor = String(control.value);
          const fecha2 = /* @__PURE__ */ new Date(`${valor}T00:00:00Z`);
          return /^\d{4}-\d{2}-\d{2}$/.test(valor) && !Number.isNaN(fecha2.getTime()) && fecha2.toISOString().slice(0, 10) === valor ? null : { fecha: true };
        });
      const estadoAsistencia = this.recurso() === "attendance" && campo.nombre === "estado";
      if (estadoAsistencia)
        reglas.push((control) => ESTADOS_ASISTENCIAS.some((estado2) => estado2.valor === control.value) ? null : { estado: true });
      controles[campo.nombre] = new FormControl(estadoAsistencia && this.id() === null ? ESTADOS_ASISTENCIAS[0].valor : campo.tipo === "booleano" ? false : "", { nonNullable: true, validators: reglas });
      controles[campo.nombre].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.errores.update((actual) => {
          const copia = __spreadValues({}, actual);
          delete copia[campo.nombre];
          return copia;
        });
      });
    }
    this.form.set(new FormGroup(controles));
    if (this.recurso() === "attendance" && this.asistenciaContexto()) {
      for (const campo of ["id_participacion", "id_actividad_sesion"]) {
        controles[campo].setValue(String(this.asistenciaContexto()[campo]));
        controles[campo].disable({ emitEvent: false });
      }
    }
    if (this.actividadContexto() && controles["id_actividad"]) {
      controles["id_actividad"].setValue(String(this.actividadContexto().id_actividad));
      controles["id_actividad"].disable({ emitEvent: false });
    }
    if (this.clasificacion() && this.recurso() === "tipos-certificado") {
      controles["estado"].setValue("1");
      controles["estado"].addValidators(Validators.pattern(/^[01]$/));
      controles["estado"].updateValueAndValidity();
    }
    this.busquedaTrabajador.set("");
    if (isPlatformBrowser(this.plataforma) && this.permitido) {
      if (this.recurso() === "reconocimientos")
        this.cargarEstados();
      for (const campo of this.config.campos.filter((campo2) => campo2.relacion))
        this.cargarOpciones(campo);
    }
    if (this.id() !== null && isPlatformBrowser(this.plataforma) && this.permitido)
      this.cargar();
  }
  cargar() {
    this.cargando.set(true);
    this.errorCarga.set(null);
    this.carga = this.api.obtener(this.recurso(), this.id()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (registro) => {
        if (this.asistenciaContexto() && (Number(registro["id_participacion"]) !== this.asistenciaContexto().id_participacion || Number(registro["id_actividad_sesion"]) !== this.asistenciaContexto().id_actividad_sesion)) {
          this.errorCarga.set("La asistencia no pertenece a la participaci\xF3n y sesi\xF3n seleccionadas.");
          this.cargando.set(false);
          return;
        }
        if (this.actividadContexto() && this.recurso() === "activity-session" && Number(registro["id_actividad"]) !== this.actividadContexto().id_actividad) {
          this.errorCarga.set("La sesi\xF3n no pertenece a la actividad seleccionada.");
          this.cargando.set(false);
          return;
        }
        this.original = registro;
        const valores = {};
        for (const campo of this.config.campos) {
          const valor = registro[campo.nombre];
          valores[campo.nombre] = campo.tipo === "booleano" ? valor === true || valor === 1 || valor === "1" : valor === null || valor === void 0 ? "" : campo.tipo === "fecha" ? String(valor).slice(0, 10) : campo.tipo === "fecha-hora" ? String(valor).replace(" ", "T").slice(0, 16) : String(valor);
        }
        if (this.recurso() === "attendance") {
          const estado2 = estadoListado(registro["estado"], true);
          if (ESTADOS_ASISTENCIAS.some((opcion) => opcion.valor === estado2))
            valores["estado"] = estado2;
          else {
            this.estadoHistorico.set(String(registro["estado"] ?? ""));
            valores["estado"] = "";
          }
        }
        if (this.clasificacion() && this.recurso() === "tipos-certificado")
          valores["estado"] = estadoClasificacion(registro["estado"]);
        this.form().patchValue(valores);
        if (this.recurso() === "reconocimientos" && valores["estado"]) {
          this.estadosReconocimiento.update((estados) => [.../* @__PURE__ */ new Set([...estados, String(valores["estado"])])].sort());
        }
        this.cargando.set(false);
      },
      error: (error) => {
        this.cargando.set(false);
        this.errorCarga.set(error.mensaje);
      }
    });
  }
  opcional(campo) {
    return !!campo.opcional || this.id() !== null && ["passphrase", "ruta_archivo", "ruta_archivo_pfx"].includes(campo.nombre);
  }
  errorCampo(campo) {
    const control = this.form().controls[campo.nombre];
    if (this.errores()[campo.nombre]?.length)
      return this.errores()[campo.nombre][0];
    if (!control.touched || !control.invalid)
      return null;
    if (this.recurso() !== "reconocimientos")
      return "Completa este campo con un valor v\xE1lido.";
    if (control.hasError("required"))
      return "Este campo es obligatorio.";
    if (control.hasError("maxlength"))
      return `M\xE1ximo ${campo.max} caracteres.`;
    if (control.hasError("fecha"))
      return "Selecciona una fecha v\xE1lida.";
    return "Completa este campo con un valor v\xE1lido.";
  }
  cargarOpciones(campo) {
    const marca = this.asistenciaContexto();
    if (marca && this.recurso() === "attendance" && ["id_participacion", "id_actividad_sesion"].includes(campo.nombre)) {
      const id = campo.nombre === "id_participacion" ? marca.id_participacion : marca.id_actividad_sesion;
      const texto2 = campo.nombre === "id_participacion" ? marca.nombre : "Sesi\xF3n seleccionada";
      this.opciones.update((opciones) => __spreadProps(__spreadValues({}, opciones), { [campo.nombre]: [{ id, texto: texto2 }] }));
      return;
    }
    const contexto = this.actividadContexto();
    if (contexto && campo.nombre === "id_actividad") {
      this.opciones.update((opciones) => __spreadProps(__spreadValues({}, opciones), { id_actividad: [{ id: contexto.id_actividad, texto: contexto.nombre }] }));
      return;
    }
    if (contexto && campo.nombre === "id_actividad_sesion") {
      this.errorRelacion.update((actual) => __spreadProps(__spreadValues({}, actual), { [campo.nombre]: "" }));
      this.cargandoRelacion.update((actual) => /* @__PURE__ */ new Set([...actual, campo.nombre]));
      this.api.listarTodos("activity-session").pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (sesiones) => {
          this.opciones.update((actual) => __spreadProps(__spreadValues({}, actual), { [campo.nombre]: sesiones.filter((s) => Number(s["id_actividad"]) === contexto.id_actividad).map((s) => ({ id: Number(s["id_actividad_sesion"]), texto: String(s["nombre"]) })) }));
          this.finRelacion(campo.nombre);
        },
        error: (error) => {
          this.errorRelacion.update((actual) => __spreadProps(__spreadValues({}, actual), { [campo.nombre]: error.mensaje }));
          this.finRelacion(campo.nombre);
        }
      });
      return;
    }
    if (this.recurso() === "reconocimientos" && campo.nombre === "id_persona_trabajador" && !this.puedeLeerTrabajadores)
      return;
    this.cargandoRelacion.update((actual) => /* @__PURE__ */ new Set([...actual, campo.nombre]));
    const peticion = this.enDialogo() && this.recurso() === "attendance" && campo.nombre === "id_participacion" ? this.opcionesParticipacion() : this.recurso() === "reconocimientos" && campo.nombre === "id_persona_trabajador" ? this.api.trabajadores().pipe(mergeMap((filas) => {
      const personas = /* @__PURE__ */ new Map();
      const areas = /* @__PURE__ */ new Map();
      const referencia = (id, cache, permiso, consulta, etiqueta) => {
        if (!cache.has(id))
          cache.set(id, this.auth.tienePermiso(permiso) ? consulta().pipe(catchError((error) => {
            this.advertenciaTrabajador.set(`${etiqueta}: ${error.status === 401 || error.status === 403 ? "faltan permisos de consulta." : error.mensaje}`);
            return of(`${etiqueta} no disponible`);
          }), shareReplay(1)) : of(`${etiqueta} no disponible (requiere ${permiso})`));
        return cache.get(id);
      };
      return from(filas).pipe(mergeMap((fila) => forkJoin({
        nombre: referencia(fila.id_persona, personas, "personas.verpersonas", () => this.api.personaReconocimiento(fila.id_persona).pipe(map((persona) => [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(" "))), "Nombre"),
        area: referencia(fila.id_area, areas, "areas.ver", () => this.api.areaReconocimiento(fila.id_area).pipe(map((area) => area.nombre)), "\xC1rea")
      }).pipe(map(({ nombre, area }) => ({ id: fila.id_persona_trabajador, texto: `${nombre} \u2014 ${fila.cargo || "Cargo no registrado"} \u2014 ${area} \u2014 #${fila.id_persona_trabajador}` }))), 4), toArray());
    })) : campo.relacion === "gestion" ? this.api.relaciones(campo.nombre) : this.api.listarTodos(campo.relacion).pipe(map((registros) => registros.map((registro) => {
      const cfg = CONFIGURACION_EMISION[campo.relacion];
      const id = Number(registro[cfg.clave]);
      return { id, texto: `#${id} \xB7 ${registro["nombre_tipo"] ?? registro["titulo"] ?? registro["codigo_verificacion"] ?? registro["id_persona_trabajador"] ?? registro["id_persona"] ?? ""}` };
    })));
    peticion.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (opciones) => {
        this.opciones.update((actual) => __spreadProps(__spreadValues({}, actual), { [campo.nombre]: this.enDialogo() ? opciones.map((opcion) => __spreadProps(__spreadValues({}, opcion), { texto: opcion.texto.replace(/^#\d+\s*[\u00b7]\s*/, "") || "Nombre no disponible" })) : opciones }));
        this.errorRelacion.update((actual) => __spreadProps(__spreadValues({}, actual), { [campo.nombre]: "" }));
        this.finRelacion(campo.nombre);
      },
      error: (error) => {
        this.errorRelacion.update((actual) => __spreadProps(__spreadValues({}, actual), { [campo.nombre]: error?.mensaje || aErrorApi(error).mensaje }));
        this.finRelacion(campo.nombre);
      }
    });
  }
  opcionesParticipacion() {
    return forkJoin({ participaciones: this.api.relacionRegistros("participation"), personas: this.personasApi.listar() }).pipe(map(({ participaciones, personas }) => {
      const nombres = new Map(personas.map((persona) => [
        persona.id_persona,
        [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(" ")
      ]));
      return participaciones.filter((fila) => !this.actividadContexto() || Number(fila["id_actividad"]) === this.actividadContexto().id_actividad).map((fila) => ({ id: Number(fila["id_participacion"]), texto: [
        nombres.get(Number(fila["id_persona"])) || "Nombre no disponible",
        fila["fecha_inscripcion"] ? String(fila["fecha_inscripcion"]).slice(0, 10) : ""
      ].filter(Boolean).join(" - ") }));
    }));
  }
  cargarEstados() {
    if (!this.auth.tienePermiso("reconocimientos.ver")) {
      this.errorEstados.set("Se requiere reconocimientos.ver para consultar los estados registrados.");
      return;
    }
    this.cargandoEstados.set(true);
    this.errorEstados.set(null);
    this.api.listarTodos("reconocimientos").pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (filas) => {
        const actual = String(this.form().controls["estado"]?.value ?? "");
        this.estadosReconocimiento.set([.../* @__PURE__ */ new Set([...filas.map((fila) => fila.estado).filter(Boolean), ...actual ? [actual] : []])].sort());
        this.cargandoEstados.set(false);
      },
      error: (error) => {
        this.errorEstados.set(error.mensaje);
        this.cargandoEstados.set(false);
      }
    });
  }
  finRelacion(nombre) {
    this.cargandoRelacion.update((actual) => {
      const copia = new Set(actual);
      copia.delete(nombre);
      return copia;
    });
  }
  guardar() {
    if (this.enviando() || !this.permitido || this.cargando() || this.errorCarga())
      return;
    this.errorGeneral.set(null);
    if (this.form().invalid) {
      this.form().markAllAsTouched();
      return;
    }
    const valores = this.form().getRawValue();
    if (this.actividadContexto() && "id_actividad" in valores && Number(valores["id_actividad"]) !== this.actividadContexto().id_actividad) {
      this.errorGeneral.set("La actividad debe coincidir con el contexto validado.");
      return;
    }
    if (this.recurso() === "reconocimientos" && (!this.estadosReconocimiento().includes(String(valores["estado"])) || this.cargandoEstados())) {
      this.errores.set({ estado: ["Selecciona un estado registrado y autorizado."] });
      return;
    }
    for (const campo of this.config.campos.filter((campo2) => campo2.relacion)) {
      const valor = Number(valores[campo.nombre]);
      if (valores[campo.nombre] === "" && this.opcional(campo))
        continue;
      if (this.original && !this.form().controls[campo.nombre].dirty && !(this.actividadContexto() && ["id_actividad", "id_actividad_sesion", "id_participacion"].includes(campo.nombre)))
        continue;
      if (this.cargandoRelacion().has(campo.nombre) || this.errorRelacion()[campo.nombre] || !this.opciones()[campo.nombre]?.some((opcion) => opcion.id === valor)) {
        this.errorGeneral.set(`Selecciona un registro existente y autorizado para ${campo.titulo}.`);
        return;
      }
    }
    if (this.recurso() === "reconocimientos" && (this.id() === null || this.form().controls["id_persona_trabajador"].dirty)) {
      const trabajador2 = Number(valores["id_persona_trabajador"]);
      if (!this.puedeLeerTrabajadores || !this.opciones()["id_persona_trabajador"]?.some((fila) => fila.id === trabajador2)) {
        this.errorGeneral.set("Selecciona un trabajador existente del cat\xE1logo autorizado de Gesti\xF3n.");
        return;
      }
    }
    const datos = {};
    for (const campo of this.config.campos) {
      const valor = valores[campo.nombre];
      if (this.id() !== null && ["passphrase", "ruta_archivo", "ruta_archivo_pfx"].includes(campo.nombre) && valor === "")
        continue;
      const normalizado = campo.tipo === "secreto" ? String(valor) : typeof valor === "string" ? valor.trim() : valor;
      datos[campo.nombre] = campo.tipo === "numero" ? normalizado === "" ? null : Number(normalizado) : campo.opcional && normalizado === "" ? null : normalizado;
    }
    if (this.recurso() === "certificados") {
      if (["id_reconocimiento", "id_participacion", "id_practica"].filter((campo) => datos[campo] !== null).length !== 1) {
        this.errorGeneral.set("Selecciona exactamente un origen para el certificado.");
        return;
      }
      if (Boolean(datos["notificado"]) !== Boolean(datos["fecha_notificacion"])) {
        this.errorGeneral.set("La fecha de notificaci\xF3n debe corresponder al estado Notificado.");
        return;
      }
      if (datos["fecha_notificacion"] && (!datos["fecha_emision"] || String(datos["fecha_notificacion"]) < String(datos["fecha_emision"]))) {
        this.errorGeneral.set("La notificaci\xF3n requiere una fecha de emisi\xF3n anterior o igual.");
        return;
      }
    }
    if (datos["fecha_inicio"] && datos["fecha_fin"] && String(datos["fecha_fin"]) < String(datos["fecha_inicio"])) {
      this.errorGeneral.set("La fecha final debe ser igual o posterior a la fecha inicial.");
      return;
    }
    if (datos["hora_inicio"] && datos["hora_fin"] && String(datos["hora_fin"]) <= String(datos["hora_inicio"])) {
      this.errorGeneral.set("La hora final debe ser posterior a la hora inicial.");
      return;
    }
    if (datos["hora_entrada"] && datos["hora_salida"] && String(datos["hora_salida"]) < String(datos["hora_entrada"])) {
      this.errorGeneral.set("La salida no puede ser anterior a la entrada.");
      return;
    }
    if (this.original) {
      for (const campo of this.config.campos) {
        if (!this.form().controls[campo.nombre].dirty)
          delete datos[campo.nombre];
      }
      if (!Object.keys(datos).length) {
        this.errorGeneral.set("No hay cambios para guardar.");
        return;
      }
    }
    this.enviando.set(true);
    this.errores.set({});
    const payload = datos;
    const peticion = this.id() === null ? this.api.crear(this.recurso(), payload) : this.api.actualizar(this.recurso(), this.id(), payload);
    peticion.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (registro) => {
        this.enviando.set(false);
        this.form().controls["passphrase"]?.reset("");
        this.guardado.emit(registro);
      },
      error: (error) => {
        this.enviando.set(false);
        this.errorGeneral.set(error.mensaje);
        this.errores.set(error.errores);
        this.form().controls["passphrase"]?.reset("");
      }
    });
  }
  static \u0275fac = function FormularioEmisionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormularioEmisionComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FormularioEmisionComponent, selectors: [["app-formulario-emision"]], inputs: { recurso: [1, "recurso"], id: [1, "id"], enDialogo: [1, "enDialogo"], clasificacion: [1, "clasificacion"], actividadContexto: [1, "actividadContexto"], asistenciaContexto: [1, "asistenciaContexto"] }, outputs: { guardado: "guardado", cancelar: "cancelar" }, standalone: true, features: [\u0275\u0275NgOnChangesFeature, \u0275\u0275StandaloneFeature], decls: 4, vars: 1, consts: [["role", "alert", 1, "alert", "alert-error"], ["role", "status"], [3, "formGroup"], ["type", "button", 1, "btn", 3, "click"], [1, "nota"], [3, "ngSubmit", "formGroup"], [1, "card", 3, "disabled"], [1, "grid"], [1, "form-field"], [1, "acciones"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["type", "button", 1, "btn", 3, "click", "disabled"], [3, "for"], [1, "input", 3, "id", "formControlName"], ["type", "checkbox", 3, "id", "formControlName"], [1, "input", 3, "id", "formControlName", "type"], [1, "errores", 3, "id"], [3, "value"], ["value", "", "disabled", ""], ["for", "buscar-trabajador-form"], ["id", "buscar-trabajador-form", "type", "search", 1, "input", 3, "input", "value"], ["value", ""], ["role", "status", 1, "nota"], ["role", "alert", 1, "errores"], ["type", "button", 1, "btn", "btn-consulta", 3, "disabled"], [3, "id"], ["type", "button", 1, "btn", "btn-consulta", 3, "click", "disabled"], ["type", "button", 1, "btn", "btn-consulta", 3, "click"]], template: function FormularioEmisionComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, FormularioEmisionComponent_Conditional_0_Template, 2, 0, "p", 0)(1, FormularioEmisionComponent_Conditional_1_Template, 2, 0, "p", 1)(2, FormularioEmisionComponent_Conditional_2_Template, 4, 1)(3, FormularioEmisionComponent_Conditional_3_Template, 14, 11, "form", 2);
    }
    if (rf & 2) {
      \u0275\u0275conditional(!ctx.permitido ? 0 : ctx.cargando() ? 1 : ctx.errorCarga() ? 2 : 3);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--espacio-3);\n}\n.encabezado[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  margin-bottom: var(--espacio-4);\n}\n.acciones[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-4);\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: var(--espacio-4);\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-5);\n}\ndt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.875rem;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-3);\n  overflow-wrap: anywhere;\n}\n.nota[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n  font-size: 0.875rem;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.errores[_ngcontent-%COMP%] {\n  color: var(--color-error);\n}\n.reconocimiento[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--boton-dorado);\n  overflow-wrap: anywhere;\n}\n.reconocimiento[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-4);\n  font-size: 1.25rem;\n}\n/*# sourceMappingURL=emision.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FormularioEmisionComponent, { className: "FormularioEmisionComponent", filePath: "src\\app\\pages\\emision-certificados\\compartidos\\formulario-emision.component.ts", lineNumber: 20 });
})();

export {
  CONFIGURACION_EMISION,
  esEditable,
  esEliminable,
  ESTADOS_SESIONES,
  ESTADOS_ASISTENCIAS,
  resultadoPresencia,
  resumenPresencia,
  estadoListado,
  etiquetaEstado,
  ESTADOS_CLASIFICACIONES,
  estadoClasificacion,
  ClasificacionesListado,
  FormularioEmisionComponent
};
//# sourceMappingURL=chunk-QBYYVWAN.js.map
