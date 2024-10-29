import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { BaseAuthorizationModule } from '@base-fe/authorization';
import { RouterModule } from '@angular/router';
import { IconDefinition } from '@ant-design/icons-angular';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DeleteOutline, EditOutline, LinkOutline, PlusOutline } from '@ant-design/icons-angular/icons';

import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
registerLocaleData(vi);

import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';

const icons: IconDefinition[] = [
  PlusOutline, EditOutline, DeleteOutline, LinkOutline
];

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BaseAuthorizationModule.forRoot({
      SERVER_URL: "abc"
    }),
    RouterModule.forRoot([
      {
        path: "auth/modules",
        loadComponent: () => import('@base-fe/authorization').then(m => m.ModuleComponent),
      },
      {
        path: "",
        loadComponent: () => import('@base-fe/authorization').then(m => m.TestComponent)
      }
    ]),
    NzIconModule.forRoot(icons),
  ],
  providers: [
    { provide: NZ_I18N, useValue: vi_VN }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
