import {createReducer, on} from "@ngrx/store";
import { UserData } from '../../shared/interfaces/auth';
import * as AuthActions from '../actions/auth';

export interface AuthState {
  user: UserData | null,
  isLoading: boolean,
}

export const initialState: AuthState = {
  user: null,
  isLoading: false,
}

export const authReducer = createReducer(
  initialState,
  on(AuthActions.setUser, (state, {user}) => {
    return {
      ...state,
      user
    }
  }),
  on(AuthActions.setAuthLoading, (state, {isLoading}) => {
    return {
      ...state,
      isLoading,
    }
  }),
  on(AuthActions.cleanupAuthStore, () => {
    return {
      ...initialState
    }
  }),
);
