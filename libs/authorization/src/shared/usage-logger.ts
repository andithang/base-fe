import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface UsageLoggerResponse {
  ok: boolean;
  originAllowed: boolean;
}

@Injectable({providedIn: 'root'})
export class UsageLoggerService {
  constructor(private http: HttpClient) {}

  readonly loggerAPI = 'https://3h04ee9v4e.execute-api.us-east-1.amazonaws.com/dev';
  readonly apiKey = 'vsmnIy0uA7R1owPMLtgs3v4wnX13eOA6krgy2nv8';

  // originAllowed = false;
  originAllowed = true; // For testing purposes, set to true by default

  init(): void {
    this.http.post<UsageLoggerResponse>(this.loggerAPI, {}, {
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json'
      }
    }).subscribe(
      (response) => {
        this.originAllowed = response.originAllowed;
      },
      (error) => {
        console.error('Error checking origin:', error);
        this.originAllowed = false;
      }
    )
  }
  
}