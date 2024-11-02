interface BasePermission {
  insert: string;
  update: string;
  delete: string;
  search: string;
  view: string;
}

export type ActionPermission = BasePermission;

export interface ActionAllowed {
  id: number | null;
  codeAction: string;
  nameAciton: string | null;
  nameModel: string | null;
}

export interface ModulePermission extends BasePermission {
  mapModuleAction: string;
}