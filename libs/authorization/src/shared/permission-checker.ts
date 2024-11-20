import { Inject, Injectable } from "@angular/core";
import { UserPermissionInjection } from "../data-access/module-config";
import { Router } from "@angular/router";
import { UserPermissionService } from "../service/user-permission-provider.service";

@Injectable({ providedIn: 'root' })
export class PermissionCheckerService {

  constructor(
    private router: Router,
    @Inject(UserPermissionInjection) private readonly userPermissions: UserPermissionService
  ){}

  readonly isActionAllowed = (actionName: string) => {
    const currRoute = this.router.url;
    const currPagePers = this.userPermissions.getUserPermission().find(per => per.link == currRoute);
    if(!currPagePers || !currPagePers.role.find(act => act.codeAction == actionName)) return false;
    return true;
  }
}