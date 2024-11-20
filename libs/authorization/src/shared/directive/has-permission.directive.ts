import { Directive, ElementRef, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UserPermission, UserPermissionInjection } from '../../data-access/module-config';
import { UserPermissionService } from '../../service/user-permission-provider.service';

@Directive({ 
  selector: '[baseFeHasPermission]',
  standalone: true 
})
export class HasPermissionDirective implements OnChanges {
  constructor(
    private router: Router,
    @Inject(UserPermissionInjection) private userPermission: UserPermissionService,
    private elementRef: ElementRef<HTMLElement>
  ) { }
  
  @Input() baseFeHasPermission: string | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['baseFeHasPermission']) {
      const currRoute = this.router.url;
      const currPagePers = this.userPermission.getUserPermission().find(per => per.link == currRoute);
      if(!currPagePers || !this.isActionAllowed(currPagePers)) {
        this.elementRef.nativeElement.remove();        
      }
    }
  }

  private isActionAllowed(pers: UserPermission) {
    return pers.role.find(act => act.codeAction == this.baseFeHasPermission);
  }

}