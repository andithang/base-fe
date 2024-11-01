import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ActionService } from "../../../service/action.service";
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
import { Action } from "../../../data-access/action.model";

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
  selector: "base-fe-action-form",
  styleUrls: ['action-form.component.scss'],
  templateUrl: "action-form.component.html",
})
export class ActionFormComponent implements OnInit {
  constructor(
    private ref: NzModalRef<ActionFormComponent>,
    private translate: TranslateService,
    private notify: NzNotificationService,
    private actionService: ActionService
  ) {}

  action: Partial<Action> = {};
  loading = true;
  formAction: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, trimRequired]),
    code: new FormControl('', [Validators.required, trimRequired]),
    description: new FormControl('', []),
    status: new FormControl(1, [Validators.required]),
  });
  getError = (control: string) => getError(this.formAction, control, this.translate, 'actions');

  ngOnInit() {
    if(this.action.id) this.initForm();
  }

  initForm() {
    this.formAction = new FormGroup({
      id: new FormControl(this.action.id, []),
      name: new FormControl(this.action.name, [Validators.required, trimRequired]),
      code: new FormControl(this.action.code, [Validators.required, trimRequired]),
      description: new FormControl(this.action.description, []),
      status: new FormControl(this.action.status, [Validators.required]),
    })
  }

  cancel() {
    this.ref.close();
  }

  submit() {
    this.formAction.markAllAsTouched();
    if(this.formAction.valid) {
      this.loading = true;
      if(this.action.id) {
        this.actionService.update({id: this.action.id, ...this.formAction.value}).subscribe(() => {
          this.notify.success(this.translate.instant('base-fe.common.message.notify'), this.translate.instant('base-fe.actions.message.insert-success'));
          this.ref.close(true);
          this.loading = false;
        }, () => {
          this.loading = false;
          this.notify.error(this.translate.instant('base-fe.common.message.notify'), this.translate.instant('base-fe.actions.message.insert-fail'));
        })
      } else {
        this.actionService.insert({id: null, ...this.formAction.value}).subscribe(() => {
          this.notify.success(this.translate.instant('base-fe.common.message.notify'), this.translate.instant('base-fe.actions.message.insert-success'));
          this.ref.close(true);
          this.loading = false;
        }, () => {
          this.loading = false;
          this.notify.error(this.translate.instant('base-fe.common.message.notify'), this.translate.instant('base-fe.actions.message.insert-fail'));
        })
      }
    }
  }

}
