export interface Module {
  id: number;
  code: string;
  name: string;
  tenantId: number | null;
  description: string | null;
  pathUrl: string | null;
  icon: string | null;
  status: number;
  updateTime: string | null;
  parentId: number | null;
  parentName?: string | null;
  position: number | null,
  codeAction?: string | null;
  role?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
}

export interface ParentModule {
  parentId: number | null,
  parentName: string,
  tenantId: number | null
}

export interface ModuleAction {
  id: number;
  actionId: number;
  moduleId: number;
  updateTime: string;
}

import { Nullable } from "./shared-types";

export interface ModuleBase {
  id: number;
  name: string;
  code: string;
  description: string;
  status: number;
  pathUrl: string;
  icon: string | null;
  position: number | null;
  parentId: number;
}

export type ModuleForm = ModuleBase;

export type ModuleQuery = Nullable<Module>;
