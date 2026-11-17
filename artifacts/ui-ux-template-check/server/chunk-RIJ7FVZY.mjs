import './polyfills.server.mjs';
import {
  listoParaEntrega
} from "./chunk-7CXPU5UM.mjs";
import {
  estadoCatalogo,
  origenCatalogo
} from "./chunk-BFRYA4IX.mjs";
import {
  VisorPdfComponent
} from "./chunk-FBTDJ3RZ.mjs";
import "./chunk-ZLU2ZG5B.mjs";
import {
  CambiosCertificadosService
} from "./chunk-ZIVCKBVU.mjs";
import {
  mensajeEtapaA
} from "./chunk-R23RR7XQ.mjs";
import {
  ActivatedRoute,
  RouterLink
} from "./chunk-OX7VSSQH.mjs";
import "./chunk-VNKXA6HD.mjs";
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
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate2
} from "./chunk-OYAKRC2F.mjs";
import "./chunk-X7LY3JHO.mjs";

// src/app/pages/emision-certificados/documentos/ver-documento.component.ts
var _c0 = (a0) => ({ pestana: "preparados", page: a0 });
var _c1 = () => ({ origen_documental: "practica" });
function VerDocumentoComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Cargando certificado...");
    \u0275\u0275elementEnd();
  }
}
function VerDocumentoComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 4);
    \u0275\u0275listener("click", function VerDocumentoComponent_Conditional_8_Template_button_click_2_listener() {
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
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function VerDocumentoComponent_Conditional_9_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-visor-pdf", 6);
  }
  if (rf & 2) {
    const d_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("integrado", true)("ajustarAncho", true)("persistido", true)("documentoId", d_r3.id_certificado_documento)("hashEsperado", d_r3.hash_pdf)("mostrarDescripcion", false)("controlesZoom", true);
  }
}
function VerDocumentoComponent_Conditional_9_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Sin PDF disponible.");
    \u0275\u0275elementEnd();
  }
}
function VerDocumentoComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 5)(1, "h2");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(5, VerDocumentoComponent_Conditional_9_Conditional_5_Template, 1, 7, "app-visor-pdf", 6)(6, VerDocumentoComponent_Conditional_9_Conditional_6_Template, 2, 0, "p");
  }
  if (rf & 2) {
    const d_r3 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r3.nombre_completo);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r1.origenTexto(d_r3), " \xB7 ", ctx_r1.estadoTexto(d_r3), "");
    \u0275\u0275advance();
    \u0275\u0275conditional(d_r3.hash_pdf && d_r3.codigo_verificacion ? 5 : 6);
  }
}
var VerDocumentoComponent = class _VerDocumentoComponent {
  route = inject(ActivatedRoute);
  api = inject(EmisionCertificadosService);
  destroy = inject(DestroyRef);
  carga;
  get regresoGerencia() {
    return this.route.snapshot.queryParamMap.get("origen") === "gerencia";
  }
  get regresoPracticas() {
    return this.route.snapshot.queryParamMap.get("origen") === "practicas";
  }
  get paginaRegreso() {
    const pagina = Number(this.route.snapshot.queryParamMap.get("page"));
    return Number.isSafeInteger(pagina) && pagina > 0 ? pagina : 1;
  }
  cambios = inject(CambiosCertificadosService);
  origenTexto = origenCatalogo;
  documento = signal(null);
  error = signal("");
  cargando = signal(false);
  estadoTexto(doc) {
    return this.regresoGerencia && listoParaEntrega(doc) ? "Listo para entrega" : estadoCatalogo(doc);
  }
  ngOnInit() {
    this.cambios.cambios$.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => this.cargar());
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => this.cargar());
  }
  cargar() {
    this.carga?.unsubscribe();
    const id = this.route.snapshot.paramMap.get("id") ?? "";
    const documento = Number(this.route.snapshot.paramMap.get("documentoId"));
    this.documento.set(null);
    this.error.set("");
    this.cargando.set(false);
    if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id)) || !Number.isSafeInteger(documento) || documento < 1) {
      this.error.set("Documento no encontrado.");
      return;
    }
    this.cargando.set(true);
    this.carga = this.api.catalogoAutorizado({ id_certificado: id }, "certificados-documentos").pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (filas) => {
        const fila = filas.find((f) => f.id_certificado === Number(id) && f.id_certificado_documento === documento);
        if (!fila)
          this.error.set("Documento no encontrado en tu \xE1mbito autorizado.");
        else
          this.documento.set(fila);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeEtapaA(e));
        this.cargando.set(false);
      }
    });
  }
  static \u0275fac = function VerDocumentoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VerDocumentoComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VerDocumentoComponent, selectors: [["app-ver-documento"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 10, vars: 8, consts: [["aria-label", "Volver al listado", 1, "btn", 3, "routerLink", "queryParams"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["role", "status"], ["role", "alert"], ["type", "button", 1, "btn", 3, "click"], ["aria-label", "Datos del certificado"], [3, "integrado", "ajustarAncho", "persistido", "documentoId", "hashEsperado", "mostrarDescripcion", "controlesZoom"]], template: function VerDocumentoComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "header")(1, "a", 0)(2, "span", 1);
      \u0275\u0275text(3, "arrow_back");
      \u0275\u0275elementEnd();
      \u0275\u0275text(4, "Volver");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "h1");
      \u0275\u0275text(6, "Certificado");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(7, VerDocumentoComponent_Conditional_7_Template, 2, 0, "p", 2)(8, VerDocumentoComponent_Conditional_8_Template, 4, 1)(9, VerDocumentoComponent_Conditional_9_Template, 7, 4);
    }
    if (rf & 2) {
      let tmp_4_0;
      \u0275\u0275advance();
      \u0275\u0275property("routerLink", ctx.regresoGerencia ? "/pendientes/documentos-firmar" : ctx.regresoPracticas ? "/certificaciones/generar-emitir" : "/certificaciones/certificados/documentos")("queryParams", ctx.regresoGerencia ? \u0275\u0275pureFunction1(5, _c0, ctx.paginaRegreso) : ctx.regresoPracticas ? \u0275\u0275pureFunction0(7, _c1) : null);
      \u0275\u0275advance(6);
      \u0275\u0275conditional(ctx.cargando() ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_4_0 = ctx.documento()) ? 9 : -1, tmp_4_0);
    }
  }, dependencies: [RouterLink, VisorPdfComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\nheader[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\nh1[_ngcontent-%COMP%], \nh2[_ngcontent-%COMP%] {\n  margin: 0.5rem 0;\n}\nh2[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n}\np[_ngcontent-%COMP%] {\n  margin: 0.5rem 0 1rem;\n}\n/*# sourceMappingURL=ver-documento.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VerDocumentoComponent, { className: "VerDocumentoComponent", filePath: "src\\app\\pages\\emision-certificados\\documentos\\ver-documento.component.ts", lineNumber: 27 });
})();
export {
  VerDocumentoComponent
};
//# sourceMappingURL=chunk-RIJ7FVZY.mjs.map
