import { Inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Router } from "@angular/router";
import { AccessTokenInjection, InterceptHandlerInjection, InterceptorHandler, ServerUrlInjection } from "../data-access/module-config";
import { TokenProviderService } from "../service/token-provider.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    @Inject(ServerUrlInjection) private serverUrl: string,
    @Inject(AccessTokenInjection) private accessToken: TokenProviderService,
    @Inject(InterceptHandlerInjection) private handlers: InterceptorHandler,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      !request ||
      !request.url ||
      (request.url.startsWith("http") &&
        !(this.serverUrl && request.url.startsWith(this.serverUrl)))
    ) {
      return next.handle(request);
    }
    if (this.accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: this.accessToken.getToken(),
          "Accept-Language": "vi",
        },
      });
    } else {
      request = request.clone({
        setHeaders: {
          "Accept-Language": "vi",
        },
      });
    }
    return next.handle(request).pipe(
      tap( // only perform side effects like logging, the emitted values will not be affected
        (event: HttpEvent<unknown>) => {
          if (event instanceof HttpResponse) {
            if(this.handlers.interceptSuccessHandler) this.handlers.interceptSuccessHandler(event);
          }
        },
        (err: HttpEvent<unknown>) => {
          if (err instanceof HttpErrorResponse) {
            if(this.handlers.interceptErrorHandler) this.handlers.interceptErrorHandler(err);
          }
        }
      )
    );
  }
}
