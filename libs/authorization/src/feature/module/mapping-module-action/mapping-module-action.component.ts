import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Module } from '../../../data-access/module.model';
import { ModuleService } from '../../../service/module.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'base-fe-mapping-module-module',
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
    private ref: NzModalRef<MappingModuleActionComponent>,
    private translate: TranslateService,
    private notify: NzNotificationService,
    private moduleService: ModuleService
  ) { }

  module: Partial<Module> = {};
  loading = true;

  ngOnInit() {
    console.log(this.module);
  }

}
