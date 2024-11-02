import { Directive, ElementRef, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UserPermission, UserPermissionInjection } from '../../data-access/module-config';

@Directive({ 
  selector: '[baseFeHasPermission]',
  standalone: true 
})
export class HasPermissionDirective implements OnChanges {
  constructor(
    private router: Router,
    @Inject(UserPermissionInjection) private userPermission: UserPermission[],
    private elementRef: ElementRef<HTMLElement>
  ) { }
  
  @Input() baseFeHasPermission: string | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['baseFeHasPermission']) {
      const currRoute = this.router.url;
      const currPagePers = this.userPermission.find(per => per.link == currRoute);
      if(!currPagePers || !this.isActionAllowed(currPagePers)) {
        this.elementRef.nativeElement.remove();        
      }
    }
  }

  private isActionAllowed(pers: UserPermission) {
    return pers.role.find(act => act.codeAction == this.baseFeHasPermission);
  }

}