import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PermissionService } from '../../../service/permission.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Permission } from '../../../data-access/permission.model';

@Component({
  selector: 'base-fe-mapping-permission-module',
  templateUrl: './mapping-permission-module.component.html',
  styleUrls: ['./mapping-permission-module.component.scss'],
  standalone: true,
  imports: [
    CommonModule, NzButtonModule, NzIconModule, NzTableModule,
    NzSwitchModule, FormsModule
  ]
})
export class MappingPermissionModuleComponent implements OnInit {

  constructor(
    private ref: NzModalRef<MappingPermissionModuleComponent>,
    private translate: TranslateService,
    private notify: NzNotificationService,
    private permissionService: PermissionService
  ) { }

  permission: Partial<Permission> = {};
  loading = true;

  ngOnInit() {
    console.log(this.permission);
  }

}
