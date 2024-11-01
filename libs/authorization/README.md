# BaseFe

## @base-fe/authorization
### Configure API endpoint: SERVER_URL. 
For example: http://192.168.0.2/api
=> No "/" at the end!
### Configure getTokenFactory: a function used to retrieve the token provided to call APIs. It is attached to 'Authorization' header when the request is sent
For example: 
```ts
function getTokenFactory() {
  return localStorage.getItem('Authorization') || '';
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
### Example full configuration
```ts
BaseAuthorizationModule.forRoot({
  SERVER_URL: "http://192.168.0.2/api",
  getTokenFactory,
  interceptErrorHandler(evt) {
    console.log(evt);
  },
  interceptSuccessHandler(evt) {
    console.log(evt);
  },
}),
```