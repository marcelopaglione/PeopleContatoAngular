import { AbstractControl, ValidatorFn } from '@angular/forms';
import { of } from 'rxjs';

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const dateStr = control.value;

    const dateRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;

    const invalidDate = !dateRegex.test(dateStr);

    return invalidDate ? {invalidDate: {value: control.value}} : null;
  };
}
