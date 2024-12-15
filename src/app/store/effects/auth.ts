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

  autoLogin$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      mergeMap(() => {
        const userID = localStorage.getItem('userID');
        if (!userID) {
          return of(
            NotificationsActions.setSnackbar({
              text: 'No userID found in localStorage',
              snackbarType: SnackbarType.ERROR,
            })
          );
        }
        return this.authService.getAdditionalData(userID).pipe(
          map((documentData: any) => {
            const user: UserData = {
              uid: documentData.uid,
              name: documentData.name,
              docID: documentData.docID
            };
            return AuthActions.setUser({ user });
          }),
          catchError((error) => {
            return of(
              NotificationsActions.setSnackbar({
                text: error.message,
                snackbarType: SnackbarType.ERROR,
              })
            );
          })
        );
      })
    )
  );

  sendForgotPassword$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(AuthActions.sendForgotPassword),
      mergeMap(({ email }) =>
        this.authService.forgotPasswordRequest(email).pipe(
          map(() => {
            this.store.dispatch(setSnackbar({
              text: 'Request sent on your email!',
              snackbarType: SnackbarType.SUCCESS
            }));
            return AuthActions.sendForgotPasswordSuccess();
          }),
          catchError((error) =>
            of(
              NotificationsActions.setSnackbar({
                text: error.message,
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
              map((additionalData: DocumentData) => {
                localStorage.setItem('userID', additionalData['uid']);
                if (token) {
                  this.authService.setToken(token.expiresIn, token.idToken);
                }
                return AuthActions.loginUserSuccess()
              })
            );
          }),
          catchError((error) => {
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
            return of(
              NotificationsActions.setSnackbar({
                text: err.message,
                snackbarType: SnackbarType.ERROR,
              })
            );
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
            return of(
              NotificationsActions.setSnackbar({
                text: err.message,
                snackbarType: SnackbarType.ERROR,
              })
            );
          })
        )
      )
    )
  );
}
