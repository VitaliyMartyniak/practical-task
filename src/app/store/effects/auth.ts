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
import { loginUser } from '../actions/auth';
import * as TodoActions from '../actions/todo';
import { AuthResponse, UserData } from '../../shared/interfaces/auth';
import { DocumentData } from 'firebase/firestore';

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

  loginUser$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(AuthActions.loginUser),
      mergeMap(({email, password}) => {
        this.store.dispatch(AuthActions.setAuthLoading({ isLoading: true }))
        return this.authService.login(email, password).pipe(
          mergeMap((response: AuthResponse): Observable<DocumentData> => {
            const token = response.token;
            return this.authService.getAdditionalData(response.uid).pipe(
              map((response: DocumentData) => {
                return AuthActions.loginUserSuccess({ response, token });
              }),
              finalize((): void => {
                this.store.dispatch(TodoActions.setTodosLoading({ isLoading: false }))
              }),
              catchError(err => {
                this.store.dispatch(NotificationsActions.setSnackbar({ text: err, snackbarType: SnackbarType.ERROR }))
                return of();
              })
            )
          })
        )
      }),
    )
  );

  signUpUser$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(AuthActions.signUpUser),
      mergeMap(({ email, password, name }) => {
        this.store.dispatch(AuthActions.setAuthLoading({ isLoading: true }));
        return this.authService.signUpUser(email, password).pipe(
          mergeMap((response: AuthResponse): Observable<DocumentData> => {
            const usersData: UserData = {
              name: name,
              uid: response.uid,
            };
            return this.authService.setAdditionalData(usersData).pipe(
              map((id: string) => AuthActions.signUpUserSuccess({ token: response.token, userID: response.uid, documentID: id })),
            );
          }),
          catchError((err) => {
            this.store.dispatch(
              NotificationsActions.setSnackbar({ text: err, snackbarType: SnackbarType.ERROR })
            );
            return of();
          }),
          finalize(() => {
            this.store.dispatch(AuthActions.setAuthLoading({ isLoading: false }));
          })
        );
      })
    )
  );
}
