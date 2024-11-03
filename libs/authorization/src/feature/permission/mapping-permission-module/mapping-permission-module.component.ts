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
  value: string;
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
  value: string;
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
  listPermissionMappers: PermissionMapper[] = [];
  loading = true;
  listCheckedPermissionMapper: PermissionMapper[] = [];

  flatNodeMap = new Map<FlatNode, TreeNode>();
  nestedNodeMap = new Map<TreeNode, FlatNode>();
  permissionNodeMap = new Map<string, FlatNode>();
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
              checked: node.checked,
              value: node.value
            };
      this.flatNodeMap.set(flatNode, node);
      this.nestedNodeMap.set(node, flatNode);
      this.permissionNodeMap.set(node.value, flatNode);
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
        this.listPermissionMappers = res;
        this.listCheckedPermissionMapper = res.filter(item => item.checked);

        this.TREE_DATA =  this.formatDataModule(this.listPermissionMappers, 0);
        this.dataSource.setData(this.TREE_DATA);
        this.originData$.next(this.TREE_DATA);
        this.setupSelectedMenuTree();
      }, () => {
        this.TREE_DATA =  [];
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
        checked: !!splitPerissions[0] && !!splitPerissions[1],
        value: data[i].value
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

    /**
   * fill data menu of permission to menu treeview
   */
    setupSelectedMenuTree(){
      // get leaf child of each item
      const leafChildrenSelected: Partial<TreeNode>[] = [];
      this.listCheckedPermissionMapper?.forEach(item => {
        leafChildrenSelected.push(...this.getLeafChildren(item));
      });
      // get corresponding node and force check
      leafChildrenSelected.forEach(leaf => {
        const node = this.permissionNodeMap.get(leaf.value ? leaf.value : '');
        if(node){
          this.leafItemSelectionToggle(node);
        }
      })
    }

    /**
     * get leaf child menu
     */
    getLeafChildren(resource: Partial<TreeNode>): Partial<TreeNode>[]{
      if((resource.children && resource.children.length == 0) || !resource.children){
        return [resource];
      }
      else {
        const output: Partial<TreeNode>[] = [];
        resource.children.forEach(child => {
          output.push(...this.getLeafChildren(child))
        })
        return output;
      }
    }
}
