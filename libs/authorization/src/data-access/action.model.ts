import { Nullable } from "./shared-types";

export interface ActionBase {
    code: string;
    description: string;
    id: number;
    name: string;
    status: number;
}

export interface Action extends ActionBase {
    tenantId: number;
    updateTime: string;
}

export type ActionForm = ActionBase;

export type ActionQuery = Nullable<Action>;

export interface ActionsQueryByModuleId {
    id: number;
}