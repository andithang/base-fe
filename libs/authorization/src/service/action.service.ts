import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import { ModuleConfig, ModuleInjectionToken } from '../data-access/module-config';
import { createRequestOption } from './request-util';
import { Action, ActionForm, ActionQuery, ActionsQueryByModuleId } from '../data-access/action.model';
import { SearchWithPagination } from '../data-access/page-size';

@Injectable({ providedIn: 'root' })
export class ActionService {
  constructor(private http: HttpClient, @Inject(ModuleInjectionToken) private config: ModuleConfig) {
  }

  doSearch(data: ActionQuery, req: SearchWithPagination) {
    const options = createRequestOption(req);
    return this.http.post<Action[]>(`${this.config.SERVER_URL}/action/doSearch`, data, {
      params: options,
      observe: 'response'
    });
  }

  public update(data: ActionForm): Observable<HttpResponse<Action>> {
    return this.http.post<Action>(`${this.config.SERVER_URL}/action/update`, data, {
      observe: 'response'
    });
  }

  public insert(data: ActionForm): Observable<HttpResponse<Action>> {
    return this.http.post<Action>(`${this.config.SERVER_URL}/action/insert`, data, {
      observe: 'response'
    });
  }

  public delete(data: ActionQuery): Observable<HttpResponse<Action>> {
    return this.http.post<Action>(`${this.config.SERVER_URL}/action/delete`, data, {
      observe: 'response'
    });
  }

  public getAllAction(): Observable<Action[]> {
    return this.http.get<Action[]>(`${this.config.SERVER_URL}/sys-actions-getAll`, {
      observe: 'body'
    });
  }

  public getActionTableMap(data: ActionsQueryByModuleId): Observable<Action[]> {
    return this.http.post<Action[]>(`${this.config.SERVER_URL}/sys-actions/getAll`, data, {
      observe: 'body'
    });
  }
}
