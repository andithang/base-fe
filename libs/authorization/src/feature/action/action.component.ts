import { Component, OnInit } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ActionService } from "../../service/action.service";
import { Action } from "../../data-access/action.model";
import { SearchWithPagination } from "../../data-access/page-size";
import { HEADER_TOTAL } from "../../data-access/constant";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzCardModule } from "ng-zorro-antd/card";
import { StatusCommonPipe } from "../../shared/status.pipe";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzEmptyModule } from "ng-zorro-antd/empty";
import { CommonModule } from "@angular/common";
import { NzIconModule } from "ng-zorro-antd/icon";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzModalModule, NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationModule, NzNotificationService } from "ng-zorro-antd/notification";

@Component({
  selector: "base-fe-action",
  templateUrl: "action.component.html",
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
    NzModalModule
  ],
  styleUrls: ['action.component.scss']
})
export class ActionComponent implements OnInit {
  constructor(
    private translateService: TranslateService,
    private modal: NzModalService,
    private actionService: ActionService,
    private notify: NzNotificationService
  ) {}

  listActions: Action[] = [];
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

  private getListActions() {
    this.loading = true;
    this.actionService
      .doSearch(this.formSearch.value, this.pagination)
      .subscribe(({ body: list, headers }) => {
        this.total = Number(headers.get(HEADER_TOTAL));
        if (list) {
          this.listActions = list;
        }
        this.loading = false;
      }, () => this.loading = false);
  }

  onChangePageIndex(newPage: number) {
    this.pagination.page = newPage - 1;
    this.getListActions();
  }

  search() {
    this.pagination.page = 0;
    this.getListActions();
  }

  ngOnInit() {
    this.getListActions();
  }

  delete(action: Action) {
    this.modal.confirm({
      nzContent: this.translateService.instant('base-fe.actions.delete-content', { name: action.name }),
      nzTitle: this.translateService.instant('base-fe.actions.delete-title'),
      nzOnOk: () => {
        this.actionService.delete(action).subscribe(() => {
          this.notify.success(this.translateService.instant('base-fe.notify.title'), this.translateService.instant('base-fe.actions.delete-success'));
          this.getListActions();
        }, () => {
          this.notify.error(this.translateService.instant('base-fe.notify.title'), this.translateService.instant('base-fe.actions.delete-success'));
          this.loading = false;
        });
      }
    })
  }
}
