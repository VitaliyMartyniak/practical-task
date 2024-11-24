import { createReducer, on } from '@ngrx/store';
import * as ThemeActions from '../actions/theme';

export interface ThemeState {
  isLightMode: boolean;
}

export const initialState: ThemeState = {
  isLightMode: true,
};

export const themeReducer = createReducer(
  initialState,
  on(ThemeActions.toggleTheme, (state) => ({
    ...state,
    isLightMode: !state.isLightMode,
  })),
  on(ThemeActions.setTheme, (state, { isLightMode }) => ({
    ...state,
    isLightMode,
  }))
);
