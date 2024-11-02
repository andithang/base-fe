import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { StatusCommonPipe } from '../../shared/status.pipe';
import { PermissionService } from '../../service/permission.service';
import { Permission } from '../../data-access/permission.model';
import { PermissionFormComponent } from './permission-form/permission-form.component';
import { HEADER_TOTAL } from '@base-fe/authorization';
import { SearchWithPagination } from '../../data-access/page-size';
import { MappingPermissionModuleComponent } from './mapping-permission-module/mapping-permission-module.component';

@Component({
  selector: 'base-fe-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    NzTableModule,
    NzCardModule,
    StatusCommonPipe,
    NzButtonModule,
    CommonModule,
    NzIconModule,
    NzGridModule,
    NzSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzEmptyModule,
    NzNotificationModule,
    NzModalModule,
    NgxTrimDirectiveModule
  ],
})
export class PermissionComponent implements OnInit {

  constructor(
    private translateService: TranslateService,
    private modal: NzModalService,
    private permissionService: PermissionService,
    private notify: NzNotificationService
  ) { }

  listPermissions: Permission[] = [];
  pagination: SearchWithPagination = {
    page: 0,
    size: 10,
  };
  total = 0;
  loading = true;
  formSearch: FormGroup = new FormGroup({
    code: new FormControl(''),
    name: new FormControl(''),
    status: new FormControl(null),
  })

  ngOnInit() {
    this.getListPermission();
  }

  private getListPermission() {
    this.loading = true;
    this.permissionService
      .doSearch(this.formSearch.value, this.pagination)
      .subscribe(({ body: list, headers }) => {
        this.total = Number(headers.get(HEADER_TOTAL));
        if (list) {
          this.listPermissions = list;
        }
        this.loading = false;
      }, () => this.loading = false);
  }

  onChangePageIndex(newPage: number) {
    this.pagination.page = newPage - 1;
    this.getListPermission();
  }

  search() {
    this.pagination.page = 0;
    this.getListPermission();
  }

  deletePermission(permission: Permission) {
    this.modal.confirm({
      nzContent: this.translateService.instant('base-fe.permissions.delete-content', { name: permission.name }),
      nzTitle: this.translateService.instant('base-fe.permissions.delete-title'),
      nzOnOk: () => {
        this.permissionService.delete(permission).subscribe(() => {
          this.notify.success(this.translateService.instant('base-fe.notify.title'), this.translateService.instant('base-fe.permissions.delete-success'));
          this.getListPermission();
        }, () => {
          this.notify.error(this.translateService.instant('base-fe.notify.title'), this.translateService.instant('base-fe.permissions.delete-success'));
          this.loading = false;
        });
      }
    })
  }

  insertPermission() {
    const ref = this.modal.create({
      nzTitle: this.translateService.instant('base-fe.permissions.create-permission'),
      nzContent: PermissionFormComponent,
      nzFooter: null
    });
    ref.afterClose.subscribe(isSubmitted => {
      if (isSubmitted) {
        this.getListPermission();
      }
    })
  }

  updatePermisson(permission: Permission) {
    const ref = this.modal.create({
      nzTitle: this.translateService.instant('base-fe.permissions.edit-permission'),
      nzContent: PermissionFormComponent,
      nzComponentParams: {
        permission
      },
      nzFooter: null
    });
    ref.afterClose.subscribe(isSubmitted => {
      if (isSubmitted) {
        this.getListPermission();
      }
    })
  }

  onMappingPermissionModule(permission: Permission) {
    const ref = this.modal.create({
      nzTitle: this.translateService.instant('base-fe.permissions.edit-permission'),
      nzContent: MappingPermissionModuleComponent,
      nzComponentParams: {
        permission
      },
      nzFooter: null
    });
    ref.afterClose.subscribe(isSubmitted => {
      if (isSubmitted) {
        this.getListPermission();
      }
    })
  }

}
