import {createFeatureSelector, createSelector} from "@ngrx/store";
import {AuthState} from "../reducers/auth";

export const featureSelector = createFeatureSelector<AuthState>('auth');
export const userSelector = createSelector(
  featureSelector,
  state => state.user
);

export const authLoadingSelector = createSelector(
  featureSelector,
  state => state.isLoading
);
