import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export abstract class TokenProviderService {
  abstract getToken(): string;  
}

@Injectable({providedIn: 'root'})
export class DefaultTokenProviderService extends TokenProviderService {
  override getToken(): string {
    return '';
  }

}