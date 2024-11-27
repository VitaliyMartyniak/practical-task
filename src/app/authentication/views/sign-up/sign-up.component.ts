import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { CustomValidators } from '../../../shared/custom-validators/custom-validators';
import { signUpUser, signUpUserSuccess } from '../../../store/actions/auth';
import { takeUntil } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Actions, ofType } from '@ngrx/effects';
import { UnsubscribeOnDestroy } from '../../../shared/directives/unsubscribe-onDestroy';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent extends UnsubscribeOnDestroy implements OnInit {
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
      name: new FormControl('', [
        Validators.required
      ]),
      email: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
      ]),
    }, [CustomValidators.passwordMatchValidator, CustomValidators.emailValidator]);
    this.subscribeToSignUpSuccess()
  }

  signUp(): void {
    const signUpData = { ...this.form.value };
    this.store.dispatch(signUpUser({
      email: signUpData.email,
      password: signUpData.password,
      name: signUpData.name
    }));
    this.form.reset();
  }

  subscribeToSignUpSuccess(): void {
    this.actions$.pipe(
      ofType(signUpUserSuccess),
      takeUntil(this.destroy$)
    ).subscribe((action) => {
      localStorage.setItem('userID', action.userID);
      if (action.token) {
        this.authService.setToken(action.token.expiresIn, action.token.idToken);
      }
      this.router.navigate(['portal']);
    });
  }
}
