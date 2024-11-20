import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ActionCodesPagesInjection,
  InterceptHandlerInjection,
  ModuleConfig,
  ServerUrlInjection,
} from "./data-access/module-config";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptor } from "./interceptor/auth.interceptor";

@NgModule({
  imports: [CommonModule, HttpClientModule],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class BaseAuthorizationModule {
  static forRoot(
    config: ModuleConfig
  ): ModuleWithProviders<BaseAuthorizationModule> {
    return {
      ngModule: BaseAuthorizationModule,
      providers: [
        { provide: ServerUrlInjection, useValue: config.SERVER_URL },
        {
          provide: InterceptHandlerInjection,
          useValue: {
            interceptSuccessHandler: config.interceptSuccessHandler,
            interceptErrorHandler: config.interceptErrorHandler,
          },
        },
        {
          provide: ActionCodesPagesInjection, useValue: config.ACTION_CODES_PAGES
        }
      ],
    };
  }
}
