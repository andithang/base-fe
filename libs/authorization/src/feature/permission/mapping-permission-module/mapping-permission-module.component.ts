import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PermissionService } from '../../../service/permission.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Permission, PermissionMapper, PermissionMapperRequest } from '../../../data-access/permission.model';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { NzInputModule } from 'ng-zorro-antd/input';
import { auditTime, BehaviorSubject, combineLatest, map } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzHighlightModule } from 'ng-zorro-antd/core/highlight';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { SelectionModel } from '@angular/cdk/collections';

interface TreeNode {
  name: string;
  disabled?: boolean;
  roleId: number|undefined,
  moduleCode: string|null,
  actionCode: string|null,
  children?: TreeNode[];
  checked: boolean;
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  disabled?: boolean;
  roleId: number|undefined,
  moduleCode: string|null,
  actionCode: string|null,
  checked: boolean;
}

class FilteredTreeResult {
  constructor(public treeData: TreeNode[], public needsToExpanded: TreeNode[] = []) {}
}

function filterTreeData(data: TreeNode[], value: string): FilteredTreeResult {
  const needsToExpanded = new Set<TreeNode>();
  const _filter = (node: TreeNode, result: TreeNode[]): TreeNode[] => {
    if (node.name.search(value) !== -1) {
      result.push(node);
      return result;
    }
    if (Array.isArray(node.children)) {
      const nodes = node.children.reduce((a, b) => _filter(b, a), [] as TreeNode[]);
      if (nodes.length) {
        const parentNode = { ...node, children: nodes };
        needsToExpanded.add(parentNode);
        result.push(parentNode);
      }
    }
    return result;
  };
  const treeData = data.reduce((a, b) => _filter(b, a), [] as TreeNode[]);
  return new FilteredTreeResult(treeData, [...needsToExpanded]);
}

@Component({
  selector: 'base-fe-mapping-permission-module',
  templateUrl: './mapping-permission-module.component.html',
  styleUrls: ['./mapping-permission-module.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzTableModule,
    NzSwitchModule,
    FormsModule,
    NzTreeViewModule,
    NzInputModule,
    NzHighlightModule,
    TranslateModule,
    NzCardModule,
    NzGridModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzFormModule,
    NzEmptyModule,
    NzNotificationModule,
    NzModalModule,
    NgxTrimDirectiveModule
  ]
})
export class MappingPermissionModuleComponent implements OnInit {
  constructor(
    private ref: NzModalRef<MappingPermissionModuleComponent>,
    private translate: TranslateService,
    private notify: NzNotificationService,
    private permissionService: PermissionService
  ) {}

  permission: Partial<Permission> = {};
  listPermissionMappers: PermissionMapper[] = []
  loading = true;

  flatNodeMap = new Map<FlatNode, TreeNode>();
  nestedNodeMap = new Map<TreeNode, FlatNode>();
  expandedNodes: TreeNode[] = [];
  searchValue = '';

  // eslint-disable-next-line @typescript-eslint/member-ordering
  TREE_DATA: TreeNode[] = [];
  listFiltered: TreeNode[] = []

