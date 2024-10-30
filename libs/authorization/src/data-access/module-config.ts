import { InjectionToken } from "@angular/core";

export const ModuleInjectionToken = new InjectionToken<string>(
  "base-fe-authorization"
);

export class ModuleConfig {
  SERVER_URL = "";
  getTokenFactory: () => string = () => "";
}

export const AccessTokenInjection = new InjectionToken<string>('base-fe-access-token');