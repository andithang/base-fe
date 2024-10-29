import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { BaseAuthorizationModule } from '@base-fe/authorization';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [
    BrowserModule, 
    BaseAuthorizationModule.forRoot({
      SERVER_URL: "abc"
    }),
    RouterModule.forRoot([
      {
        path: "",
        loadComponent: () => import('@base-fe/authorization').then(m => m.TestComponent)
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