  checklistSelection = new SelectionModel<FlatNode>(true);
  treeControl = new FlatTreeControl<FlatNode, TreeNode>(
    node => node.level,
    node => node.expandable,
    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      trackBy: flatNode => this.flatNodeMap.get(flatNode)!
    }
  );

  treeFlattener = new NzTreeFlattener<TreeNode, FlatNode, TreeNode>(
    (node: TreeNode, level: number): FlatNode => {
      const existingNode = this.nestedNodeMap.get(node);
      const flatNode =
        existingNode && existingNode.name === node.name
          ? existingNode
          : {
              expandable: !!node.children && node.children.length > 0,
              name: node.name,
              level,
              disabled: node.disabled,
              roleId: node.roleId,
              moduleCode: node.moduleCode,
              actionCode: node.actionCode,
              checked: node.checked
            };
      this.flatNodeMap.set(flatNode, node);
      this.nestedNodeMap.set(node, flatNode);
      return flatNode;
    },
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  // eslint-disable-next-line @typescript-eslint/member-ordering
  originData$ = new BehaviorSubject<TreeNode[]>([]);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  searchValue$ = new BehaviorSubject<string>('');
  // eslint-disable-next-line @typescript-eslint/member-ordering
  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  filteredData$ = combineLatest([
    this.originData$,
    this.searchValue$.pipe(
      auditTime(500),
      map(value => (this.searchValue = value))
    )
  ]).pipe(map(([data, value]) => (value ? filterTreeData(data, value) : new FilteredTreeResult(data))));

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  descendantsAllSelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
  }

  descendantsPartiallySelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  leafItemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  itemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: FlatNode): void {
    let parent: FlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: FlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: FlatNode): FlatNode | null {
    const currentLevel = node.level;

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }


  ngOnInit() {
    this.getPermissionConfig();

    this.filteredData$.subscribe(result => {
      this.dataSource.setData(result.treeData);
      this.listFiltered = result.treeData;
      const hasSearchValue = !!this.searchValue;
      if (hasSearchValue) {
        if (this.expandedNodes.length === 0) {
          this.expandedNodes = this.treeControl.expansionModel.selected;
          this.treeControl.expansionModel.clear();
        }
        this.treeControl.expansionModel.select(...result.needsToExpanded);
      } else {
        if (this.expandedNodes.length) {
          this.treeControl.expansionModel.clear();
          this.treeControl.expansionModel.select(...this.expandedNodes);
          this.expandedNodes = [];
        }
      }
    });
  }

  getPermissionConfig() {
    if (this.permission) {
      this.permissionService.getTreeByPermisionId(this.permission).subscribe(res => {
        console.log(res);
        this.listPermissionMappers = mockData as [];
        this.TREE_DATA =  this.formatDataModule(this.listPermissionMappers, 0);
        this.dataSource.setData(this.TREE_DATA);
        this.originData$.next(this.TREE_DATA);
      }, () => {
        this.listPermissionMappers = mockData as [];
        this.TREE_DATA =  this.formatDataModule(this.listPermissionMappers, 0);
        this.dataSource.setData(this.TREE_DATA);
        this.originData$.next(this.TREE_DATA);
      } )
    }
  }

  formatDataModule(data: PermissionMapper[], parentId: number) {
    const arr: TreeNode[]= [];
    for (let i = 0; i < data.length; i++) {
      const dataItem = data[i];
      const splitPerissions = data[i].value.split('#');
      const dataNode: TreeNode = {
        name: data[i].text,
        roleId: this.permission.id,
        moduleCode: splitPerissions[0],
        actionCode: splitPerissions[1],
        checked: !!splitPerissions[0] && !!splitPerissions[1]
      }
      if (dataItem.parentId === parentId) {
        let children: TreeNode[] = [];
        if (dataItem.id) {
          children = this.formatDataModule(data, dataItem.id);
        }
        if (children.length > 0) {
          dataNode.children = children;
        } else {
          dataNode.children = [];
        }
        arr.push(dataNode);
      }
    }
    return arr;
  }

  cancel() {
    this.ref.close();
  }

  submit() {
    console.log(this.checklistSelection.selected);
    this.loading = true;
    const data: PermissionMapperRequest = {
      roleId: this.permission.id as number,
      list: []
    };
    this.checklistSelection.selected.map(value => {
      data.list.push({
        roleId: this.permission.id as number,
        moduleCode: value.moduleCode as string,
        actionCode: value.actionCode as string
      });
    })
    this.permissionService.updatePermissionMapper(data).subscribe(() => {
      this.ref.close(true);
      this.notify.success(this.translate.instant('base-fe.common.message.notify'), this.translate.instant('base-fe.permissions.message.mapping-success'));
    }, () => {
      this.loading = false;
      this.notify.error(this.translate.instant('base-fe.common.message.notify'), this.translate.instant('base-fe.permissions.message.mapping-fail'));
    })
  }
}

