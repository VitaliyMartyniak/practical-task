import {createAction, props} from "@ngrx/store";
import { Token, UserData } from '../../shared/interfaces/auth';

export const autoLogin = createAction('[AUTH] Auto Login');
export const setUser = createAction('[AUTH] Set User', props<{user: UserData | null}>());

export const setAuthLoading = createAction('[AUTH] Set Auth Loading', props<{isLoading: boolean}>());

export const sendForgotPassword = createAction('[AUTH] Send Forgot Password', props<{ email: string }>());

export const sendForgotPasswordSuccess = createAction('[AUTH] Send Forgot Password Success');

export const signUpUser = createAction('[AUTH] Sign Up User', props<{ email: string; password: string; name: string }>());

export const signUpUserSuccess = createAction('[AUTH] Sign Up User Success', props<{ token: Token; userID: string; documentID: string }>());

export const loginUser = createAction('[AUTH] Login User', props<{ email: string, password: string }>());

export const loginUserSuccess = createAction('[AUTH] Login User Success');

export const logoutUser = createAction('[AUTH] Logout User');

export const logoutUserSuccess = createAction('[AUTH] Logout User Success');

export const cleanupAuthStore = createAction('[AUTH] Cleanup Auth Store');
