import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { ServerUrlInjection } from '../data-access/module-config';
import { createRequestOption } from './request-util';
import { SearchWithPagination } from '../data-access/page-size';
import { ModuleQuery, ModuleForm, Module, ParentModule, ModuleAction } from '../data-access/module.model';

@Injectable({ providedIn: 'root' })
export class ModuleService {
  constructor(
    private http: HttpClient,
    @Inject(ServerUrlInjection) private serverUrl: string,
  ) {
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

  public getParent() {
    return this.http.post<ParentModule[]>(`${this.serverUrl}/module/getParent`, {}, {
      observe: 'response'
    });
  }

  public getTreeParent() {
    return this.http.post<Module[]>(`${this.serverUrl}/module/getTreeParent`, {}, {
      observe: 'response'
    });
  }

  public getAllModule() {
    return this.http.get<Module[]>(`${this.serverUrl}/module/getAllModule`, {
      observe: 'response'
    });
  }

  public getAllMappingModuleAction(moduleId: number) {
    return this.http.get<ModuleAction[]>(`${this.serverUrl}/moduleAction/getAllByModuleId`, {
      params: { id: moduleId },
      observe: 'response'
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public deleteMappingModuleAction(body?: any): Observable<any> {
    return this.http.post(`${this.serverUrl}/moduleAction/delete`, body, {
      observe: 'response'
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public inssertMappingModuleAction(body?: any): Observable<any> {
    return this.http.put(`${this.serverUrl}/moduleAction/insert`, body, {
      observe: 'response'
    })
  }
}
