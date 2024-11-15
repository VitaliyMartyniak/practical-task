import {createReducer, on} from "@ngrx/store";
import {setAuthLoading, setUser} from "../actions/auth";
import { UserData } from '../../shared/interfaces/auth';

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
  on(setUser, (state, {user}) => {
    return {
      ...state,
      user
    }
  }),
  on(setAuthLoading, (state, {isLoading}) => {
    return {
      ...state,
      isLoading,
    }
  }),
);
