import './polyfills.server.mjs';
import {
  MunicipalContextoService,
  PreparacionOrigenComponent,
  puedeDescargarDocumentoAdministrativo,
  puedeVerDocumentoAdministrativo,
  recuperarMunicipal
} from "./chunk-PKF3BBPE.mjs";
import {
  estadoDocumentalPractica
} from "./chunk-BFRYA4IX.mjs";
import {
  VisorPdfComponent
} from "./chunk-FBTDJ3RZ.mjs";
import "./chunk-ZLU2ZG5B.mjs";
import "./chunk-ZIVCKBVU.mjs";
import {
  DocumentosDigitalesService,
  mensajeEtapaA
} from "./chunk-R23RR7XQ.mjs";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-OX7VSSQH.mjs";
import "./chunk-VNKXA6HD.mjs";
import "./chunk-NP7M7R34.mjs";
import {
  EmisionCertificadosService
} from "./chunk-UOKIJFGD.mjs";
import "./chunk-7VY3YOD2.mjs";
import "./chunk-2XE3PF63.mjs";
import "./chunk-JMI3IFFT.mjs";
import "./chunk-HFD7K63G.mjs";
import {
  takeUntilDestroyed
} from "./chunk-TSKSZVR2.mjs";
import "./chunk-TNXV45E5.mjs";
import "./chunk-SPQE7PSN.mjs";
import {
  DestroyRef,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate2
} from "./chunk-OYAKRC2F.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-X7LY3JHO.mjs";

