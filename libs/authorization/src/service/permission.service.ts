import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { AccessTokenInjection, ServerUrlInjection } from '../data-access/module-config';
import { createRequestOption } from './request-util';
import { SearchWithPagination } from '../data-access/page-size';
import { Permission, PermissionForm, PermissionQuery } from '../data-access/permission.model';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  constructor(
    private http: HttpClient,
    @Inject(AccessTokenInjection) private accessToken: string,
    @Inject(ServerUrlInjection) private serverUrl: string,
  ) {
    console.log(accessToken)
  }

  doSearch(data: PermissionQuery, req: SearchWithPagination) {
    const options = createRequestOption(req);
    return this.http.post<Permission[]>(`${this.serverUrl}/roles/doSearch`, data, {
      params: options,
      observe: 'response',
    });
  }

  public update(data: PermissionForm): Observable<HttpResponse<Permission>> {
    return this.http.post<Permission>(`${this.serverUrl}/roles/update`, data, {
      observe: 'response'
    });
  }

  public insert(data: PermissionForm): Observable<HttpResponse<Permission>> {
    return this.http.post<Permission>(`${this.serverUrl}/roles/insert`, data, {
      observe: 'response'
    });
  }

  public delete(data: PermissionQuery): Observable<HttpResponse<Permission>> {
    return this.http.post<Permission>(`${this.serverUrl}/roles/delete`, data, {
      observe: 'response'
    });
  }

  public getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.serverUrl}/roles/getAllRoles`, {
      observe: 'body'
    });
  }
}
