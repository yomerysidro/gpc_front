import './polyfills.server.mjs';
import {
  PdfContinuoComponent
} from "./chunk-ZLU2ZG5B.mjs";
import {
  DocumentosDigitalesService
} from "./chunk-R23RR7XQ.mjs";
import {
  ActivatedRoute
} from "./chunk-OX7VSSQH.mjs";
import {
  environment
} from "./chunk-HFD7K63G.mjs";
import {
  takeUntilDestroyed
} from "./chunk-TSKSZVR2.mjs";
import {
  HttpClient
} from "./chunk-TNXV45E5.mjs";
import {
  DefaultValueAccessor,
  FormControlDirective,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-SPQE7PSN.mjs";
import {
  DatePipe,
  DestroyRef,
  PLATFORM_ID,
  computed,
  distinctUntilChanged,
  inject,
  isPlatformBrowser,
  map,
  signal,
  throwError,
  timeout,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-OYAKRC2F.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-X7LY3JHO.mjs";

// src/app/core/services/emision-certificados/portal-certificados.service.ts
var PortalCertificadosService = class _PortalCertificadosService {
  documentos = inject(DocumentosDigitalesService);
  http = inject(HttpClient);
  consultarDni(dni) {
    if (!/^[0-9]{8}$/.test(dni))
      return throwError(() => ({ status: 422 }));
    return this.http.post(`${environment.apiBaseUrl}/portal-certificados/consultar-dni`, { dni }, { withCredentials: false, transferCache: false }).pipe(timeout(3e4), map((respuesta) => {
      const filas = respuesta?.data?.certificados;
      const texto = (v) => v === null || typeof v === "string";
      if (respuesta?.success !== true || !Array.isArray(filas) || filas.some((r) => !r || typeof r.referencia_publica !== "string" || !/^[a-f0-9]{64}$/.test(r.referencia_publica) || typeof r.codigo_verificacion !== "string" || !/^[a-f0-9]{30}$/.test(r.codigo_verificacion) || typeof r.origen !== "string" || typeof r.estado_disponibilidad !== "string" || typeof r.disponible_rrhh !== "boolean" || typeof r.pdf_publicado !== "boolean" || ![r.tipo_certificado, r.actividad, r.sesion, r.fecha_sesion, r.url_documento].every(texto))) {
        throw { status: 502 };
      }
      return filas.map((r) => ({
        referencia: r.referencia_publica,
        disponibleRrhh: r.disponible_rrhh,
        codigo: r.codigo_verificacion,
        estado: r.disponible_rrhh ? "disponible" : "no-disponible",
        tipo: r.tipo_certificado,
        actividad: r.actividad,
        sesion: r.sesion,
        fecha: [r.fecha_generacion, r.fecha_sesion].find((v) => typeof v === "string" && !Number.isNaN(Date.parse(v))) ?? null,
        fechaEtiqueta: r.fecha_generacion && !Number.isNaN(Date.parse(r.fecha_generacion)) ? "Fecha del documento" : "Fecha de sesi\xF3n",
        estadoPublico: r.estado_disponibilidad === "Listo para entrega" ? "Listo para entrega" : "Disponible para consulta",
        urlPdf: r.pdf_publicado === true && r.disponible_rrhh === true ? this.urlPublica(r.url_documento, r.codigo_verificacion) : null
      }));
    }));
  }
  verificar(codigo) {
    if (!/^[a-f0-9]{30}$/.test(codigo))
      return throwError(() => ({ status: 422 }));
    return this.documentos.verificar(codigo).pipe(timeout(3e4), map((r) => this.proyectar(r)));
  }
  archivo(certificado) {
    if (certificado.estado !== "disponible" || !certificado.urlPdf)
      return throwError(() => ({ status: 403 }));
    return this.documentos.archivoPublico(certificado.urlPdf, certificado.codigo).pipe(timeout(6e4));
  }
  proyectar(r) {
    const estados = [r.estado_documento, r.estado_certificado].map((v) => v.trim().toLowerCase());
    const anulado = estados.some((v) => ["anulado", "revocado"].includes(v));
    const verificado = !anulado && r.registro_encontrado === true && estados[0] === "vigente" && r.integridad_verificada === true;
    const fecha = [r.fecha_generacion].find((v) => typeof v === "string" && !Number.isNaN(Date.parse(v)));
    const textoPublico = (valor) => typeof valor === "string" && valor.trim() ? valor.trim() : null;
    return {
      codigo: r.codigo_verificacion,
      estado: !r.registro_encontrado ? "no-encontrado" : anulado ? "anulado" : !r.integridad_verificada ? "integridad-no-verificada" : verificado ? "disponible" : "no-disponible",
      verificado,
      fecha: r.registro_encontrado ? fecha ?? null : null,
      urlPdf: verificado && r.puede_ver_documento === true ? this.urlPublica(r.url_documento, r.codigo_verificacion) : null,
      tipo: r.registro_encontrado ? textoPublico(r.tipo_certificado) : null,
      actividad: r.registro_encontrado ? textoPublico(r.actividad) : null,
      sesion: r.registro_encontrado ? textoPublico(r.sesion) : null,
      estadoPublico: verificado ? "Certificado registrado y verificado" : "Disponible para consulta"
    };
  }
  urlPublica(url, codigo) {
    const ruta = `/certificados/verificar/${codigo}?archivo=1`;
    return url === `/api${ruta}` || url === `${environment.apiBaseUrl}${ruta}` ? url : null;
  }
  static \u0275fac = function PortalCertificadosService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PortalCertificadosService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PortalCertificadosService, factory: _PortalCertificadosService.\u0275fac, providedIn: "root" });
};

