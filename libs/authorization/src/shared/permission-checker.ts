import { Inject, Injectable } from "@angular/core";
import { UserPermission, UserPermissionInjection } from "../data-access/module-config";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class PermissionCheckerService {

  constructor(
    private router: Router,
    @Inject(UserPermissionInjection) private readonly userPermissions: UserPermission[]
  ){}

  readonly isActionAllowed = (actionName: string) => {
    const currRoute = this.router.url;
    const currPagePers = this.userPermissions.find(per => per.link == currRoute);
    if(!currPagePers || !currPagePers.role.find(act => act.codeAction == actionName)) return false;
    return true;
  }
}