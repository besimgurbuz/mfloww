import { AbstractControl, ValidatorFn } from '@angular/forms';

export function PasswordMatchValidator(
  passwordControlName: string,
  confirmPasswordControlName: string
): ValidatorFn {
  return (formGroup: AbstractControl) =>
    formGroup.get(passwordControlName)?.value ===
    formGroup.get(confirmPasswordControlName)?.value
      ? null
      : { mismatch: true };
}
