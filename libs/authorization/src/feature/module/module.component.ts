import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { ModuleService } from '../../service/module.service';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SearchWithPagination } from '../../data-access/page-size';
import { HEADER_TOTAL } from '../../data-access/constant';
import { Module, ParentModule } from '../../data-access/module.model';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { MappingModuleActionComponent } from './mapping-module-action/mapping-module-action.component';
import { ModuleFormComponent } from './module-form/module-form.component';
import { StatusCommonPipe } from '../../shared/pipe/status.pipe';

@Component({
  selector: 'base-fe-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss'],
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
    ModuleFormComponent,
    MappingModuleActionComponent
  ],
  providers: [NzModalService]
})

export class ModuleComponent implements OnInit {
  constructor(
    private translateService: TranslateService,
    private modal: NzModalService,
    private moduleService: ModuleService,
    private notify: NzNotificationService
  ) { }

  listModules: Module[] = [];
  listParentModules: ParentModule[] = [];
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
    parentId: new FormControl(null),
  })

  ngOnInit() {
    this.getListParentModules();
    this.getListModules();
  }

  private getListModules() {
    this.loading = true;
    this.moduleService
      .doSearch(this.formSearch.value, this.pagination)
      .subscribe(({ body: list, headers }) => {
        this.total = Number(headers.get(HEADER_TOTAL));
        if (list) {
          this.listModules = list;
        }
        this.loading = false;
      }, () => this.loading = false);
  }

  getListParentModules() {
    this.moduleService.getParent().subscribe(({ body: list }) => {
      this.listParentModules = list ? list : [];
    });
  }

  onChangePageIndex(newPage: number) {
    this.pagination.page = newPage - 1;
    this.getListModules();
  }

  search() {
    this.pagination.page = 0;
    this.getListModules();
  }

  deleteModule(module: Module) {
    this.modal.confirm({
      nzContent: this.translateService.instant('base-fe.modules.delete-content', { name: module.name }),
      nzTitle: this.translateService.instant('base-fe.modules.delete-title'),
      nzOnOk: () => {
        this.moduleService.delete(module).subscribe(() => {
          this.notify.success(this.translateService.instant('base-fe.notify.title'), this.translateService.instant('base-fe.modules.delete-success'));
          this.getListModules();
        }, () => {
          this.notify.error(this.translateService.instant('base-fe.notify.title'), this.translateService.instant('base-fe.modules.delete-success'));
          this.loading = false;
        });
      }
    })
  }

  insertModule() {
    const ref = this.modal.create({
      nzTitle: this.translateService.instant('base-fe.modules.create-module'),
      nzContent: ModuleFormComponent,
      nzFooter: null
    });
    ref.afterClose.subscribe(isSubmitted => {
      if (isSubmitted) {
        this.getListModules();
      }
    })
  }

  updateModule(module: Module) {
    const ref = this.modal.create({
      nzTitle: this.translateService.instant('base-fe.modules.edit-module'),
      nzContent: ModuleFormComponent,
      nzComponentParams: {
        module
      },
      nzFooter: null
    });
    ref.afterClose.subscribe(isSubmitted => {
      if (isSubmitted) {
        this.getListModules();
      }
    })
  }

  onMappingModuleAction(module: Module) {
    const ref = this.modal.create({
      nzTitle: this.translateService.instant('base-fe.modules.map-module-action'),
      nzContent: MappingModuleActionComponent,
      nzComponentParams: {
        module
      },
      nzFooter: null,
      nzWidth: 900
    });
    ref.afterClose.subscribe(isSubmitted => {
      if (isSubmitted) {
        this.getListModules();
      }
    })
  }
}
