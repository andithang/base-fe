import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({providedIn: 'root'})
export class BaseFeAppService {
  constructor(private translate: TranslateService) { }

  readonly translationLoaded$ = this.translate.use('vi');
  
}