// src/app/pages/emision-certificados/generar-emitir/preparar-municipal.component.ts
var _c0 = () => ({ origen_documental: "reconocimiento" });
function PrepararMunicipalComponent_Conditional_0_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-visor-pdf", 5);
  }
  if (rf & 2) {
    const d_r1 = ctx;
    const o_r2 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("documentoId", d_r1.id_certificado_documento)("urlAdministrativa", o_r2.url_documento)("hashEsperado", d_r1.hash_pdf)("permitirDescarga", ctx_r2.descargaPermitida(o_r2, d_r1))("persistido", true)("integrado", true)("ajustarAncho", true)("controlesZoom", true);
  }
}
function PrepararMunicipalComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 0)(1, "header", 2)(2, "a", 3)(3, "span", 4);
    \u0275\u0275text(4, "arrow_back");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "h1");
    \u0275\u0275text(6, "Certificado");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "h2");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275template(11, PrepararMunicipalComponent_Conditional_0_Conditional_11_Template, 1, 8, "app-visor-pdf", 5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    const o_r2 = ctx;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("queryParams", \u0275\u0275pureFunction0(5, _c0));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(o_r2.beneficiario.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("Estado documental: ", o_r2.estado_certificado, " \xB7 ", o_r2.estado_documento, "");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_5_0 = ctx_r2.detalleOriginal()) ? 11 : -1, tmp_5_0);
  }
}
function PrepararMunicipalComponent_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-preparacion-origen", 6);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("municipal", ctx)("asistente", true)("consultaExterna", true)("consultaPendiente", ctx_r2.recuperando())("documentoRecuperado", ctx_r2.documento())("retorno", \u0275\u0275pureFunction0(6, _c0));
  }
}
function PrepararMunicipalComponent_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 7)(1, "a", 8);
    \u0275\u0275text(2, "\u2190 Volver al listado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h1");
    \u0275\u0275text(4, "Datos del certificado");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("queryParams", \u0275\u0275pureFunction0(1, _c0));
  }
}
function PrepararMunicipalComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, PrepararMunicipalComponent_Conditional_1_Conditional_0_Template, 1, 7, "app-preparacion-origen", 6)(1, PrepararMunicipalComponent_Conditional_1_Conditional_1_Template, 5, 2, "section", 7);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_1_0 = ctx_r2.evaluacion()) ? 0 : 1, tmp_1_0);
  }
}
function PrepararMunicipalComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 1);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.error());
  }
}
var PrepararMunicipalComponent = class _PrepararMunicipalComponent {
  api = inject(EmisionCertificadosService);
  documentos = inject(DocumentosDigitalesService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  destroy = inject(DestroyRef);
  evaluacion = signal(null);
  documento = signal(null);
  error = signal("");
  recuperando = signal(false);
  original = signal(null);
  detalleOriginal = signal(null);
  descargaPermitida(o, d) {
    return puedeDescargarDocumentoAdministrativo(o) && puedeDescargarDocumentoAdministrativo(d);
  }
  constructor() {
    const contexto = inject(MunicipalContextoService);
    const id = Number(this.route.snapshot.paramMap.get("reconocimientoId"));
    const seleccionado = contexto.seleccionado;
    contexto.seleccionado = null;
    if (!Number.isSafeInteger(id) || id < 1) {
      this.error.set("Reconocimiento no v\xE1lido.");
      return;
    }
    if (seleccionado?.evaluacion.id_origen === id) {
      this.aplicar(seleccionado.evaluacion, seleccionado.documento);
      return;
    }
    this.api.evaluarOrigen("reconocimiento", id).pipe(takeUntilDestroyed(this.destroy)).subscribe({ next: (e) => this.aplicar(e, null), error: (e) => this.error.set(mensajeEtapaA(e)) });
  }
  aplicar(e, d) {
    if (e.origen !== "reconocimiento" || !Number.isSafeInteger(e.id_persona) || e.id_persona < 1 || !e.reconocimiento?.nombres) {
      this.error.set("No se pudo identificar al beneficiario municipal.");
      return;
    }
    if (e.documento_existente && (e.documento_existente.origen !== "reconocimiento" || e.documento_existente.estado_certificado !== "PREPARADO" || this.route.snapshot.data?.["visorMunicipal"])) {
      this.abrirOriginal(e, e.documento_existente);
      return;
    }
    if (e.modalidad_reconocimiento && e.modalidad_reconocimiento !== "individual") {
      this.error.set("Documento no disponible.");
      return;
    }
    if (d && estadoDocumentalPractica(d) === "Certificado confirmado") {
      void this.router.navigate(["/certificaciones/certificados", d.id_certificado, "documentos", d.id_certificado_documento, "visor"], { replaceUrl: true });
      return;
    }
    this.documento.set(d);
    this.evaluacion.set(e);
    if (!d && (e.certificados_existentes.length || e.documento_existente)) {
      this.recuperando.set(true);
      recuperarMunicipal(this.api, this.documentos, e).pipe(takeUntilDestroyed(this.destroy)).subscribe({
        next: (doc) => {
          this.documento.set(doc);
          this.recuperando.set(false);
        },
        error: (err) => {
          this.error.set(mensajeEtapaA(err));
        }
      });
    }
  }
  abrirOriginal(e, o) {
    if (o.id_reconocimiento !== e.id_origen || o.beneficiario.id_persona !== e.id_persona || !puedeVerDocumentoAdministrativo(o) || estadoDocumentalPractica(o) === "Anulado") {
      this.error.set("Sin acceso al PDF.");
      return;
    }
    this.original.set(o);
    this.documentos.detalleFirmas(o.id_certificado_documento).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (d) => {
        if (d.id_certificado !== o.id_certificado || d.id_certificado_documento !== o.id_certificado_documento || d.origen !== o.origen || d.beneficiario?.id_persona !== o.beneficiario.id_persona || (d.id_actividad ?? null) !== o.id_actividad || (d.id_sesion ?? null) !== o.id_sesion || !puedeVerDocumentoAdministrativo(d) || d.url_documento !== o.url_documento || estadoDocumentalPractica(d) === "Anulado") {
          this.error.set("No se pudo autorizar el documento original.");
          return;
        }
        this.original.set(__spreadProps(__spreadValues({}, o), { estado_certificado: d.estado_certificado, estado_documento: d.estado_documento ?? o.estado_documento }));
        this.detalleOriginal.set(d);
      },
      error: (err) => this.error.set(mensajeEtapaA(err))
    });
  }
  static \u0275fac = function PrepararMunicipalComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PrepararMunicipalComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PrepararMunicipalComponent, selectors: [["ng-component"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 3, vars: 2, consts: [[1, "reconocimiento-asistente"], ["role", "alert"], [1, "titulo-asistente"], ["routerLink", "/certificaciones/generar-emitir", "aria-label", "Volver al listado", 1, "btn", "regreso-asistente", 3, "queryParams"], ["aria-hidden", "true", 1, "material-symbols-outlined"], [3, "documentoId", "urlAdministrativa", "hashEsperado", "permitirDescarga", "persistido", "integrado", "ajustarAncho", "controlesZoom"], ["origen", "reconocimiento", 3, "municipal", "asistente", "consultaExterna", "consultaPendiente", "documentoRecuperado", "retorno"], [1, "card"], ["routerLink", "/certificaciones/generar-emitir", 3, "queryParams"]], template: function PrepararMunicipalComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, PrepararMunicipalComponent_Conditional_0_Template, 12, 6, "section", 0)(1, PrepararMunicipalComponent_Conditional_1_Template, 2, 1)(2, PrepararMunicipalComponent_Conditional_2_Template, 2, 1, "p", 1);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional((tmp_0_0 = ctx.original()) ? 0 : 1, tmp_0_0);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.error() ? 2 : -1);
    }
  }, dependencies: [PreparacionOrigenComponent, RouterLink, VisorPdfComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--espacio-3);\n}\n.encabezado[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  margin-bottom: var(--espacio-4);\n}\n.acciones[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-4);\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: var(--espacio-4);\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-5);\n}\ndt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.875rem;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-3);\n  overflow-wrap: anywhere;\n}\n.nota[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n  font-size: 0.875rem;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.errores[_ngcontent-%COMP%] {\n  color: var(--color-error);\n}\n.reconocimiento[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--boton-dorado);\n  overflow-wrap: anywhere;\n}\n.reconocimiento[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-4);\n  font-size: 1.25rem;\n}\n/*# sourceMappingURL=emision.css.map */", "\n\n.reconocimiento-asistente[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  color: #20374e;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], \n.reconocimiento-asistente[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  color: #075a9b;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .titulo-asistente[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .titulo-asistente[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .regreso-asistente[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 0.3rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .pasos-reconocimiento[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.75rem;\n  overflow-x: auto;\n  padding: 1rem 0;\n  list-style: none;\n  border-bottom: 1px solid #dfe6ef;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .pasos-reconocimiento[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  padding: 0.5rem 0.75rem;\n  border-bottom: 3px solid #dfe6ef;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .pasos-reconocimiento[_ngcontent-%COMP%]   [aria-current=step][_ngcontent-%COMP%] {\n  color: #075a9b;\n  border-color: #bf942d;\n  font-weight: 700;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .contenido-paso[_ngcontent-%COMP%] {\n  padding: 1rem 0;\n  min-width: 0;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .acciones-paso[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  margin-top: 1.25rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .confirmar[_ngcontent-%COMP%] {\n  background: #bd932d;\n  color: #172e45;\n  border-color: #bd932d;\n  font-weight: 600;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .mensaje[_ngcontent-%COMP%] {\n  white-space: pre-wrap;\n  line-height: 1.7;\n  max-width: 70rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .informacion-reconocimiento[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr);\n  gap: 1rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .ficha-reconocimiento[_ngcontent-%COMP%], \n.reconocimiento-asistente[_ngcontent-%COMP%]   .texto-reconocimiento[_ngcontent-%COMP%] {\n  padding: 1rem;\n  border: 1px solid #dfe6ef;\n  border-radius: 0.65rem;\n  min-width: 0;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0 0 0.75rem;\n  color: #075a9b;\n  font-size: 1rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .resumen-reconocimiento[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.8rem;\n  margin: 0;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%], \n.reconocimiento-asistente[_ngcontent-%COMP%]   .ayuda-texto[_ngcontent-%COMP%] {\n  color: #53657a;\n  font-size: 0.85rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0.2rem 0 0;\n  overflow-wrap: anywhere;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .funcion-ponente[_ngcontent-%COMP%], \n.reconocimiento-asistente[_ngcontent-%COMP%]   .solo-lectura[_ngcontent-%COMP%] {\n  display: inline-block;\n  font-size: 0.72rem;\n  border-radius: 0.3rem;\n  padding: 0.2rem 0.4rem;\n  background: #f7efd9;\n  color: #6d5318;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .texto-reconocimiento[_ngcontent-%COMP%] {\n  background: #f8fafc;\n  border-top: 3px solid #bd932d;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .texto-reconocimiento[_ngcontent-%COMP%]   .mensaje[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n  margin: 0.8rem 0;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   app-visor-pdf[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  min-width: 0;\n}\n@media (max-width: 800px) {\n  .reconocimiento-asistente[_ngcontent-%COMP%]   .informacion-reconocimiento[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .reconocimiento-asistente[_ngcontent-%COMP%]   .acciones-paso[_ngcontent-%COMP%] {\n    flex-wrap: wrap;\n  }\n}\n/*# sourceMappingURL=reconocimiento-asistente.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PrepararMunicipalComponent, { className: "PrepararMunicipalComponent", filePath: "src\\app\\pages\\emision-certificados\\generar-emitir\\preparar-municipal.component.ts", lineNumber: 29 });
})();
export {
  PrepararMunicipalComponent
};
//# sourceMappingURL=chunk-S66EWCTH.mjs.map
