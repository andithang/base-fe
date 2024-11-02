import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { BaseAuthorizationModule, DEFAULT_ACTION_CODES } from '@base-fe/authorization';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IconDefinition } from '@ant-design/icons-angular';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DeleteFill, DeleteOutline, EditFill, EditOutline, LinkOutline, PlusOutline, SaveOutline, SettingFill } from '@ant-design/icons-angular/icons';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { dataActions } from '../data/actions';
registerLocaleData(vi);

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/locale/', '.json');
}

function getTokenFactory() {
  return localStorage.getItem('Authorization') || '';
}

const icons: IconDefinition[] = [
  PlusOutline, EditOutline, DeleteOutline, LinkOutline, EditFill, DeleteFill, SaveOutline, SettingFill
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
      ACTION_CODES_PAGES: DEFAULT_ACTION_CODES,
      getUserPermission: () => dataActions,
    }),
    RouterModule.forRoot([
      {
        path: "pages/sys-config/modules",
        loadComponent: () => import('@base-fe/authorization').then(m => m.ModuleComponent),
      },
      {
        path: "auth/permissions",
        loadComponent: () => import('@base-fe/authorization').then(m => m.PermissionComponent),
      },
      {
        path: "pages/sys-config/actions",
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
