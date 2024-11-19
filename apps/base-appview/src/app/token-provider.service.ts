import { Injectable } from '@angular/core';
import { TokenProviderService } from '@base-fe/authorization';

@Injectable({providedIn: 'root'})
export class AppTokenProviderService extends TokenProviderService {

  override getToken(): string {
    return localStorage.getItem('Authorization') || '';
  }
   
}