import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { BaseAuthorizationModule } from '@base-fe/authorization';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IconDefinition } from '@ant-design/icons-angular';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DeleteFill, DeleteOutline, EditFill, EditOutline, LinkOutline, PlusOutline } from '@ant-design/icons-angular/icons';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
registerLocaleData(vi);

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/locale/', '.json');
}

function getTokenFactory() {
  return localStorage.getItem('Authorization') || '';
}

const icons: IconDefinition[] = [
  PlusOutline, EditOutline, DeleteOutline, LinkOutline, EditFill, DeleteFill,
];

@NgModule({
  declarations: [AppComponent],
  imports: [ 
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    BaseAuthorizationModule.forRoot({
      SERVER_URL: "http://103.143.206.116:8084/api",
      getTokenFactory,
      interceptErrorHandler(evt) {
        console.log(evt);
      },
      interceptSuccessHandler(evt) {
        console.log(evt);
      },
    }),
    RouterModule.forRoot([
      {
        path: "auth/modules",
        loadComponent: () => import('@base-fe/authorization').then(m => m.ModuleComponent),
      },
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
    NzIconModule.forRoot(icons),
  ],
  providers: [
    { provide: NZ_I18N, useValue: vi_VN }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
