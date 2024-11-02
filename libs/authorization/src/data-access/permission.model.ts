
import { Nullable } from "./shared-types";

export interface PermissionBase {
  id: number;
  name: string;
  code: string;
  description: string;
  status: number;
}

export interface Permission extends PermissionBase {
  updateTime: string;
  tenantId: number;
}

export type PermissionForm = PermissionBase;

export type PermissionQuery = Nullable<Permission>;

export interface PermissionsQueryByModuleId {
  id: number;
}

export interface PermissionMapper {
  roleModuleId: number,
  roleId: number,
  moduleCode: string,
  actionCode: string,
  value: string,
  text: string,
  id: number,
  parentId: number,
  checked: boolean,
  list: string
}

export interface PermissionMapperRequest {
  roleId: number,
  list: {
    roleId: number,
    moduleCode: string,
    actionCode: string
  }[]
}
