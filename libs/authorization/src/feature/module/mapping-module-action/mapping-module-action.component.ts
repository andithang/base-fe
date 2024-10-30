import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModuleInjectionToken, ModuleConfig } from 'libs/authorization/src/data-access/module-config';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-mapping-module-action',
  templateUrl: './mapping-module-action.component.html',
  styleUrls: ['./mapping-module-action.component.scss'],
  standalone: true,
  imports: [
    CommonModule, NzButtonModule, NzIconModule, NzTableModule,
    NzSwitchModule, FormsModule
  ]
})
export class MappingModuleActionComponent implements OnInit {

  constructor(
    @Inject(ModuleInjectionToken) private moduleConfig: ModuleConfig,
    private _modalRef: NzModalRef
  ) { }

  ngOnInit() {
  }

}
