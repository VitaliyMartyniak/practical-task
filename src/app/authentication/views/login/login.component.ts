import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { CustomValidators } from '../../../shared/custom-validators/custom-validators';
import { loginUser, loginUserSuccess } from '../../../store/actions/auth';
import { takeUntil } from 'rxjs';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { Actions, ofType } from '@ngrx/effects';
import { UnsubscribeOnDestroy } from '../../../shared/directives/unsubscribe-onDestroy';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends UnsubscribeOnDestroy implements OnInit {
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
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
    }, CustomValidators.emailValidator);
    this.subscribeToLoginSuccess();
  }

  loginByEmail(): void {
    const loginData = {...this.form.value};
    this.store.dispatch(loginUser({email: loginData.email, password: loginData.password}));
    this.form.reset();
  }

  subscribeToLoginSuccess(): void {
    this.actions$.pipe(
      ofType(loginUserSuccess),
      takeUntil(this.destroy$)
    ).subscribe((action) => {
      const usersData = {...action.response};
      localStorage.setItem('userID', usersData['uid']);
      if (action.token) {
        this.authService.setToken(action.token.expiresIn, action.token.idToken);
      }
      this.router.navigate(['portal']);
    });
  }
}
