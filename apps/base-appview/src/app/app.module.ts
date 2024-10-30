import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { BaseAuthorizationModule } from '@base-fe/authorization';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/locale/', '.json');
}

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [
    BrowserModule, 
    HttpClientModule,
    BaseAuthorizationModule.forRoot({
      SERVER_URL: "abc"
    }),
    RouterModule.forRoot([
      {
        path: "",
        loadComponent: () => import('@base-fe/authorization').then(m => m.ActionComponent)
      }
    ]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
      defaultLanguage: 'vi',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
