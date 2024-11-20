import { Injectable } from '@angular/core';
import { UserPermission } from '../data-access/module-config';

@Injectable({providedIn: 'root'})
export abstract class UserPermissionService {
  abstract getUserPermission(): UserPermission[];  
}

@Injectable({providedIn: 'root'})
export class DefaultUserPermissionService extends UserPermissionService {
  override getUserPermission(): UserPermission[] {
    return [];
  }

}