import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
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
import { Module } from "../../../data-access/module.model";
import { ModuleService } from "../../../service/module.service";

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
  selector: "base-fe-module-form",
  styleUrls: ['module-form.component.scss'],
  templateUrl: "module-form.component.html",
})
export class ModuleFormComponent implements OnInit {
  constructor(
    private ref: NzModalRef<ModuleFormComponent>,
    private translate: TranslateService,
    private notify: NzNotificationService,
    private moduleService: ModuleService
  ) { }

  module: Partial<Module> = {};
  loading = true;
  formModule: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, trimRequired]),
    code: new FormControl('', [Validators.required, trimRequired]),
    description: new FormControl('', []),
    status: new FormControl(1, [Validators.required]),
  });
  getError = (control: string) => getError(this.formModule, control, this.translate, 'modules');

  ngOnInit() {
    if (this.module.id) this.initForm();
  }

  initForm() {
    this.formModule = new FormGroup({
      id: new FormControl(this.module.id, []),
      name: new FormControl(this.module.name, [Validators.required, trimRequired]),
      code: new FormControl(this.module.code, [Validators.required, trimRequired]),
      description: new FormControl(this.module.description, []),
      status: new FormControl(this.module.status, [Validators.required]),
    })
  }

  cancel() {
    this.ref.close();
  }

  submit() {
    this.formModule.markAllAsTouched();
    if (this.formModule.valid) {
      this.loading = true;
      if (this.module.id) {
        this.moduleService.update({ id: this.module.id, ...this.formModule.value }).subscribe(() => {
          this.notify.success(this.translate.instant('base-fe.common.message.notify'), this.translate.instant('base-fe.modules.message.insert-success'));
          this.ref.close(true);
          this.loading = false;
        }, () => {
          this.loading = false;
          this.notify.error(this.translate.instant('base-fe.common.message.notify'), this.translate.instant('base-fe.modules.message.insert-fail'));
        })
      } else {
        this.moduleService.insert({ id: null, ...this.formModule.value }).subscribe(() => {
          this.notify.success(this.translate.instant('base-fe.common.message.notify'), this.translate.instant('base-fe.modules.message.insert-success'));
          this.ref.close(true);
          this.loading = false;
        }, () => {
          this.loading = false;
          this.notify.error(this.translate.instant('base-fe.common.message.notify'), this.translate.instant('base-fe.modules.message.insert-fail'));
        })
      }
    }
  }

}
