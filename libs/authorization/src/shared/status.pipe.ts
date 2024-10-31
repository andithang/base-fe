import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'statusCommon',
  standalone: true
})

export class StatusCommonPipe implements PipeTransform {

  constructor(private translate: TranslateService){}

  transform(value: number): string {
    switch (value) {
      case 0:
        return this.translate.instant('base-fe.common.inactive')
      case 1:
          return this.translate.instant('base-fe.common.active');
      default:
        return '';
    }
  }
}