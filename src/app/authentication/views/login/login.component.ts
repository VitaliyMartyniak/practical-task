import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { CustomValidators } from '../../../shared/custom-validators/custom-validators';
import { setAuthLoading } from '../../../store/actions/auth';
import { AuthResponse, Token } from '../../../shared/interfaces/auth';
import { catchError, finalize, mergeMap, Observable, of } from 'rxjs';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { DocumentData } from 'firebase/firestore';

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
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      // @ts-ignore
    }, CustomValidators.emailValidator);
  }

  loginByEmail(): void {
    const loginData = {...this.form.value};
    this.store.dispatch(setAuthLoading({isLoading: true}));
    let token: Token;
    this.authService.login(loginData.email, loginData.password).pipe(
      mergeMap((response: AuthResponse): Observable<DocumentData> => {
        token = response.token;
        return this.authService.getAdditionalData(response.uid);
      }),
      finalize(() => {
        this.form.reset();
        this.store.dispatch(setAuthLoading({isLoading: false}));
      }),
      catchError((e) => {
        // this.store.dispatch(setSnackbar({text: e, snackbarType: 'error'}));
        return of([]);
      }),
    ).subscribe((response: any): void => {
      const usersData = {...response};
      localStorage.setItem('userID', usersData['uid']);
      if (token) {
        this.authService.setToken(token.expiresIn, token.idToken);
      }
      this.router.navigate(['portal', 'dashboard']);
    });
  }
}
