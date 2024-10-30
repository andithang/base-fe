import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ModuleConfig, ServerUrlInjection } from '../../data-access/module-config';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Module } from '../../data-access/module.model';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';
import * as _moment from 'moment';
import { APP_DATE_FORMAT, APP_MENU_TITLE, NULL_SYMBOL } from '../../data-access/constant';
import { ModuleFormComponent } from './module-form/module-form.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MappingModuleActionComponent } from './mapping-module-action/mapping-module-action.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'fea-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss'],
  standalone: true,
  imports: [
    CommonModule, NzButtonModule, NzIconModule, NzTableModule,
    NzSwitchModule, FormsModule, ModuleFormComponent, MappingModuleActionComponent
  ],
  providers: [NzModalService]
})

export class ModuleComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(ServerUrlInjection) private moduleConfig: ModuleConfig,
    private _modalService: NzModalService
  ) { }

  ngOnInit() {
    console.log(this.moduleConfig);
    this.getListModules();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  momentParser = (time: string | undefined) => {
    return time ? _moment(time).format(APP_DATE_FORMAT) : NULL_SYMBOL;
  }
  title: string = APP_MENU_TITLE.MODULE;
  listModules: Partial<Module>[] = [];
  pageIndex: number = 1;
  pageSize: number = 10;
  totalModules: number = 0;

  destroy$: Subject<boolean> = new Subject<boolean>();

  onChangePageIndex(value: number) {
    this.pageIndex = value
  }

  onChangePageSize(value: number) {
    this.pageSize = value;
  }

  /**
   * Lấy danh sách modules
   */
  getListModules() {
    this.listModules = mockModules;
  }

  onAddModule() {
    const modalRef = this._modalService.create({
      nzTitle: 'Thêm mới Module',
      nzContent: ModuleFormComponent
    });
  }

  onUpdateModule(module: Partial<Module>) {
    const modalRef = this._modalService.create({
      nzTitle: 'Sửa thông tin Module',
      nzContent: ModuleFormComponent
    });
  }

  onDeleteModule(module: Partial<Module>) {
    const modalRef = this._modalService.confirm({
      nzTitle: 'Xác nhận xóa Module',
      nzContent: `Bạn có chắc chắn muốn xóa Module ${module.name}?`,
      nzOkText: 'Xóa',
      nzCancelText: 'Hủy'
    });
  }

  onChangeModuleStatus(module: Partial<Module>) {
    const title = module.status ? 'Xác nhận vô hiệu hóa Module' : 'Xác nhận khôi phục Module';
    const content = module.status
      ? `Bạn có chắc chắn muốn vô hiệu hóa Module : ${module.name}?`
      : `Bạn có chắc chắn muốn khôi phục Module : ${module.name}?`;
    const buttonLabel = module.status ? 'Vô hiệu hóa' : 'Khôi phục';

    const modalRef = this._modalService.confirm({
      nzTitle: title,
      nzContent: content,
      nzOkText: buttonLabel,
      nzCancelText: 'Hủy'
    });

    modalRef.afterClose.pipe(takeUntil(this.destroy$)).subscribe(res => {
      module.status = module.status ? 0 : 1;
    })
  }

  /**
   * Gán Action cho Module cụ thể
   * @param module tham chiếu module được gán Action
   */
  onMappingModuleAction(module: Partial<Module>) {
    const modalRef = this._modalService.create({
      nzTitle: 'Gán Action với Module',
      nzContent: MappingModuleActionComponent
    });
  }
}

