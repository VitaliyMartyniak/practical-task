import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { CustomValidators } from '../../../shared/custom-validators/custom-validators';
import { sendForgotPassword, sendForgotPasswordSuccess } from '../../../store/actions/auth';
import { takeUntil } from 'rxjs';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { Actions, ofType } from '@ngrx/effects';
import { UnsubscribeOnDestroy } from '../../../shared/directives/unsubscribe-onDestroy';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    NgIf,
    MatButton,
    MatFormFieldModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent extends UnsubscribeOnDestroy implements OnInit {
  form!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private actions$: Actions
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
      ]),
    }, CustomValidators.emailValidator);

    this.subscribeToForgotPasswordSuccess();
  }

  resetPassword(): void {
    this.store.dispatch(sendForgotPassword({email: this.form.value.email}));
    this.form.reset();
  }

  subscribeToForgotPasswordSuccess(): void {
    this.actions$.pipe(
      ofType(sendForgotPasswordSuccess),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.router.navigate(['login']);
    });
  }
}
