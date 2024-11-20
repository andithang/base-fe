  import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { InjectionToken } from "@angular/core";
import { ActionAllowed, ActionPermission, ModulePermission, PermissionPagePermission } from "./permission-config";
import { DEFAULT_ACTION_CODES } from "./constant";
import { TokenProviderService } from "../service/token-provider.service";

export const ServerUrlInjection = new InjectionToken<string>("base-fe-server-url");
export const AccessTokenInjection = new InjectionToken<TokenProviderService>('base-fe-access-token');
export const InterceptHandlerInjection = new InjectionToken<string>('base-fe-interceptor');
export const UserPermissionInjection = new InjectionToken<UserPermission[]>("base-fe-user-permission");
export const ActionCodesPagesInjection = new InjectionToken<string>("base-fe-action-code-pages");

export class ModuleConfig {
  SERVER_URL = "";
  /**
   * configure action's codes for pages
   */
  ACTION_CODES_PAGES: ActionCodesConfig = DEFAULT_ACTION_CODES;
  interceptSuccessHandler: ((evt: HttpResponse<unknown>) => void) | undefined = undefined;
  interceptErrorHandler: ((evt: HttpErrorResponse) => void) | undefined = undefined;
}


export interface InterceptorHandler {
  interceptSuccessHandler: ((evt: HttpResponse<unknown>) => void) | undefined;
  interceptErrorHandler: ((evt: HttpErrorResponse) => void) | undefined;
}

export interface UserPermission {
  code: string;
  id: number;
  link: string;
  title: string;
  role: ActionAllowed[];
}

export interface ActionCodesConfig {
  actionPage: ActionPermission,
  modulePage: ModulePermission
  permissionPage: PermissionPagePermission
}
