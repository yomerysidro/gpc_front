import './polyfills.server.mjs';
import {
  HttpContextToken
} from "./chunk-TNXV45E5.mjs";

// src/environments/environment.ts
var environment = {
  production: false,
  // El proxy de ng serve reenvía /api al backend local.
  apiBaseUrl: "/api"
};

// src/app/core/security/auth-request.context.ts
var AUTHENTICATED_REQUEST = new HttpContextToken(() => false);

export {
  environment,
  AUTHENTICATED_REQUEST
};
//# sourceMappingURL=chunk-HFD7K63G.mjs.map
