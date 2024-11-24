import { ActionCodesConfig } from "./module-config";

/**
 * Format Thời gian toàn hệ thống
 */
export const APP_DATE_FORMAT = 'DD/MM/YYYY hh:mm:ss';

/**
 * Định nghĩ tiêu đề menu toàn bộ ứng dụng tại đây
 */
export const APP_MENU_TITLE = {
  MODULE: 'Quản lý Module'
}

/**
 * Format Thời gian toàn hệ thống
 */
export const NULL_SYMBOL = '-';

export const HEADER_TOTAL = 'X-Total-Count';

export const DEFAULT_ACTION_CODES: ActionCodesConfig = {
  actionPage: {
    insert: 'INSERT',
    update: 'UPDATE',
    delete: 'DELETE',
    search: 'SEARCH',
    view: 'VIEW'
  },
  modulePage: {
    insert: 'INSERT',
    update: 'UPDATE',
    delete: 'DELETE',
    search: 'SEARCH',
    view: 'VIEW',
    mapModuleAction: 'MAP_ACTION_MODULE'
  },
  permissionPage: {
    insert: 'INSERT',
    update: 'UPDATE',
    delete: 'DELETE',
    search: 'SEARCH',
    view: 'VIEW',
    mapPermissionModule: "MAP_PERMISSION_MODULE"
  }
}

export const MODAL_SIZES = {
  xlarge: 1400,
  large: 1000,
  medium: 700,
  small: 520
};
