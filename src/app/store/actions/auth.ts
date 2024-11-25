import {createAction, props} from "@ngrx/store";
import { Token, UserData } from '../../shared/interfaces/auth';
import { DocumentData } from 'firebase/firestore';

export const setUser = createAction('[AUTH] set user',
  props<{user: UserData | null}>()
);

export const setAuthLoading = createAction('[AUTH] set auth loading',
  props<{isLoading: boolean}>()
);

export const sendForgotPassword = createAction('[AUTH] Send Forgot Password', props<{ email: string }>());

export const sendForgotPasswordSuccess = createAction('[AUTH] Send Forgot Password Success');

export const loginUser = createAction('[AUTH] Login User', props<{ email: string, password: string }>());

export const loginUserSuccess = createAction('[AUTH] Login User Success', props<{ response: DocumentData, token: Token }>());
