import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { CustomValidators } from '../../../shared/custom-validators/custom-validators';
import { setAuthLoading } from '../../../store/actions/auth';
import { catchError, finalize, mergeMap, Observable, of } from 'rxjs';
import { AuthResponse, Token, UserData } from '../../../shared/interfaces/auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

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
export class SignUpComponent implements OnInit {
  form!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private store: Store) {}

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
      // @ts-ignore
    }, [CustomValidators.passwordMatchValidator, CustomValidators.emailValidator]);
  }

  signUpUser(): void {
    const signUpData = {...this.form.value}
    this.store.dispatch(setAuthLoading({isLoading: true}));
    let usersDataUID: string;
    let token: Token;
    this.authService.signUpUser(signUpData.email, signUpData.password).pipe(
      mergeMap((response: AuthResponse): Observable<string> => {
        const usersData: UserData = {
          name: signUpData.name,
          uid: response.uid,
        }
        usersDataUID = usersData.uid;
        token = response.token;
        return this.authService.setAdditionalData(usersData);
      }),
      mergeMap((id: string): Observable<void> => {
        return this.authService.saveDocumentID(id);
      }),
      finalize(() => {
        this.form.reset();
        this.store.dispatch(setAuthLoading({isLoading: false}));
      }),
      catchError((e) => {
        // this.store.dispatch(setSnackbar({text: e, snackbarType: 'error'}));
        return of([]);
      }),
    ).subscribe(() => {
      localStorage.setItem('userID', usersDataUID);
      if (token) {
        this.authService.setToken(token.expiresIn, token.idToken);
      }
      this.router.navigate(['portal', 'dashboard']);
    });
  }
}
