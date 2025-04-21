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
import { UsageLoggerService } from "./shared/usage-logger";

@NgModule({
  imports: [CommonModule, HttpClientModule],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    UsageLoggerService
  ],
})
export class BaseAuthorizationModule {

  constructor(private usageLoggerService: UsageLoggerService) {
    this.usageLoggerService.init();
  }

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
