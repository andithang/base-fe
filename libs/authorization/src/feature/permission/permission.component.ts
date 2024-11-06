import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
import { PermissionService } from '../../service/permission.service';
import { Permission } from '../../data-access/permission.model';
import { PermissionFormComponent } from './permission-form/permission-form.component';
import { SearchWithPagination } from '../../data-access/page-size';
import { MappingPermissionModuleComponent } from './mapping-permission-module/mapping-permission-module.component';
import { StatusCommonPipe } from '../../shared/pipe/status.pipe';
import { PermissionCheckerService } from '../../shared/permission-checker';
import { HEADER_TOTAL } from '../../data-access/constant';
import { ActionCodesPagesInjection, ActionCodesConfig } from '../../data-access/module-config';
import { HasPermissionDirective } from '../../shared/directive/has-permission.directive';
import { BaseFeAppService } from '../../service/app.service';
import { Subject, take, takeUntil } from 'rxjs';

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
    NgxTrimDirectiveModule,
    HasPermissionDirective
  ],
})
export class PermissionComponent implements OnInit, OnDestroy {

  constructor(
    private translateService: TranslateService,
    private modal: NzModalService,
    private permissionService: PermissionService,
    private notify: NzNotificationService,
    @Inject(ActionCodesPagesInjection) readonly actionCodesPages: ActionCodesConfig,
    private permissionChecker: PermissionCheckerService,
    private appService: BaseFeAppService
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
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.appService.translationLoaded$.pipe(takeUntil(this.destroy$), take(1)).subscribe((params) => {
      console.log(params);
      this.getListPermission();
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getListPermission() {
    if(this.permissionChecker.isActionAllowed(this.actionCodesPages.permissionPage.search)) {
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
    } else {
      this.loading = false;
      this.notify.error(this.translateService.instant('base-fe.notify.title'), this.translateService.instant('base-fe.permissions.permission.unauthorized.actions.search'));
    }
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
          this.notify.error(this.translateService.instant('base-fe.notify.title'), this.translateService.instant('base-fe.permissions.delete-failed'));
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
      nzTitle: this.translateService.instant('base-fe.permissions.map-permission-module'),
      nzContent: MappingPermissionModuleComponent,
      nzComponentParams: {
        permission
      },
      nzFooter: null,
      nzWidth: 900
    });
    ref.afterClose.subscribe(isSubmitted => {
      if (isSubmitted) {
        this.getListPermission();
      }
    })
  }

}
