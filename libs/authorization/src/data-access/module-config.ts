import { InjectionToken } from "@angular/core";

export const ModuleInjectionToken = new InjectionToken<ModuleConfig>(
  "base-fe-authorization"
);

export class ModuleConfig {
  SERVER_URL = "";
}
