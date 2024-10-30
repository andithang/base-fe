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
import { AccessTokenInjection, ServerUrlInjection } from "../data-access/module-config";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    @Inject(ServerUrlInjection) private serverUrl: string,
    @Inject(AccessTokenInjection) private accessToken: string,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
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
          Authorization: this.accessToken,
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
      tap(
        (event: any) => {
          if (event instanceof HttpResponse) {
            localStorage.setItem("httpHeaders", "ok");
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401 || err.status === 0) {
              console.log("1.auth");
              this.router.navigate(["auths/login"]);
            }
          }
        }
      )
    );
  }
}
