import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { finalize, Observable, of } from 'rxjs';
import * as AuthActions from '../actions/auth';
import * as NotificationsActions from '../actions/notifications';
import { Store } from '@ngrx/store';
import { SnackbarType } from '../../shared/enums/SnackbarTypes';
import { AuthService } from '../../authentication/services/auth.service';
import { setSnackbar } from '../actions/notifications';
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
      mergeMap(({ email }) =>
        this.authService.forgotPasswordRequest(email).pipe(
          map(() =>
            NotificationsActions.setSnackbar({
              text: 'Request sent to your email!',
              snackbarType: SnackbarType.SUCCESS
            })
          ),
          catchError((error: any) =>
            of(
              NotificationsActions.setSnackbar({
                text: error.message || 'Failed to send request.',
                snackbarType: SnackbarType.ERROR
              }),
            )
          ),
          finalize(() => {
            this.store.dispatch(AuthActions.setAuthLoading({ isLoading: false }));
          })
        )
      )
    )
  );

  loginUser$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(AuthActions.loginUser),
      mergeMap(({ email, password }) => {
        this.store.dispatch(AuthActions.setAuthLoading({ isLoading: true }));
        return this.authService.login(email, password).pipe(
          mergeMap((response: AuthResponse) => {
            const token = response.token;
            return this.authService.getAdditionalData(response.uid).pipe(
              map((additionalData: DocumentData) =>
                AuthActions.loginUserSuccess({ response: additionalData, token })
              )
            );
          }),
          catchError((error: any) => {
            return of(
              NotificationsActions.setSnackbar({
                text: error.message,
                snackbarType: SnackbarType.ERROR
              }),
            );
          }),
          finalize(() => {
            this.store.dispatch(AuthActions.setAuthLoading({ isLoading: false }));
          })
        );
      })
    )
  );

  signUpUser$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(AuthActions.signUpUser),
      mergeMap(({ email, password, name }) => {
        this.store.dispatch(AuthActions.setAuthLoading({ isLoading: true }));
        return this.authService.signUpUser(email, password).pipe(
          mergeMap((response: AuthResponse) => {
            const userData: UserData = {
              name,
              uid: response.uid,
            };
            return this.authService.setAdditionalData(userData).pipe(
              mergeMap((id: string) =>
                this.authService.saveDocumentID(id).pipe(
                  map(() =>
                    AuthActions.signUpUserSuccess({
                      token: response.token,
                      userID: response.uid,
                      documentID: id,
                    })
                  )
                )
              )
            );
          }),
          catchError((err) => {
            this.store.dispatch(
              NotificationsActions.setSnackbar({
                text: err.message,
                snackbarType: SnackbarType.ERROR,
              })
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

  logoutUser$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(AuthActions.logoutUser),
      mergeMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutUserSuccess()),
          catchError((err) => {
            this.store.dispatch(
              NotificationsActions.setSnackbar({
                text: err.message,
                snackbarType: SnackbarType.ERROR,
              })
            );
            return of();
          })
        )
      )
    )
  );
}