// src/app/pages/portal-certificados/portal-certificados.component.ts
function _forTrack0($index, $item) {
  return this.claveTarjeta($item);
}
function PortalCertificadosComponent_Conditional_29_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " El DNI debe contener 8 d\xEDgitos num\xE9ricos. ");
  }
}
function PortalCertificadosComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 20);
    \u0275\u0275text(1, "DNI");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 21);
    \u0275\u0275text(3, "Ingresa los 8 d\xEDgitos de tu DNI peruano. No necesitas un c\xF3digo adicional.");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "input", 22);
    \u0275\u0275elementStart(5, "p", 23);
    \u0275\u0275template(6, PortalCertificadosComponent_Conditional_29_Conditional_6_Template, 1, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("formControl", ctx_r0.dni);
    \u0275\u0275attribute("aria-invalid", ctx_r0.dni.touched && ctx_r0.dni.invalid);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.dni.touched && ctx_r0.dni.invalid ? 6 : -1);
  }
}
function PortalCertificadosComponent_Conditional_30_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Ingresa el c\xF3digo de 30 caracteres, con n\xFAmeros y letras de la a a la f en min\xFAscula. ");
  }
}
function PortalCertificadosComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 24);
    \u0275\u0275text(1, "C\xF3digo de verificaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 25);
    \u0275\u0275text(3, "Pega el c\xF3digo de 30 caracteres de tu certificado. No necesitas ingresar tu DNI.");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "input", 26);
    \u0275\u0275elementStart(5, "p", 27);
    \u0275\u0275template(6, PortalCertificadosComponent_Conditional_30_Conditional_6_Template, 1, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("formControl", ctx_r0.codigo);
    \u0275\u0275attribute("aria-invalid", ctx_r0.codigo.touched && ctx_r0.codigo.invalid);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.codigo.touched && ctx_r0.codigo.invalid ? 6 : -1);
  }
}
function PortalCertificadosComponent_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15);
    \u0275\u0275text(1, "Consultando el certificado\u2026");
    \u0275\u0275elementEnd();
  }
}
function PortalCertificadosComponent_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.mensaje());
  }
}
function PortalCertificadosComponent_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15);
    \u0275\u0275text(1, "No hay certificados disponibles para esta consulta.");
    \u0275\u0275elementEnd();
  }
}
function PortalCertificadosComponent_For_39_Case_1_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r2.actividad);
  }
}
function PortalCertificadosComponent_For_39_Case_1_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r2.sesion);
  }
}
function PortalCertificadosComponent_For_39_Case_1_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Este documento consta en los registros de la Municipalidad Distrital de Morales.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Estado del documento: Vigente \xB7 Integridad: Verificada");
    \u0275\u0275elementEnd();
  }
}
function PortalCertificadosComponent_For_39_Case_1_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 35);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r2.estadoPublico);
  }
}
function PortalCertificadosComponent_For_39_Case_1_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", r_r2.fechaEtiqueta || "Fecha del documento", ": ", \u0275\u0275pipeBind2(2, 2, r_r2.fecha, "dd/MM/yyyy"), "");
  }
}
function PortalCertificadosComponent_For_39_Case_1_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 36);
    \u0275\u0275listener("click", function PortalCertificadosComponent_For_39_Case_1_Conditional_18_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const r_r2 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.verCertificado(r_r2));
    });
    \u0275\u0275text(1, "Ver certificado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "a", 37);
    \u0275\u0275text(3, "Descargar PDF");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("href", r_r2.urlPdf + "&descargar=1", \u0275\u0275sanitizeUrl);
  }
}
function PortalCertificadosComponent_For_39_Case_1_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "El archivo no est\xE1 disponible para visualizaci\xF3n p\xFAblica.");
    \u0275\u0275elementEnd();
  }
}
function PortalCertificadosComponent_For_39_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29)(1, "div", 30)(2, "span", 31);
    \u0275\u0275text(3, "workspace_premium");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "span", 32);
    \u0275\u0275text(6, "CERTIFICADO");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "h2");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "span", 33);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(11, PortalCertificadosComponent_For_39_Case_1_Conditional_11_Template, 2, 1, "p", 34)(12, PortalCertificadosComponent_For_39_Case_1_Conditional_12_Template, 2, 1, "p")(13, PortalCertificadosComponent_For_39_Case_1_Conditional_13_Template, 4, 0)(14, PortalCertificadosComponent_For_39_Case_1_Conditional_14_Template, 2, 1, "p", 35);
    \u0275\u0275elementStart(15, "p", 28);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275template(17, PortalCertificadosComponent_For_39_Case_1_Conditional_17_Template, 3, 5, "p")(18, PortalCertificadosComponent_For_39_Case_1_Conditional_18_Template, 4, 1)(19, PortalCertificadosComponent_For_39_Case_1_Conditional_19_Template, 2, 0, "p");
  }
  if (rf & 2) {
    const r_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(r_r2.tipo || "Certificado");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r2.verificado ? r_r2.estadoPublico : "Disponible");
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r2.actividad ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r2.sesion ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r2.verificado ? 13 : 14);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("C\xF3digo de verificaci\xF3n: ", r_r2.codigo, "");
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r2.fecha ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r2.urlPdf ? 18 : 19);
  }
}
function PortalCertificadosComponent_For_39_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1, "Documento anulado o revocado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Este documento no est\xE1 disponible para visualizaci\xF3n ni descarga.");
    \u0275\u0275elementEnd();
  }
}
function PortalCertificadosComponent_For_39_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1, "No se encontr\xF3 un certificado con ese c\xF3digo.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Verifica que est\xE9 escrito correctamente.");
    \u0275\u0275elementEnd();
  }
}
function PortalCertificadosComponent_For_39_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1, "Integridad del archivo no confirmada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "No se pudo verificar el archivo de este documento.");
    \u0275\u0275elementEnd();
  }
}
function PortalCertificadosComponent_For_39_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1, "Registro encontrado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "El documento no est\xE1 disponible para visualizaci\xF3n p\xFAblica.");
    \u0275\u0275elementEnd();
  }
}
function PortalCertificadosComponent_For_39_Conditional_6_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r2.tipo);
  }
}
function PortalCertificadosComponent_For_39_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r2.actividad);
  }
}
function PortalCertificadosComponent_For_39_Conditional_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r2.sesion);
  }
}
function PortalCertificadosComponent_For_39_Conditional_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", r_r2.fechaEtiqueta || "Fecha del documento", ": ", \u0275\u0275pipeBind2(2, 2, r_r2.fecha, "dd/MM/yyyy"), "");
  }
}
function PortalCertificadosComponent_For_39_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, PortalCertificadosComponent_For_39_Conditional_6_Conditional_0_Template, 2, 1, "p")(1, PortalCertificadosComponent_For_39_Conditional_6_Conditional_1_Template, 2, 1, "p")(2, PortalCertificadosComponent_For_39_Conditional_6_Conditional_2_Template, 2, 1, "p")(3, PortalCertificadosComponent_For_39_Conditional_6_Conditional_3_Template, 3, 5, "p");
    \u0275\u0275elementStart(4, "p", 28);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional(r_r2.tipo ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r2.actividad ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r2.sesion ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r2.fecha ? 3 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("C\xF3digo de verificaci\xF3n: ", r_r2.codigo, "");
  }
}
function PortalCertificadosComponent_For_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 17);
    \u0275\u0275template(1, PortalCertificadosComponent_For_39_Case_1_Template, 20, 8)(2, PortalCertificadosComponent_For_39_Case_2_Template, 4, 0)(3, PortalCertificadosComponent_For_39_Case_3_Template, 4, 0)(4, PortalCertificadosComponent_For_39_Case_4_Template, 4, 0)(5, PortalCertificadosComponent_For_39_Case_5_Template, 4, 0)(6, PortalCertificadosComponent_For_39_Conditional_6_Template, 6, 5, "p", 28);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_10_0;
    const r_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_10_0 = r_r2.estado) === "disponible" ? 1 : tmp_10_0 === "anulado" ? 2 : tmp_10_0 === "no-encontrado" ? 3 : tmp_10_0 === "integridad-no-verificada" ? 4 : 5);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(r_r2.estado !== "disponible" && r_r2.estado !== "no-encontrado" ? 6 : -1);
  }
}
function PortalCertificadosComponent_Conditional_40_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate((tmp_2_0 = ctx_r0.resultado()) == null ? null : tmp_2_0.actividad);
  }
}
function PortalCertificadosComponent_Conditional_40_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15);
    \u0275\u0275text(1, "Cargando el documento\u2026");
    \u0275\u0275elementEnd();
  }
}
function PortalCertificadosComponent_Conditional_40_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errorPdf());
  }
}
function PortalCertificadosComponent_Conditional_40_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-pdf-continuo", 44);
    \u0275\u0275listener("fallo", function PortalCertificadosComponent_Conditional_40_Conditional_14_Template_app_pdf_continuo_fallo_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.falloVisor());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("archivo", ctx)("ajustarAncho", true);
  }
}
function PortalCertificadosComponent_Conditional_40_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 42);
    \u0275\u0275text(1, "Descargar PDF");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("href", ((tmp_3_0 = ctx_r0.resultado()) == null ? null : tmp_3_0.urlPdf) + "&descargar=1", \u0275\u0275sanitizeUrl);
  }
}
function PortalCertificadosComponent_Conditional_40_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 38);
    \u0275\u0275listener("click", function PortalCertificadosComponent_Conditional_40_Conditional_16_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.verCertificado());
    });
    \u0275\u0275text(1, "Reintentar PDF");
    \u0275\u0275elementEnd();
  }
}
function PortalCertificadosComponent_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 18)(1, "button", 38);
    \u0275\u0275listener("click", function PortalCertificadosComponent_Conditional_40_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.volver());
    });
    \u0275\u0275elementStart(2, "span", 5);
    \u0275\u0275text(3, "arrow_back");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, "Regresar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h2", 39);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, PortalCertificadosComponent_Conditional_40_Conditional_7_Template, 2, 1, "p", 34);
    \u0275\u0275elementStart(8, "p", 33);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 28);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275template(12, PortalCertificadosComponent_Conditional_40_Conditional_12_Template, 2, 0, "p", 15)(13, PortalCertificadosComponent_Conditional_40_Conditional_13_Template, 2, 1, "p", 40)(14, PortalCertificadosComponent_Conditional_40_Conditional_14_Template, 1, 2, "app-pdf-continuo", 41)(15, PortalCertificadosComponent_Conditional_40_Conditional_15_Template, 2, 1, "a", 42)(16, PortalCertificadosComponent_Conditional_40_Conditional_16_Template, 2, 0, "button", 43);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(((tmp_1_0 = ctx_r0.resultado()) == null ? null : tmp_1_0.tipo) || "Certificado");
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_2_0 = ctx_r0.resultado()) == null ? null : tmp_2_0.actividad) ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_3_0 = ctx_r0.resultado()) == null ? null : tmp_3_0.estadoPublico);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("C\xF3digo de verificaci\xF3n: ", (tmp_4_0 = ctx_r0.resultado()) == null ? null : tmp_4_0.codigo, "");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.cargandoPdf() ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.errorPdf() ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_7_0 = ctx_r0.archivo()) ? 14 : -1, tmp_7_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_8_0 = ctx_r0.urlDescarga()) ? 15 : -1, tmp_8_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.errorPdf() && !ctx_r0.archivo() && ((tmp_9_0 = ctx_r0.resultado()) == null ? null : tmp_9_0.urlPdf) ? 16 : -1);
  }
}
function PortalCertificadosComponent_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 45);
    \u0275\u0275listener("click", function PortalCertificadosComponent_Conditional_41_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.nuevaConsulta());
    });
    \u0275\u0275text(1, "Nueva consulta");
    \u0275\u0275elementEnd();
  }
}
var PortalCertificadosComponent = class _PortalCertificadosComponent {
  api = inject(PortalCertificadosService);
  destroy = inject(DestroyRef);
  fb = inject(NonNullableFormBuilder);
  route = inject(ActivatedRoute, { optional: true });
  consulta;
  descarga;
  dni = this.fb.control("", [Validators.required, Validators.pattern(/^[0-9]{8}$/)]);
  codigo = this.fb.control("", [Validators.required, Validators.pattern(/^[a-f0-9]{30}$/)]);
  modo = signal("dni");
  cargando = signal(false);
  cargandoPdf = signal(false);
  mensaje = signal("");
  errorPdf = signal("");
  resultado = signal(null);
  resultadosDni = signal(null);
  tarjetas = computed(() => this.modo() === "dni" ? this.resultadosDni() ?? [] : this.resultado() ? [this.resultado()] : []);
  detalle = signal(false);
  archivo = signal(null);
  urlDescarga = signal(null);
  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID)))
      this.route?.queryParamMap.pipe(map((q) => q.get("codigo")), distinctUntilChanged(), takeUntilDestroyed(this.destroy)).subscribe((codigo) => {
        if (codigo === null)
          return;
        this.cambiarModo("codigo");
        this.codigo.setValue(codigo);
        this.codigo.markAsTouched();
        this.buscar(true);
      });
    this.destroy.onDestroy(() => this.limpiarPdf());
    this.dni.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => this.limpiar());
    this.codigo.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => this.limpiar());
  }
  cambiarModo(modo) {
    if (this.modo() === modo)
      return;
    this.limpiar();
    this.modo.set(modo);
  }
  nuevaConsulta() {
    this.limpiar();
    this.dni.reset("");
    this.codigo.reset("");
  }
  claveTarjeta(certificado) {
    return certificado.referencia ?? certificado.codigo;
  }
  buscar(abrirPdf = false) {
    const control = this.modo() === "dni" ? this.dni : this.codigo;
    control.markAsTouched();
    if (control.invalid || this.cargando())
      return;
    this.limpiar();
    this.cargando.set(true);
    if (this.modo() === "dni") {
      this.consulta = this.api.consultarDni(this.dni.value).pipe(takeUntilDestroyed(this.destroy)).subscribe({
        next: (certificados) => {
          this.cargando.set(false);
          this.resultadosDni.set(certificados);
        },
        error: (e) => {
          this.cargando.set(false);
          this.mensaje.set(e?.status === 429 ? "Has realizado varias consultas. Espera un momento antes de intentar nuevamente." : e?.status === 422 ? "Revisa que el DNI tenga ocho d\xEDgitos." : e?.status === 401 || e?.status === 403 ? "Esta consulta p\xFAblica no est\xE1 autorizada." : "No se pudo realizar la consulta. Intenta nuevamente en unos momentos.");
        }
      });
      return;
    }
    this.consulta = this.api.verificar(this.codigo.value).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (r) => {
        this.cargando.set(false);
        this.resultado.set(r);
        if (abrirPdf && r.urlPdf)
          this.verCertificado(r);
      },
      error: (e) => {
        this.cargando.set(false);
        this.mensaje.set(e?.status === 404 ? "No se encontr\xF3 un certificado con ese c\xF3digo. Verifica que est\xE9 escrito correctamente." : e?.status === 422 ? "Revisa el c\xF3digo de verificaci\xF3n ingresado." : e?.status === 429 ? "Has realizado varias consultas. Espera un momento antes de intentar nuevamente." : e?.status === 403 || e?.status === 401 ? "Esta consulta p\xFAblica no est\xE1 autorizada." : e?.status === 409 ? "El certificado todav\xEDa no est\xE1 disponible para consulta p\xFAblica." : "No se pudo conectar con el servicio. Intenta nuevamente en unos momentos.");
      }
    });
  }
  verCertificado(certificado) {
    const r = certificado ?? this.resultado();
    if (!r || r.estado !== "disponible" || !r.urlPdf || this.cargandoPdf())
      return;
    this.limpiarPdf();
    this.resultado.set(r);
    this.detalle.set(true);
    this.errorPdf.set("");
    this.cargandoPdf.set(true);
    this.descarga = this.api.archivo(r).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (archivo) => {
        this.archivo.set(archivo);
        this.urlDescarga.set(URL.createObjectURL(archivo.blob));
        this.cargandoPdf.set(false);
      },
      error: (e) => {
        this.cargandoPdf.set(false);
        if ([401, 403, 404, 409].includes(e?.status)) {
          const privado = __spreadProps(__spreadValues({}, r), { urlPdf: null });
          this.resultado.set(privado);
          this.resultadosDni.update((filas) => filas?.map((fila) => fila.codigo === r.codigo ? privado : fila) ?? null);
        }
        this.errorPdf.set([401, 403, 404, 409].includes(e?.status) ? "El documento no est\xE1 autorizado para visualizaci\xF3n o descarga p\xFAblica." : "No se pudo cargar el PDF. Intenta nuevamente.");
      }
    });
  }
  volver() {
    this.limpiarPdf();
    this.detalle.set(false);
    if (this.modo() === "dni")
      this.resultado.set(null);
  }
  falloVisor() {
    this.errorPdf.set("No se pudo visualizar el PDF. Puedes descargar el archivo autorizado.");
  }
  limpiarPdf() {
    this.descarga?.unsubscribe();
    const url = this.urlDescarga();
    if (url)
      URL.revokeObjectURL(url);
    this.urlDescarga.set(null);
    this.archivo.set(null);
    this.errorPdf.set("");
    this.cargandoPdf.set(false);
  }
  limpiar() {
    this.consulta?.unsubscribe();
    this.cargando.set(false);
    this.mensaje.set("");
    this.resultado.set(null);
    this.resultadosDni.set(null);
    this.limpiarPdf();
    this.detalle.set(false);
  }
  static \u0275fac = function PortalCertificadosComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PortalCertificadosComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PortalCertificadosComponent, selectors: [["app-portal-certificados"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 46, vars: 11, consts: [[1, "portal"], [1, "cabecera"], [1, "marca"], ["src", "/marca/escudo-160.webp", "alt", "Escudo municipal", "width", "64", "height", "72"], [1, "acceso"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["id", "contenido-portal"], [1, "presentacion"], [1, "antetitulo"], ["aria-labelledby", "titulo-busqueda", 1, "tarjeta", "consulta"], ["id", "titulo-busqueda"], ["role", "group", "aria-label", "Forma de b\xFAsqueda", 1, "selector"], ["type", "button", 3, "click"], ["novalidate", "", 3, "submit"], ["type", "submit", 1, "btn", "principal", 3, "disabled"], ["role", "status"], ["role", "status", 1, "aviso"], ["aria-label", "Resultado de la consulta", "aria-live", "polite", 1, "tarjeta", "resultados"], ["aria-labelledby", "titulo-documento", 1, "tarjeta", "documento"], ["type", "button", 1, "btn", "nueva"], ["for", "dni-publico"], ["id", "dni-ayuda", 1, "ayuda"], ["id", "dni-publico", "type", "text", "inputmode", "numeric", "maxlength", "8", "autocomplete", "off", "aria-describedby", "dni-ayuda dni-error", 1, "input", 3, "formControl"], ["id", "dni-error", 1, "validacion"], ["for", "codigo-portal"], ["id", "codigo-ayuda", 1, "ayuda"], ["id", "codigo-portal", "type", "text", "maxlength", "30", "autocomplete", "off", "autocapitalize", "none", "spellcheck", "false", "aria-describedby", "codigo-ayuda codigo-error", 1, "input", 3, "formControl"], ["id", "codigo-error", 1, "validacion"], [1, "codigo"], [1, "resultado-cabecera"], [1, "resultado-identidad"], ["aria-hidden", "true", 1, "material-symbols-outlined", "insignia"], [1, "etiqueta"], [1, "estado"], [1, "actividad-certificado"], [1, "estado-publico"], ["type", "button", 1, "btn", "principal", 3, "click"], [1, "btn", "descargar", 3, "href"], ["type", "button", 1, "btn", 3, "click"], ["id", "titulo-documento"], ["role", "alert"], [3, "archivo", "ajustarAncho"], ["download", "certificado.pdf", 1, "btn", "principal", "descargar", 3, "href"], ["type", "button", 1, "btn"], [3, "fallo", "archivo", "ajustarAncho"], ["type", "button", 1, "btn", "nueva", 3, "click"]], template: function PortalCertificadosComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "div", 2);
      \u0275\u0275element(3, "img", 3);
      \u0275\u0275elementStart(4, "span");
      \u0275\u0275text(5, "Municipalidad Distrital de Morales");
      \u0275\u0275elementStart(6, "small");
      \u0275\u0275text(7, "Servicio de consulta ciudadana");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(8, "span", 4)(9, "span", 5);
      \u0275\u0275text(10, "verified");
      \u0275\u0275elementEnd();
      \u0275\u0275text(11, " Acceso p\xFAblico");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "main", 6)(13, "div", 7)(14, "p", 8);
      \u0275\u0275text(15, "MUNICIPALIDAD DISTRITAL DE MORALES");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "h1");
      \u0275\u0275text(17, "Portal P\xFAblico de Certificados");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "p");
      \u0275\u0275text(19, "Consulta y verifica tus certificados");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "section", 9)(21, "h2", 10);
      \u0275\u0275text(22, "Encuentra tu certificado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "div", 11)(24, "button", 12);
      \u0275\u0275listener("click", function PortalCertificadosComponent_Template_button_click_24_listener() {
        return ctx.cambiarModo("dni");
      });
      \u0275\u0275text(25, "Buscar por DNI");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "button", 12);
      \u0275\u0275listener("click", function PortalCertificadosComponent_Template_button_click_26_listener() {
        return ctx.cambiarModo("codigo");
      });
      \u0275\u0275text(27, "Buscar por c\xF3digo");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "form", 13);
      \u0275\u0275listener("submit", function PortalCertificadosComponent_Template_form_submit_28_listener($event) {
        $event.preventDefault();
        return ctx.buscar();
      });
      \u0275\u0275template(29, PortalCertificadosComponent_Conditional_29_Template, 7, 3)(30, PortalCertificadosComponent_Conditional_30_Template, 7, 3);
      \u0275\u0275elementStart(31, "button", 14)(32, "span", 5);
      \u0275\u0275text(33, "search");
      \u0275\u0275elementEnd();
      \u0275\u0275text(34);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(35, PortalCertificadosComponent_Conditional_35_Template, 2, 0, "p", 15)(36, PortalCertificadosComponent_Conditional_36_Template, 2, 1, "p", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275template(37, PortalCertificadosComponent_Conditional_37_Template, 2, 0, "p", 15);
      \u0275\u0275repeaterCreate(38, PortalCertificadosComponent_For_39_Template, 7, 2, "section", 17, _forTrack0, true);
      \u0275\u0275template(40, PortalCertificadosComponent_Conditional_40_Template, 17, 9, "section", 18)(41, PortalCertificadosComponent_Conditional_41_Template, 2, 0, "button", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "footer");
      \u0275\u0275text(43, "Municipalidad Distrital de Morales");
      \u0275\u0275elementStart(44, "span");
      \u0275\u0275text(45, "Portal P\xFAblico de Certificados \xB7 Servicio institucional");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_8_0;
      \u0275\u0275advance(24);
      \u0275\u0275attribute("aria-pressed", ctx.modo() === "dni");
      \u0275\u0275advance(2);
      \u0275\u0275attribute("aria-pressed", ctx.modo() === "codigo");
      \u0275\u0275advance(2);
      \u0275\u0275attribute("aria-busy", ctx.cargando());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.modo() === "dni" ? 29 : 30);
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.cargando() ? "Consultando\u2026" : "Consultar");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() ? 35 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.mensaje() ? 36 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(((tmp_8_0 = ctx.resultadosDni()) == null ? null : tmp_8_0.length) === 0 ? 37 : -1);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.tarjetas());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.detalle() ? 40 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.mensaje() || ctx.resultado() || ctx.resultadosDni() !== null || ctx.detalle() ? 41 : -1);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, FormControlDirective, DatePipe, PdfContinuoComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n  min-height: 100dvh;\n  color: var(--neutro-900);\n  background: var(--neutro-50);\n}\n.portal[_ngcontent-%COMP%] {\n  min-height: 100dvh;\n  display: flex;\n  flex-direction: column;\n}\n.cabecera[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 1rem;\n  padding: 1rem var(--espacio-6);\n  color: white;\n  background: var(--azul-oscuro);\n  border-bottom: 4px solid var(--dorado-accion);\n}\n.marca[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  font-weight: 600;\n}\n.marca[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  object-fit: contain;\n  flex-shrink: 0;\n}\n.marca[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 400;\n  margin-top: 0.3rem;\n  color: #dce8f0;\n}\n.acceso[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  font-size: 0.85rem;\n  white-space: nowrap;\n}\nmain[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  margin: 0;\n  padding: var(--espacio-6, 1.5rem);\n  flex: 1;\n}\n.presentacion[_ngcontent-%COMP%] {\n  text-align: left;\n  margin-block: 1rem 2rem;\n  padding-left: 1rem;\n  border-left: 4px solid var(--dorado-accion);\n}\n.presentacion[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.35rem 0;\n}\n.antetitulo[_ngcontent-%COMP%] {\n  color: #526b80;\n  font-size: 0.75rem;\n  letter-spacing: 0.1em;\n}\nh1[_ngcontent-%COMP%] {\n  color: #124b72;\n  font-size: clamp(1.3rem, 2vw, 1.65rem);\n  line-height: 1.3;\n  margin: 0.35rem 0;\n}\nh2[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  color: #124b72;\n  margin: 0 0 0.8rem;\n}\n.tarjeta[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  background: white;\n  border: 1px solid var(--neutro-200);\n  border-radius: var(--radio-lg);\n  padding: clamp(1rem, 2vw, 2rem);\n  box-shadow: var(--sombra-sm);\n  margin: 0 0 1.5rem;\n}\n.selector[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.4rem;\n  padding: 0.3rem;\n  background: #edf2f7;\n  border-radius: 0.65rem;\n  margin-bottom: 1rem;\n}\n.selector[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  flex: 1;\n  border: 0;\n  border-radius: 0.45rem;\n  padding: 0.8rem 0.5rem;\n  background: transparent;\n  color: #26465e;\n  font: inherit;\n  font-weight: 600;\n  cursor: pointer;\n}\n.selector[_ngcontent-%COMP%]   button[aria-pressed=true][_ngcontent-%COMP%] {\n  background: #124b72;\n  color: white;\n}\nlabel[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 600;\n}\n.input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  min-height: 3rem;\n  font-size: 1rem;\n}\n.ayuda[_ngcontent-%COMP%] {\n  color: #526879;\n  font-size: 0.9rem;\n  line-height: 1.6;\n}\n.ayuda[_ngcontent-%COMP%] {\n  margin: 0.5rem 0 0.8rem;\n}\n.validacion[_ngcontent-%COMP%] {\n  color: #a02d25;\n  font-size: 0.85rem;\n  margin: 0.3rem 0;\n}\n.integracion[_ngcontent-%COMP%], \n.aviso[_ngcontent-%COMP%] {\n  background: #f8f3e5;\n  padding: 0.85rem;\n  border-left: 3px solid #be912f;\n  line-height: 1.6;\n}\n.principal[_ngcontent-%COMP%] {\n  background: var(--dorado-accion);\n  color: #172f42;\n  border: 1px solid var(--dorado-accion);\n  font-weight: 600;\n}\n.principal[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: var(--boton-dorado-hover);\n  border-color: var(--boton-dorado-hover);\n}\n.consulta[_ngcontent-%COMP%]   form[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  column-gap: 0.8rem;\n}\n.consulta[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]    > label[_ngcontent-%COMP%], \n.consulta[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.consulta[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]    > .input[_ngcontent-%COMP%] {\n  grid-column: 1;\n  grid-row: 3;\n}\n.consulta[_ngcontent-%COMP%]   .principal[_ngcontent-%COMP%] {\n  grid-column: 2;\n  grid-row: 3;\n  min-width: 10rem;\n  margin: 0;\n}\n.estado[_ngcontent-%COMP%] {\n  display: inline-block;\n  background: #e8f4ed;\n  color: #24613c;\n  border-radius: 1rem;\n  padding: 0.35rem 0.8rem;\n  font-size: 0.85rem;\n  margin-bottom: 1rem;\n}\n.codigo[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.descargar[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n.nueva[_ngcontent-%COMP%] {\n  display: inline-flex;\n  margin: 0 0 0.5rem;\n}\n.resultados[_ngcontent-%COMP%] {\n  border-top: 3px solid #d6ad4a;\n}\n.resultado-cabecera[_ngcontent-%COMP%], \n.resultado-identidad[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.8rem;\n}\n.resultado-cabecera[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  flex-wrap: wrap;\n}\n.resultado-identidad[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.resultado-identidad[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0.2rem 0 0;\n  overflow-wrap: anywhere;\n}\n.insignia[_ngcontent-%COMP%] {\n  color: #124b72;\n  background: #edf2f7;\n  border-radius: 0.6rem;\n  padding: 0.7rem;\n}\n.etiqueta[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  color: #526879;\n  letter-spacing: 0.08em;\n}\n.resultado-cabecera[_ngcontent-%COMP%]   .estado[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.actividad-certificado[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #124b72;\n  overflow-wrap: anywhere;\n}\nfooter[_ngcontent-%COMP%] {\n  padding: 1rem var(--espacio-6, 1.5rem);\n  text-align: left;\n  border-top: 1px solid #dce5ed;\n  font-size: 0.85rem;\n}\nfooter[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.4rem;\n  color: #526879;\n}\napp-main-layout[_nghost-%COMP%], app-main-layout   [_nghost-%COMP%] {\n  min-height: 0;\n  background: transparent;\n}\napp-main-layout[_nghost-%COMP%]   .portal[_ngcontent-%COMP%], app-main-layout   [_nghost-%COMP%]   .portal[_ngcontent-%COMP%] {\n  min-height: 0;\n}\napp-main-layout[_nghost-%COMP%]   .cabecera[_ngcontent-%COMP%], app-main-layout   [_nghost-%COMP%]   .cabecera[_ngcontent-%COMP%] {\n  display: none;\n}\napp-main-layout[_nghost-%COMP%]   main[_ngcontent-%COMP%], app-main-layout   [_nghost-%COMP%]   main[_ngcontent-%COMP%] {\n  padding: 0;\n}\napp-main-layout[_nghost-%COMP%]   footer[_ngcontent-%COMP%], app-main-layout   [_nghost-%COMP%]   footer[_ngcontent-%COMP%] {\n  padding: 0.8rem 0 0;\n}\n@media (max-width: 600px) {\n  .acceso[_ngcontent-%COMP%] {\n    display: none;\n  }\n  main[_ngcontent-%COMP%] {\n    padding: var(--espacio-5, 1.25rem) var(--espacio-4, 1rem);\n  }\n  .cabecera[_ngcontent-%COMP%], \n   footer[_ngcontent-%COMP%] {\n    padding-inline: var(--espacio-4, 1rem);\n  }\n  .marca[_ngcontent-%COMP%] {\n    font-size: 0.9rem;\n  }\n  .marca[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n    width: 48px;\n    height: 56px;\n  }\n  .tarjeta[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .selector[_ngcontent-%COMP%] {\n    flex-wrap: wrap;\n  }\n  .selector[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n    flex-basis: 45%;\n  }\n  .consulta[_ngcontent-%COMP%]   form[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .consulta[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]    > .input[_ngcontent-%COMP%] {\n    grid-column: 1;\n  }\n  .consulta[_ngcontent-%COMP%]   .principal[_ngcontent-%COMP%] {\n    grid-column: 1;\n    grid-row: auto;\n    width: 100%;\n    margin-top: 0.5rem;\n  }\n  .documento[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=portal-certificados.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PortalCertificadosComponent, { className: "PortalCertificadosComponent", filePath: "src\\app\\pages\\portal-certificados\\portal-certificados.component.ts", lineNumber: 17 });
})();

export {
  PortalCertificadosComponent
};
//# sourceMappingURL=chunk-MDT6KKMN.mjs.map
