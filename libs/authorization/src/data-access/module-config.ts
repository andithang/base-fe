import { InjectionToken } from "@angular/core";

export const ServerUrlInjection = new InjectionToken<string>(
  "base-fe-server-url"
);

export class ModuleConfig {
  SERVER_URL = "";
  getTokenFactory: () => string = () => "";
}

export const AccessTokenInjection = new InjectionToken<string>('base-fe-access-token');