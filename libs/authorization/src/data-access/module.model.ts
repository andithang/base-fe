export interface Module {
  id: number;
  code: string;
  name: string;
  tenantId: number;
  description: string | null;
  pathUrl: string;
  icon: string | null;
  status: number;
  updateTime: string;
  parentId: number;
  parentName: string | null;
  position: number | null,
  codeAction: string | null;
  role: string | null;
}
