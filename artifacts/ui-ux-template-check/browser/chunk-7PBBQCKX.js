import {
  HttpContextToken
} from "./chunk-IJ23LC2U.js";

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
//# sourceMappingURL=chunk-7PBBQCKX.js.map
