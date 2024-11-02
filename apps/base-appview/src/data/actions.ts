import { UserPermission } from "@base-fe/authorization";

export const dataActions: UserPermission[] = [
  {
    "id": 335,    
    "title": "Cấu hình Ftp",
    "code": "ConfigFtp",
    "link": "/pages/hotel-management/config-ftp",
    "role": [
      {
        "id": null,
        "codeAction": "SEARCH",
        "nameAciton": null,
        "nameModel": null
      }
    ]
  },
  {
    "id": 329,    
    "title": "Cấu hình khách sạn",
    "code": "HotelConfig",
    "link": "/pages/hotel-management/hotel-config",
    "role": [
      {
        "id": null,
        "codeAction": "CONFIG_CALL_FE_BE",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "DELETE",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "EDIT_HOTEL_CONFIG",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "EDIT_MAX_ROOM",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "EDIT_ROOM_TYPE",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "EXPORT_ROOMS_HOTEL",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "INSERT",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "SEARCH",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "UPDATE",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "VIEW",
        "nameAciton": null,
        "nameModel": null
      }
    ]
  },
  {
    "id": 334,    
    "title": "Giám sát trạng thái phòng",
    "code": "HistoryStatus",
    "link": "/pages/hotel-management/history-status",
    "role": [
      {
        "id": null,
        "codeAction": "SEARCH",
        "nameAciton": null,
        "nameModel": null
      }
    ]
  },
  {
    "id": 27,    
    "title": "Quản lý phân quyền",
    "code": "QuanLyPhanQuyen",
    "link": "/pages/sys-config",
    "role": [
      {
        "id": null,
        "codeAction": "",
        "nameAciton": null,
        "nameModel": null
      }
    ]
  },
  {
    "id": 29,    
    "title": "Nhóm quyền",
    "code": "ADMIN_ROLE",
    "link": "/pages/sys-config/role-module",
    "role": [
      {
        "id": null,
        "codeAction": "DELETE",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "INSERT",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "SEARCH",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "UPDATE",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "VIEW",
        "nameAciton": null,
        "nameModel": null
      }
    ]
  },
  {
    "id": 28,    
    "title": "Người dùng",
    "code": "ADMIN_USER",
    "link": "/pages/sys-config/users",
    "role": [
      {
        "id": null,
        "codeAction": "DELETE",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "INSERT",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "SEARCH",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "UPDATE",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "VIEW",
        "nameAciton": null,
        "nameModel": null
      }
    ]
  },
  {
    "id": 31,    
    "title": "Action",
    "code": "ADMIN_ACTION",
    "link": "/pages/sys-config/actions",
    "role": [
      {
        "id": null,
        "codeAction": "INSERT",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "SEARCH",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "UPDATE",
        "nameAciton": null,
        "nameModel": null
      }
    ]
  },
  {
    "id": 328,
    "title": "Khách sạn 4.0",
    "code": "KhachSan4.0",
    "link": "/pages/hotel-management",
    "role": [
      {
        "id": null,
        "codeAction": "",
        "nameAciton": null,
        "nameModel": null
      }
    ]
  },
  {
    "id": 30,    
    "title": "Module",
    "code": "ADMIN_MODULE",
    "link": "/pages/sys-config/modules",
    "role": [
      {
        "id": null,
        "codeAction": "DELETE",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "INSERT",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "SEARCH",
        "nameAciton": null,
        "nameModel": null
      },
      {
        "id": null,
        "codeAction": "UPDATE",
        "nameAciton": null,
        "nameModel": null
      }
    ]
  }
]