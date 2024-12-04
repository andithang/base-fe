import { Injectable } from '@angular/core';
import { UserPermission, UserPermissionService } from '@base-fe/authorization';

@Injectable({providedIn: 'root'})
export class AppUserPermissionService extends UserPermissionService {

  override getUserPermission(): UserPermission[] {
    return [
      {
        "id": 29,
        "parenId": 27,
        "title": "Nhóm quyền",
        "code": "ADMIN_ROLE",
        "icon": "audit",
        "link": "/default/admin/authorization/permissions",
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
            "codeAction": "MAP_PERMISSION_MODULE",
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
        "id": 30,
        "parenId": 27,
        "title": "Module",
        "code": "ADMIN_MODULE",
        "icon": "appstore",
        "link": "/default/admin/authorization/modules",
        "role": [
          {
            "id": null,
            "codeAction": "",
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
            "codeAction": "INSERT",
            "nameAciton": null,
            "nameModel": null
          },
          {
            "id": null,
            "codeAction": "MAP_ACTION_MODULE",
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
        "id": 31,
        "title": "Action",
        "code": "ADMIN_ACTION",
        "link": "/default/admin/authorization/actions",
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
          },
          {
            "id": null,
            "codeAction": "DELETE",
            "nameAciton": null,
            "nameModel": null
          }
        ],
        parenId: 0,
        icon: ''
      }
    ]
  }
  
}