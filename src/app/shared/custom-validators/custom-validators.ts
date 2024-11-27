import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      control.get('confirmPassword')!.setErrors({ noPasswordMatch: true });
      return control;
    } else {
      return null;
    }
  }

  static emailValidator(control: AbstractControl): ValidationErrors | null {
    const email: string = control.get('email')!.value;
    const pattern = /^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,}$/;

    if (email && !pattern.test(email)) {
      control.get('email')!.setErrors({ emailInvalid: true });
      return control;
    } else {
      return null;
    }
  }

  static dateValidator(control: AbstractControl): ValidationErrors | null {
    const dueDate = control.get('dueDate')!.value;
    if (!dueDate) {
      return null;
    }

    const today = new Date();

    if (new Date(dueDate) < today) {
      control.get('dueDate')!.setErrors({ invalidDate: true });
      return control;
    } else {
      return null;
    }
  }
}
