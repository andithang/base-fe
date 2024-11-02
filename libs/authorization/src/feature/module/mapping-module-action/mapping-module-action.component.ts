import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Module } from '../../../data-access/module.model';
import { ModuleService } from '../../../service/module.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ActionService } from '../../../service/action.service';
import { Action } from '../../../data-access/action.model';
import { StatusCommonPipe } from '../../../shared/status.pipe';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { SearchWithPagination } from '../../../data-access/page-size';

@Component({
  selector: 'base-fe-mapping-module-module',
  templateUrl: './mapping-module-action.component.html',
  styleUrls: ['./mapping-module-action.component.scss'],
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
  ]
})
export class MappingModuleActionComponent implements OnInit {

  constructor(
    private ref: NzModalRef<MappingModuleActionComponent>,
    private translate: TranslateService,
    private notify: NzNotificationService,
    private moduleService: ModuleService,
    private actionService: ActionService
  ) { }

  module: Partial<Module> = {};
  loading = false;
  listActions: Action[] = [];
  pagination: SearchWithPagination = {
    page: 0,
    size: 5,
  };
  total = 0;
  formSearch: FormGroup = new FormGroup({
    code: new FormControl(''),
    name: new FormControl(''),
    status: new FormControl(null),
  })
  allChecked = false;
  indeterminate = false;
  checkedActionIds: number[] = [];

  ngOnInit() {
    if (this.module.id) {
      this.moduleService.getAllMappingModuleAction(this.module.id).subscribe((res) => {
        console.log(res);
        if (res.body) {
          this.checkedActionIds = res.body.map(item => item.actionId)
        } else {
          this.checkedActionIds = [];
        }
        this.getAllActiveActions();
      }
      )
    }
  }

  getAllActiveActions() {
    this.actionService.getAllAction().subscribe((res) => {
      this.listActions = res.map(ac => ({ ...ac, checked: this.checkedActionIds.includes(ac.id) }));
      this.total = res.length;
    })
  }

  search() {
    this.pagination.page = 0;
    this.getAllActiveActions();
  }

  onChangePageIndex(newPage: number) {
    this.pagination.page = newPage - 1;
    this.getAllActiveActions();
  }

  refreshStatus(): void {
    const validData = this.listActions.filter(value => !value.checked);
    const allChecked = validData.length > 0 && validData.every(value => value.checked === true);
    const allUnChecked = validData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  checkAll(value: boolean): void {
    this.listActions.forEach(data => {
      if (!data.checked) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }

  cancel() {
    this.ref.close();
  }

  submit() {
    this.loading = true;
    // this.moduleService.update({ id: this.module.id }).subscribe(() => {
    //   this.notify.success(this.translate.instant('base-fe.common.message.notify'), this.translate.instant('base-fe.modules.message.edit-success'));
    //   this.ref.close(true);
    //   this.loading = false;
    // }, () => {
    //   this.loading = false;
    //   this.notify.error(this.translate.instant('base-fe.common.message.notify'), this.translate.instant('base-fe.modules.message.edit-fail'));
    // })

    const listUncheck: { moduleId: number | undefined, actionId: number }[] = [];
    const listAdd: { moduleId: number | undefined, actionId: number }[] = [];
    this.listActions.map(value => {
      let isUncheck = true;
      this.checkedActionIds.map((select, index) => {
        if (value.id === select) {
          this.checkedActionIds.splice(index, index + 1);
          isUncheck = false;
        }
      })
      if (isUncheck) {
        listUncheck.push({ moduleId: this.module.id, actionId: value.id });
      }
    })
    this.checkedActionIds.map(value => {
      listAdd.push({ moduleId: this.module.id, actionId: value })
    })
    this.moduleService.deleteMappingModuleAction(listUncheck).subscribe(
      () => {
        this.moduleService.inssertMappingModuleAction(listAdd).subscribe(
          () => {
            this.ref.close(true);
            this.notify.success(this.translate.instant('base-fe.common.message.notify'), this.translate.instant('base-fe.modules.message.mapping-success'));
            this.loading = false;
          },
          () => {
            this.loading = false;
            this.notify.error(this.translate.instant('base-fe.common.message.notify'), this.translate.instant('base-fe.modules.message.mapping-fail'));
          }
        )
      },
    )

  }
}
