import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UsageLoggerService {
  constructor(private http: HttpClient) {}

  readonly loggerAPI = 'https://3h04ee9v4e.execute-api.us-east-1.amazonaws.com/dev';
  readonly apiKey = 'vsmnIy0uA7R1owPMLtgs3v4wnX13eOA6krgy2nv8';

  init(): Observable<void> {
    return this.http.post<void>(this.loggerAPI, {}, {
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json'
      }
    })
  }
  
}