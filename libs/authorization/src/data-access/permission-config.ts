export interface ActionPermission {
  insert: string;
  update: string;
  delete: string;
  search: string;
  view: string;
}

export interface ActionAllowed {
  id: number | null;
  codeAction: string;
  nameAciton: string | null;
  nameModel: string | null;
}