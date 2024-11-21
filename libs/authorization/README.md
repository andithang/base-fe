# BaseFe

## @base-fe/authorization

### Configure API endpoint: SERVER_URL.

For example: http://192.168.0.2/api
=> No "/" at the end!

### Configure interceptors' callback: 2 callbacks you can use to hanlde the requests in interceptors. One when success, one when failure

```ts
interceptErrorHandler(evt) {
  console.log(evt);
},
interceptSuccessHandler(evt) {
  console.log(evt);
},
```

### Configure action's codes for 3 pages: actionPage, modulePage, permissionPage. Below is the default value

```ts
const DEFAULT_ACTION_CODES: ActionCodesConfig = {
  actionPage: {
    insert: "INSERT",
    update: "UPDATE",
    delete: "DELETE",
    search: "SEARCH",
    view: "VIEW",
  },
};
```

### Define how to get the user's permission by extending the UserPermissionService class. Example:

```ts
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
        ]
      }
    ]
  }
  
}
```

### Use the same way to configure a provider for AccessTokenInjection

```ts
import { Injectable } from '@angular/core';
import { TokenProviderService } from '@base-fe/authorization';

@Injectable({providedIn: 'root'})
export class AppTokenProviderService extends TokenProviderService {

  override getToken(): string {
    return localStorage.getItem('Authorization') || '';
  }
   
}
```

### Then use the class as the provider for UserPermissionInjection token in the app.module.ts
```ts
providers: [
    { provide: AccessTokenInjection, useClass: AppTokenProviderService },
    { provide: UserPermissionInjection, useClass: AppTokenProviderService },
  ],
```

### Example full configuration

```ts
BaseAuthorizationModule.forRoot({
  SERVER_URL: "https://example.com/api",
  interceptErrorHandler(evt) {
    console.log(evt);
  },
  interceptSuccessHandler(evt) {
    console.log(evt);
  },
  ACTION_CODES_PAGES: DEFAULT_ACTION_CODES
}),
```
