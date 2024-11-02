import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { PermissionService } from "../../../service/permission.service";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzModalModule, NzModalRef } from "ng-zorro-antd/modal";
import { NzNotificationModule, NzNotificationService } from "ng-zorro-antd/notification";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NgxTrimDirectiveModule } from "ngx-trim-directive";
import { getError, trimRequired } from "../../../shared/validators";
import { Permission } from "../../../data-access/permission.model";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NgxTrimDirectiveModule,
    NzCardModule,
    NzButtonModule,
    CommonModule,
    NzIconModule,
    NzGridModule,
    NzSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzModalModule,
    NzNotificationModule,
    TranslateModule
  ],
  selector: "base-fe-permission-form",
  styleUrls: ['permission-form.component.scss'],
  templateUrl: "permission-form.component.html",
})
export class PermissionFormComponent implements OnInit {
  constructor(
    private ref: NzModalRef<PermissionFormComponent>,
    private translate: TranslateService,
    private notify: NzNotificationService,
    private permissionService: PermissionService
  ) { }

  permission: Partial<Permission> = {};
  loading = true;
  formPermission: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, trimRequired]),
    code: new FormControl('', [Validators.required, trimRequired]),
    description: new FormControl('', []),
    status: new FormControl(1, [Validators.required]),
  });
  getError = (control: string) => getError(this.formPermission, control, this.translate, 'permissions');

  ngOnInit() {
    if (this.permission.id) this.initForm();
  }

  initForm() {
    this.formPermission = new FormGroup({
      id: new FormControl(this.permission.id, []),
      name: new FormControl(this.permission.name, [Validators.required, trimRequired]),
      code: new FormControl(this.permission.code, [Validators.required, trimRequired]),
      description: new FormControl(this.permission.description, []),
      status: new FormControl(this.permission.status, [Validators.required]),
    })
  }

  cancel() {
    this.ref.close();
  }

  submit() {
    this.formPermission.markAllAsTouched();
    if (this.formPermission.valid) {
      this.loading = true;
      if (this.permission.id) {
        this.permissionService.update({ id: this.permission.id, ...this.formPermission.value }).subscribe(() => {
          this.notify.success(this.translate.instant('base-fe.common.message.notify'), this.translate.instant('base-fe.permissions.message.insert-success'));
          this.ref.close(true);
          this.loading = false;
        }, () => {
          this.loading = false;
          this.notify.error(this.translate.instant('base-fe.common.message.notify'), this.translate.instant('base-fe.permissions.message.insert-fail'));
        })
      } else {
        this.permissionService.insert({ id: null, ...this.formPermission.value }).subscribe(() => {
          this.notify.success(this.translate.instant('base-fe.common.message.notify'), this.translate.instant('base-fe.permissions.message.insert-success'));
          this.ref.close(true);
          this.loading = false;
        }, () => {
          this.loading = false;
          this.notify.error(this.translate.instant('base-fe.common.message.notify'), this.translate.instant('base-fe.permissions.message.insert-fail'));
        })
      }
    }
  }

}
