import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Module, ModuleAction } from '../../../data-access/module.model';
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
  listRawActions: Action[] = [];
  pagination: SearchWithPagination = {
    page: 0,
    size: 5,
  };
  total = 0;
  formSearch: FormGroup = new FormGroup({
    code: new FormControl('')
  })
  allChecked = false;
  indeterminate = false;
  checkedActionIds: number[] = [];
  checkedActions: ModuleAction[] = [];

  ngOnInit() {
    if (this.module.id) {
      this.moduleService.getAllMappingModuleAction(this.module.id).subscribe((res) => {
        if (res.body) {
          this.checkedActions = res.body;
          this.checkedActionIds = res.body.map(item => item.actionId)
        } else {
          this.checkedActionIds = [];
          this.checkedActions = [];
        }
        this.getAllActiveActions();
      }
      )
    }
  }

  getAllActiveActions() {
    const observer = this.formSearch.value ? this.actionService.getActionTableMap(this.formSearch.value) : this.actionService.getAllAction();
    observer.subscribe((res) => {
      const activeRes = res.filter(item => item.status);
      this.listActions = activeRes.map(ac => ({ ...ac, checked: this.checkedActionIds.includes(ac.id) }));
      this.total = activeRes.length;
      this.refreshStatus();
    })
  }

  search() {
    this.pagination.page = 0;
    this.getAllActiveActions();
  }

  onChangePageIndex(newPage: number) {
    this.pagination.page = newPage - 1;
    this.refreshStatus();
  }

  refreshStatus(): void {
    const currentSize = (this.pagination.page + 1) * this.pagination.size;
    const validData = this.listActions.filter((value, index) => index < currentSize);
    const allChecked = validData.length > 0 && validData.every(value => value.checked == true);
    this.allChecked = allChecked;
  }

  checkAll(value: boolean): void {
    const currentSize = (this.pagination.page + 1) * this.pagination.size;
    this.listActions.filter((value, index) => index < currentSize).forEach(data => {
      data.checked = value;
    });
    this.refreshStatus();
  }

  cancel() {
    this.ref.close();
  }

  submit() {
    this.loading = true;
    const listUncheck: ModuleAction[] = [];
    const listAdd: { moduleId: number | undefined, actionId: number }[] = [];
    this.checkedActions.map(value => {
      let isUncheck = true;
      this.checkedActionIds.map((select, index) => {
        if (value.id === select) {
          this.checkedActionIds.splice(index, index + 1);
          isUncheck = false;
        }
      })
      if (isUncheck) {
        listUncheck.push(value);
      }
    })

    this.listActions.map(value => {
      if (value.checked) {
        listAdd.push({ moduleId: this.module.id, actionId: value.id })
      }
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
