import { AbstractControl } from '@angular/forms';

export class CustomValidators {
  static passwordMatchValidator(control: AbstractControl): void {
    const password: string = control.get('password')!.value;
    const confirmPassword: string = control.get('confirmPassword')!.value;
    if (password !== confirmPassword) {
      control.get('confirmPassword')!.setErrors({ noPassswordMatch: true });
    }
  }

  static passwordNotMatchValidator(control: AbstractControl): void {
    const oldPassword: string = control.get('oldPassword')!.value;
    const newPassword: string = control.get('password')!.value;
    if (oldPassword === newPassword && newPassword !== '') {
      control.get('password')!.setErrors({ passswordMatch: true });
    }
  }

  static emailValidator(control: AbstractControl): void {
    const email: string = control.get('email')!.value;
    const pattern = new RegExp("^[a-z0-9._%+-]+@[a-z0-9-]+[.]+.[a-z]{1,2}$");
    let valid = pattern.test(email);
    if (!valid) {
      control.get('email')!.setErrors({ emailInvalid: true });
    }
  }
}