const mockData = [
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_ACTION",
    "text": "Action",
    "id": 31,
    "parentId": 27,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "Agents",
    "text": "Agents",
    "id": 339,
    "parentId": 336,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelDashboard#TURNON_LIGHT",
    "text": "Bật điện",
    "id": null,
    "parentId": 330,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelConfig#CONFIG_CALL_FE_BE",
    "text": "Cấu hình call API từ client hay Web server",
    "id": null,
    "parentId": 329,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ConfigFtp",
    "text": "Cấu hình Ftp",
    "id": 335,
    "parentId": 328,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelConfig",
    "text": "Cấu hình khách sạn",
    "id": 329,
    "parentId": 328,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelDashboard#READONLY_ROOM_API",
    "text": "Chỉ xem API trong phòng (đèn, dọn phòng)",
    "id": null,
    "parentId": 330,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelConfig#READONLY_CONFIG_FE_BE",
    "text": "Chỉ xem cấu hình gọi từ client hay web server",
    "id": null,
    "parentId": 329,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelConfig#READONLY_HOTEL_CONFIG",
    "text": "Chỉ xem cấu hình ks (Bỏ chọn khi có 'Sửa cấu hình ks') - Require 'Sửa' hoặc 'Xem chi tiết'",
    "id": null,
    "parentId": 329,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelConfig#VIEW_ROOM_TYPE",
    "text": "Chỉ xem loại phòng (Bỏ chọn khi đã có 'Sửa loại phòng') - Require 'Sửa' hoặc 'Xem chi tiết'",
    "id": null,
    "parentId": 329,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelConfig#READONLY_MAX_ROOM",
    "text": "Chỉ xem số lượng phòng(Không chọn cùng 'Sửa số lượng phòng')",
    "id": null,
    "parentId": 329,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelDashboard#MOVE_TO_OTHER",
    "text": "Chuyển phòng",
    "id": null,
    "parentId": 330,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelDashboard#CLEAN_ROOM",
    "text": "Dọn phòng",
    "id": null,
    "parentId": 330,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "StatisticCustomer#EXPORT",
    "text": "EXPORT",
    "id": null,
    "parentId": 340,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HistoryStatus",
    "text": "Giám sát trạng thái phòng",
    "id": 334,
    "parentId": 328,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelDashboard#CANCEL_ROOM",
    "text": "Hủy phòng",
    "id": null,
    "parentId": 330,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "KhachSan4.0",
    "text": "Khách sạn 4.0",
    "id": 328,
    "parentId": 0,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ServiceOrderHistory",
    "text": "Lịch sử đặt đồ",
    "id": 332,
    "parentId": 328,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_MODULE",
    "text": "Module",
    "id": 30,
    "parentId": 27,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_USER",
    "text": "Người dùng",
    "id": 28,
    "parentId": 27,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "WAREHOUSE",
    "text": "Nhà kho khách sạn",
    "id": 331,
    "parentId": 328,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_ROLE",
    "text": "Nhóm quyền",
    "id": 29,
    "parentId": 27,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "AGENT",
    "text": "Quản lý Agent",
    "id": 336,
    "parentId": 0,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "Statistic",
    "text": "Quản lý doanh thu",
    "id": 333,
    "parentId": 328,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "QuanLyPhanQuyen",
    "text": "Quản lý phân quyền",
    "id": 27,
    "parentId": 0,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "DeviceManage",
    "text": "Quản lý thiết bị",
    "id": 338,
    "parentId": 336,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "MobileDevices",
    "text": "Quản lý thiết bị mobile",
    "id": 341,
    "parentId": 336,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_MODULE#UPDATE",
    "text": "Sửa",
    "id": null,
    "parentId": 30,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "WAREHOUSE#UPDATE",
    "text": "Sửa",
    "id": null,
    "parentId": 331,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_ACTION#UPDATE",
    "text": "Sửa",
    "id": null,
    "parentId": 31,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "DeviceManage#UPDATE",
    "text": "Sửa",
    "id": null,
    "parentId": 338,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelConfig#UPDATE",
    "text": "Sửa",
    "id": null,
    "parentId": 329,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_ROLE#UPDATE",
    "text": "Sửa",
    "id": null,
    "parentId": 29,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "CustomerManagement#UPDATE",
    "text": "Sửa",
    "id": null,
    "parentId": 337,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "MobileDevices#UPDATE",
    "text": "Sửa",
    "id": null,
    "parentId": 341,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "Agents#UPDATE",
    "text": "Sửa",
    "id": null,
    "parentId": 339,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_USER#UPDATE",
    "text": "Sửa",
    "id": null,
    "parentId": 28,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelConfig#EDIT_HOTEL_CONFIG",
    "text": "Sửa cấu hình khách sạn (Bỏ chọn khi có 'Chỉ xem cấu hình ks') - Require 'Sửa'",
    "id": null,
    "parentId": 329,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelDashboard#EDIT_ROOM_API",
    "text": "Sửa được room API (đèn, dọn phòng)",
    "id": null,
    "parentId": 330,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelDashboard#EDIT_CHECKIN_TYPE",
    "text": "Sửa loại checkin theo giờ (hay ngày) - default theo giờ",
    "id": null,
    "parentId": 330,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "WAREHOUSE#EDIT_WAREHOUSE",
    "text": "Sửa loại hàng hóa",
    "id": null,
    "parentId": 331,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelDashboard#EDIT_ROOM",
    "text": "sửa phòng",
    "id": null,
    "parentId": 330,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelConfig#EDIT_MAX_ROOM",
    "text": "Sửa số lượng phòng (Không chọn cùng 'Chỉ xem số lượng phòng')",
    "id": null,
    "parentId": 329,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelDashboard#EDIT_ORDER",
    "text": "Sửa và thanh toán cho khách đang checkin",
    "id": null,
    "parentId": 330,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "CustomerManagement",
    "text": "Tài khoản khách hàng",
    "id": 337,
    "parentId": 336,
    "checked": null,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelDashboard#TURNOFF_LIGHT",
    "text": "Tắt điện",
    "id": null,
    "parentId": 330,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelDashboard#INSERT",
    "text": "Thêm mới",
    "id": null,
    "parentId": 330,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_USER#INSERT",
    "text": "Thêm mới",
    "id": null,
    "parentId": 28,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "MobileDevices#INSERT",
    "text": "Thêm mới",
    "id": null,
    "parentId": 341,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_MODULE#INSERT",
    "text": "Thêm mới",
    "id": null,
    "parentId": 30,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_ACTION#INSERT",
    "text": "Thêm mới",
    "id": null,
    "parentId": 31,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "Agents#INSERT",
    "text": "Thêm mới",
    "id": null,
    "parentId": 339,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "DeviceManage#INSERT",
    "text": "Thêm mới",
    "id": null,
    "parentId": 338,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_ROLE#INSERT",
    "text": "Thêm mới",
    "id": null,
    "parentId": 29,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "CustomerManagement#INSERT",
    "text": "Thêm mới",
    "id": null,
    "parentId": 337,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "WAREHOUSE#INSERT",
    "text": "Thêm mới",
    "id": null,
    "parentId": 331,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelConfig#INSERT",
    "text": "Thêm mới",
    "id": null,
    "parentId": 329,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "WAREHOUSE#ADD_WAREHOUSE",
    "text": "Thêm mới loại hàng vào kho",
    "id": null,
    "parentId": 331,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "StatisticCustomer",
    "text": "Thống kê khách hàng",
    "id": 340,
    "parentId": 336,
    "checked": null,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ConfigFtp#SEARCH",
    "text": "Tìm kiếm",
    "id": null,
    "parentId": 335,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "MobileDevices#SEARCH",
    "text": "Tìm kiếm",
    "id": null,
    "parentId": 341,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "Agents#SEARCH",
    "text": "Tìm kiếm",
    "id": null,
    "parentId": 339,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelDashboard#SEARCH",
    "text": "Tìm kiếm",
    "id": null,
    "parentId": 330,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ServiceOrderHistory#SEARCH",
    "text": "Tìm kiếm",
    "id": null,
    "parentId": 332,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_USER#SEARCH",
    "text": "Tìm kiếm",
    "id": null,
    "parentId": 28,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "StatisticCustomer#SEARCH",
    "text": "Tìm kiếm",
    "id": null,
    "parentId": 340,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_MODULE#SEARCH",
    "text": "Tìm kiếm",
    "id": null,
    "parentId": 30,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "WAREHOUSE#SEARCH",
    "text": "Tìm kiếm",
    "id": null,
    "parentId": 331,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_ACTION#SEARCH",
    "text": "Tìm kiếm",
    "id": null,
    "parentId": 31,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "DeviceManage#SEARCH",
    "text": "Tìm kiếm",
    "id": null,
    "parentId": 338,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HistoryStatus#SEARCH",
    "text": "Tìm kiếm",
    "id": null,
    "parentId": 334,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelConfig#SEARCH",
    "text": "Tìm kiếm",
    "id": null,
    "parentId": 329,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_ROLE#SEARCH",
    "text": "Tìm kiếm",
    "id": null,
    "parentId": 29,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "CustomerManagement#SEARCH",
    "text": "Tìm kiếm",
    "id": null,
    "parentId": 337,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "MOTHER_PAGE",
    "text": "Trang chủ",
    "id": 216,
    "parentId": 0,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelDashboard",
    "text": "Trang chủ Hotel4.0",
    "id": 330,
    "parentId": 328,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelDashboard#VIEW_ORDER",
    "text": "Xem checkin hiện tại của phòng",
    "id": null,
    "parentId": 330,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "DeviceManage#VIEW",
    "text": "Xem chi tiết",
    "id": null,
    "parentId": 338,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_ROLE#VIEW",
    "text": "Xem chi tiết",
    "id": null,
    "parentId": 29,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "CustomerManagement#VIEW",
    "text": "Xem chi tiết",
    "id": null,
    "parentId": 337,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "Agents#VIEW",
    "text": "Xem chi tiết",
    "id": null,
    "parentId": 339,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_USER#VIEW",
    "text": "Xem chi tiết",
    "id": null,
    "parentId": 28,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "WAREHOUSE#VIEW",
    "text": "Xem chi tiết",
    "id": null,
    "parentId": 331,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelConfig#VIEW",
    "text": "Xem chi tiết",
    "id": null,
    "parentId": 329,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelDashboard#VIEW_ROOM",
    "text": "Xem Phòng",
    "id": null,
    "parentId": 330,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelConfig#EDIT_ROOM_TYPE",
    "text": "Xem,sửa, xóa loại phòng (Bỏ chọn khi có 'Chỉ xem loại phòng') - Require 'Sửa'",
    "id": null,
    "parentId": 329,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "Agents#DELETE",
    "text": "Xóa",
    "id": null,
    "parentId": 339,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_USER#DELETE",
    "text": "Xóa",
    "id": null,
    "parentId": 28,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "WAREHOUSE#DELETE",
    "text": "Xóa",
    "id": null,
    "parentId": 331,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "DeviceManage#DELETE",
    "text": "Xóa",
    "id": null,
    "parentId": 338,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelConfig#DELETE",
    "text": "Xóa",
    "id": null,
    "parentId": 329,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_ROLE#DELETE",
    "text": "Xóa",
    "id": null,
    "parentId": 29,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelDashboard#DELETE",
    "text": "Xóa",
    "id": null,
    "parentId": 330,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "CustomerManagement#DELETE",
    "text": "Xóa",
    "id": null,
    "parentId": 337,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "MobileDevices#DELETE",
    "text": "Xóa",
    "id": null,
    "parentId": 341,
    "checked": false,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "ADMIN_MODULE#DELETE",
    "text": "Xóa",
    "id": null,
    "parentId": 30,
    "checked": true,
    "list": null
  },
  {
    "roleModuleId": null,
    "roleId": null,
    "moduleCode": null,
    "actionCode": null,
    "value": "HotelConfig#EXPORT_ROOMS_HOTEL",
    "text": "Xuất danh sách phòng trong khách sạn",
    "id": null,
    "parentId": 329,
    "checked": false,
    "list": null
  }
]
