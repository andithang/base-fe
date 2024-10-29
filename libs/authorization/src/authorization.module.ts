import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestModule } from './feature/test/test.module';
import { ModuleConfig, ModuleInjectionToken } from './data-access/module-config';

@NgModule({
  imports: [CommonModule, TestModule],
  exports: []
})
export class BaseAuthorizationModule { 
  static forRoot(config: ModuleConfig): ModuleWithProviders<BaseAuthorizationModule> {
    return {
      ngModule: BaseAuthorizationModule,
      providers: [
        {provide: ModuleInjectionToken, useValue: config }
      ]
    };
  }
}