const mockModules: Partial<Module>[] = [{
  "id": 27,
  "code": "QuanLyPhanQuyen",
  "name": "Quản lý phân quyền",
  "tenantId": 52,
  "description": "",
  "pathUrl": "/pages/sys-config",
  "icon": "list-outline",
  "status": 1,
  "updateTime": "2023-05-20T02:03:17.000+0000",
  "parentId": 0,
  "parentName": null,
  "position": 3,
  "codeAction": null,
  "role": null
}, {
  "id": 28,
  "code": "ADMIN_USER",
  "name": "Người dùng",
  "tenantId": 52,
  "description": "Quản lý người dùng",
  "pathUrl": "/pages/sys-config/users",
  "icon": null,
  "status": 1,
  "updateTime": "2023-05-28T03:39:02.000+0000",
  "parentId": 27,
  "parentName": "Quản lý phân quyền",
  "position": 6,
  "codeAction": null,
  "role": null
}, {
  "id": 29,
  "code": "ADMIN_ROLE",
  "name": "Nhóm quyền",
  "tenantId": 52,
  "description": "Quản lý nhóm quyền",
  "pathUrl": "/pages/sys-config/role-module",
  "icon": null,
  "status": 1,
  "updateTime": "2021-09-17T17:54:44.000+0000",
  "parentId": 27,
  "parentName": "Quản lý phân quyền",
  "position": 5,
  "codeAction": null,
  "role": null
}, {
  "id": 30,
  "code": "ADMIN_MODULE",
  "name": "Module",
  "tenantId": 52,
  "description": "Quản lý module",
  "pathUrl": "/pages/sys-config/modules",
  "icon": null,
  "status": 1,
  "updateTime": "2021-09-17T17:55:55.000+0000",
  "parentId": 27,
  "parentName": "Quản lý phân quyền",
  "position": 10,
  "codeAction": null,
  "role": null
}, {
  "id": 31,
  "code": "ADMIN_ACTION",
  "name": "Action",
  "tenantId": 52,
  "description": "Quản lý action",
  "pathUrl": "/pages/sys-config/actions",
  "icon": null,
  "status": 1,
  "updateTime": "2021-09-17T17:55:43.000+0000",
  "parentId": 27,
  "parentName": "Quản lý phân quyền",
  "position": 9,
  "codeAction": null,
  "role": null
}, {
  "id": 216,
  "code": "MOTHER_PAGE",
  "name": "Trang chủ",
  "tenantId": 52,
  "description": null,
  "pathUrl": "/pages",
  "icon": "home-outline",
  "status": 0,
  "updateTime": "2023-05-28T08:28:52.000+0000",
  "parentId": 0,
  "parentName": null,
  "position": 1,
  "codeAction": null,
  "role": null
}, {
  "id": 328,
  "code": "KhachSan4.0",
  "name": "Khách sạn 4.0",
  "tenantId": 52,
  "description": "Quản lý khách sạn",
  "pathUrl": "/pages/hotel-management",
  "icon": "bulb-outline",
  "status": 1,
  "updateTime": "2023-05-22T16:28:55.000+0000",
  "parentId": 0,
  "parentName": null,
  "position": 10,
  "codeAction": null,
  "role": null
}, {
  "id": 329,
  "code": "HotelConfig",
  "name": "Cấu hình khách sạn",
  "tenantId": 52,
  "description": null,
  "pathUrl": "/pages/hotel-management/hotel-config",
  "icon": null,
  "status": 1,
  "updateTime": "2023-05-22T16:36:58.000+0000",
  "parentId": 328,
  "parentName": "Khách sạn 4.0",
  "position": null,
  "codeAction": null,
  "role": null
}, {
  "id": 330,
  "code": "HotelDashboard",
  "name": "Trang chủ Hotel4.0",
  "tenantId": 52,
  "description": null,
  "pathUrl": "/pages/hotel-management/dashboard",
  "icon": "",
  "status": 1,
  "updateTime": "2023-05-24T13:32:57.000+0000",
  "parentId": 328,
  "parentName": "Khách sạn 4.0",
  "position": null,
  "codeAction": null,
  "role": null
}, {
  "id": 331,
  "code": "WAREHOUSE",
  "name": "Nhà kho khách sạn",
  "tenantId": 52,
  "description": null,
  "pathUrl": "/pages/hotel-management/warehouse",
  "icon": null,
  "status": 1,
  "updateTime": "2023-05-26T14:40:43.000+0000",
  "parentId": 328,
  "parentName": "Khách sạn 4.0",
  "position": null,
  "codeAction": null,
  "role": null
}, {
  "id": 332,
  "code": "ServiceOrderHistory",
  "name": "Lịch sử đặt đồ",
  "tenantId": 52,
  "description": null,
  "pathUrl": "/pages/hotel-management/service-order-history",
  "icon": null,
  "status": 1,
  "updateTime": "2023-06-04T16:33:11.000+0000",
  "parentId": 328,
  "parentName": "Khách sạn 4.0",
  "position": null,
  "codeAction": null,
  "role": null
}, {
  "id": 333,
  "code": "Statistic",
  "name": "Quản lý doanh thu",
  "tenantId": 52,
  "description": null,
  "pathUrl": "/pages/hotel-management/statistic",
  "icon": null,
  "status": 1,
  "updateTime": "2024-03-13T01:14:26.000+0000",
  "parentId": 328,
  "parentName": "Khách sạn 4.0",
  "position": null,
  "codeAction": null,
  "role": null
}, {
  "id": 334,
  "code": "HistoryStatus",
  "name": "Giám sát trạng thái phòng",
  "tenantId": 52,
  "description": null,
  "pathUrl": "/pages/hotel-management/history-status",
  "icon": null,
  "status": 1,
  "updateTime": "2024-03-13T01:15:06.000+0000",
  "parentId": 328,
  "parentName": "Khách sạn 4.0",
  "position": null,
  "codeAction": null,
  "role": null
}, {
  "id": 335,
  "code": "ConfigFtp",
  "name": "Cấu hình Ftp",
  "tenantId": 52,
  "description": null,
  "pathUrl": "/pages/hotel-management/config-ftp",
  "icon": null,
  "status": 1,
  "updateTime": "2024-04-09T15:06:06.000+0000",
  "parentId": 328,
  "parentName": "Khách sạn 4.0",
  "position": null,
  "codeAction": null,
  "role": null
}, {
  "id": 336,
  "code": "AGENT",
  "name": "Quản lý Agent",
  "tenantId": 52,
  "description": null,
  "pathUrl": "/pages/agent-management",
  "icon": "list-outline",
  "status": 1,
  "updateTime": "2024-09-07T15:53:26.000+0000",
  "parentId": 0,
  "parentName": null,
  "position": null,
  "codeAction": null,
  "role": null
}, {
  "id": 337,
  "code": "CustomerManagement",
  "name": "Tài khoản khách hàng",
  "tenantId": 52,
  "description": null,
  "pathUrl": "/pages/agent-management/customer",
  "icon": null,
  "status": 1,
  "updateTime": "2024-09-07T15:47:48.000+0000",
  "parentId": 336,
  "parentName": "Quản lý Agent",
  "position": null,
  "codeAction": null,
  "role": null
}, {
  "id": 338,
  "code": "DeviceManage",
  "name": "Quản lý thiết bị",
  "tenantId": 52,
  "description": null,
  "pathUrl": "/pages/agent-management/device",
  "icon": null,
  "status": 1,
  "updateTime": "2024-09-07T15:48:10.000+0000",
  "parentId": 336,
  "parentName": "Quản lý Agent",
  "position": null,
  "codeAction": null,
  "role": null
}, {
  "id": 339,
  "code": "Agents",
  "name": "Agents",
  "tenantId": 52,
  "description": null,
  "pathUrl": "/pages/agent-management/agent",
  "icon": null,
  "status": 1,
  "updateTime": "2024-09-07T15:48:27.000+0000",
  "parentId": 336,
  "parentName": "Quản lý Agent",
  "position": null,
  "codeAction": null,
  "role": null
}, {
  "id": 340,
  "code": "StatisticCustomer",
  "name": "Thống kê khách hàng",
  "tenantId": 52,
  "description": null,
  "pathUrl": "/pages/agent-management/statistic",
  "icon": null,
  "status": 1,
  "updateTime": "2024-09-07T15:48:46.000+0000",
  "parentId": 336,
  "parentName": "Quản lý Agent",
  "position": null,
  "codeAction": null,
  "role": null
}, {
  "id": 341,
  "code": "MobileDevices",
  "name": "Quản lý thiết bị mobile",
  "tenantId": 52,
  "description": null,
  "pathUrl": "/pages/agent-management/mobile-device",
  "icon": null,
  "status": 1,
  "updateTime": "2024-10-09T15:26:03.000+0000",
  "parentId": 336,
  "parentName": "Quản lý Agent",
  "position": null,
  "codeAction": null,
  "role": null
}]
