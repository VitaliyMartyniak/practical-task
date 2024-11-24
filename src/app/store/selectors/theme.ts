import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ThemeState } from '../reducers/theme';

export const selectThemeState = createFeatureSelector<ThemeState>('theme');
export const selectIsLightMode = createSelector(selectThemeState, (state) => state.isLightMode);
