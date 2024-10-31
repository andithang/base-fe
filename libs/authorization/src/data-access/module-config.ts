import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { InjectionToken } from "@angular/core";

export const ServerUrlInjection = new InjectionToken<string>(
  "base-fe-server-url"
);

export class ModuleConfig {
  interceptSuccessHandler: ((evt: HttpResponse<unknown>) => void) | undefined = undefined;
  interceptErrorHandler: ((evt: HttpErrorResponse) => void) | undefined = undefined;
  SERVER_URL = "";
  getTokenFactory: () => string = () => "";
}

export const AccessTokenInjection = new InjectionToken<string>('base-fe-access-token');
export const InterceptHandlerInjection = new InjectionToken<string>('base-fe-interceptor');

export interface InterceptorHandler {
  interceptSuccessHandler: ((evt: HttpResponse<unknown>) => void) | undefined;
  interceptErrorHandler: ((evt: HttpErrorResponse) => void) | undefined;
}