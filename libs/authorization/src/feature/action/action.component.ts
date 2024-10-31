import { Component, OnInit } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ActionService } from "../../service/action.service";
import { Action, ActionQuery } from "../../data-access/action.model";
import { SearchWithPagination } from "../../data-access/page-size";
import { HEADER_TOTAL } from "../../data-access/constant";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzCardModule } from "ng-zorro-antd/card";
import { StatusCommonPipe } from "../../shared/status.pipe";
import { NzButtonModule } from "ng-zorro-antd/button";
import { CommonModule } from "@angular/common";
import { NzIconModule } from "ng-zorro-antd/icon";

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
    NzIconModule
  ],
  styleUrls: ['action.component.scss']
})
export class ActionComponent implements OnInit {
  constructor(
    private translateService: TranslateService,
    private actionService: ActionService
  ) {}

  listActions: Action[] = [];
  pagination: SearchWithPagination = {
    page: 0,
    size: 10,
  };
  total = 0;
  query: ActionQuery = {
    code: null,
    description: null,
    id: null,
    name: null,
    status: null,
    tenantId: null,
    updateTime: null,
  };
  loading = true;

  private getListActions() {
    this.actionService
      .doSearch(this.query, this.pagination)
      .subscribe(({ body: list, headers }) => {
        this.total = Number(headers.get(HEADER_TOTAL));
        if (list) {
          this.listActions = list;
        }
        this.loading = false;
      });
  }

  search(newPage: number) {
    this.pagination.page = newPage - 1;
    this.getListActions();
  }

  ngOnInit() {
    this.getListActions();
  }
}
