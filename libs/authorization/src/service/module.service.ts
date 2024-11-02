import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { AccessTokenInjection, ServerUrlInjection } from '../data-access/module-config';
import { createRequestOption } from './request-util';
import { SearchWithPagination } from '../data-access/page-size';
import { ModuleQuery, ModuleForm, Module } from '../data-access/module.model';

@Injectable({ providedIn: 'root' })
export class ModuleService {
  constructor(
    private http: HttpClient,
    @Inject(AccessTokenInjection) private accessToken: string,
    @Inject(ServerUrlInjection) private serverUrl: string,
  ) {
    console.log(accessToken)
  }

  doSearch(data: ModuleQuery, req: SearchWithPagination) {
    const options = createRequestOption(req);
    return this.http.post<Module[]>(`${this.serverUrl}/module/doSearch`, data, {
      params: options,
      observe: 'response',
    });
  }

  public update(data: ModuleForm): Observable<HttpResponse<Module>> {
    return this.http.post<Module>(`${this.serverUrl}/module/update`, data, {
      observe: 'response'
    });
  }

  public insert(data: ModuleForm): Observable<HttpResponse<Module>> {
    return this.http.post<Module>(`${this.serverUrl}/module/insert`, data, {
      observe: 'response'
    });
  }

  public delete(data: ModuleQuery): Observable<HttpResponse<Module>> {
    return this.http.post<Module>(`${this.serverUrl}/module/delete`, data, {
      observe: 'response'
    });
  }
}
