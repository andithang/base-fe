import { Injectable } from '@angular/core';
import { UserPermission, UserPermissionService } from '@base-fe/authorization';

@Injectable({providedIn: 'root'})
export class AppUserPermissionService extends UserPermissionService {

  override getUserPermission(): UserPermission[] {
    return [
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
        ],
        parenId: 0,
        icon: ''
      }
    ]
  }
  
}