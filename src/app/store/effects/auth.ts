import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, map, mergeMap } from 'rxjs/operators';
import { finalize, Observable, of } from 'rxjs';
import * as AuthActions from '../actions/auth';
import * as NotificationsActions from '../actions/notifications';
import { Store } from '@ngrx/store';
import { SnackbarType } from '../../shared/enums/SnackbarTypes';
import { AuthService } from '../../authentication/services/auth.service';
import { setSnackbar } from '../actions/notifications';

@Injectable()
export class AuthEffects {
  constructor(
    private store: Store,
    private actions$: Actions,
    private authService: AuthService
  ) {}

  // Observable<Action>
  sendForgotPassword$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(AuthActions.sendForgotPassword),
      mergeMap(({email}) => {
        console.log('email1', email)
        this.store.dispatch(AuthActions.setAuthLoading({ isLoading: true }))
        return this.authService.forgotPasswordRequest(email).pipe(
          map(() => {
            this.store.dispatch(setSnackbar({text: 'Request sent on your email!', snackbarType: SnackbarType.SUCCESS}));
            return AuthActions.sendForgotPasswordSuccess();
          }),
          finalize((): void => {
            this.store.dispatch(AuthActions.setAuthLoading({ isLoading: false }))
          }),
          catchError(err => {
            this.store.dispatch(NotificationsActions.setSnackbar({ text: err, snackbarType: SnackbarType.ERROR }))
            return of();
          })
        )
      })
    )
  );
}
