# BaseFe

## @base-fe/authorization

### Configure API endpoint: SERVER_URL.

For example: http://192.168.0.2/api
=> No "/" at the end!

### Configure getTokenFactory: a function used to retrieve the token provided to call APIs. It is attached to 'Authorization' header when the request is sent

For example:

```ts
function getTokenFactory() {
  return localStorage.getItem("Authorization") || "";
}
```

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

### Define how to get the user's permission. Example:

```ts
const getUserPermission = () => [
  {
    id: 31,
    title: "Action",
    code: "ADMIN_ACTION",
    link: "/pages/sys-config/actions",
    role: [
      {
        id: null,
        codeAction: "INSERT",
        nameAciton: null,
        nameModel: null,
      },
      {
        id: null,
        codeAction: "SEARCH",
        nameAciton: null,
        nameModel: null,
      },
      {
        id: null,
        codeAction: "UPDATE",
        nameAciton: null,
        nameModel: null,
      },
    ],
  },
];
```

### Example full configuration

```ts
BaseAuthorizationModule.forRoot({
  SERVER_URL: "http://103.143.206.116:8084/api",
  getTokenFactory,
  interceptErrorHandler(evt) {
    console.log(evt);
  },
  interceptSuccessHandler(evt) {
    console.log(evt);
  },
  ACTION_CODES_PAGES: DEFAULT_ACTION_CODES,
  getUserPermission: () => ([
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
  ]),
}),
```
