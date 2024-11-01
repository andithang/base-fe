import { AbstractControl, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";

export function trimRequired(control: AbstractControl): { [key: string]: boolean } | null {
  let value = null;
  if (control && control.value != null) {
    value = control?.value.toString().trim().length;
  }
  if (value == null || value === 0) {
    return {'required': true};
  }
  return null;
}

export const getError = (formGroup: FormGroup, control: string, translate: TranslateService, formName: string) => {
  const key = Object.keys(formGroup.get(control)?.errors || {}).shift();
  return translate.instant('base-fe.' + formName + '.errorForm.' + control + '.' + key);
}