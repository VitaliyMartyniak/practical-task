import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { CustomValidators } from '../../../shared/custom-validators/custom-validators';
import { setAuthLoading } from '../../../store/actions/auth';
import { catchError, finalize, of } from 'rxjs';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';

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
export class ForgotPasswordComponent implements OnInit {
  form!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
      ]),
      // @ts-ignore
    }, CustomValidators.emailValidator);
  }

  sendResetPasswordRequest(): void {
    this.store.dispatch(setAuthLoading({isLoading: true}));
    this.authService.forgotPasswordRequest(this.form.value.email).pipe(
      finalize(() => {
        this.form.reset();
        this.store.dispatch(setAuthLoading({isLoading: false}));
      }),
      catchError((e) => {
        // this.store.dispatch(setSnackbar({text: e, snackbarType: 'error'}));
        return of([]);
      }),
    ).subscribe(() => {
      // this.store.dispatch(setSnackbar({text: 'Request sent on your email!', snackbarType: 'success'}));
      this.router.navigate(['login']);
    })
  }
}
