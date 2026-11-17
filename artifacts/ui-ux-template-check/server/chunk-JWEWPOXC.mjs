import './polyfills.server.mjs';
import {
  AuthService
} from "./chunk-NP7M7R34.mjs";
import {
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  input,
  untracked,
  ɵɵdefineDirective
} from "./chunk-OYAKRC2F.mjs";

// src/app/shared/directives/has-permission.directive.ts
var HasPermissionDirective = class _HasPermissionDirective {
  appHasPermission = input.required();
  auth = inject(AuthService);
  plantilla = inject(TemplateRef);
  contenedor = inject(ViewContainerRef);
  visible = false;
  constructor() {
    effect(() => {
      const permitido = this.auth.tienePermiso(this.appHasPermission());
      untracked(() => {
        if (permitido && !this.visible) {
          this.contenedor.createEmbeddedView(this.plantilla);
        } else if (!permitido && this.visible) {
          this.contenedor.clear();
        }
      });
      this.visible = permitido;
    });
  }
  static \u0275fac = function HasPermissionDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HasPermissionDirective)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({ type: _HasPermissionDirective, selectors: [["", "appHasPermission", ""]], inputs: { appHasPermission: [1, "appHasPermission"] }, standalone: true });
};

export {
  HasPermissionDirective
};
//# sourceMappingURL=chunk-JWEWPOXC.mjs.map
