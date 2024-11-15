import {createFeatureSelector, createSelector} from "@ngrx/store";
import {NotificationsState} from "../reducers/notifications";

export const featureSelector = createFeatureSelector<NotificationsState>('notifications');
export const snackbarSelector = createSelector(
  featureSelector,
  state => state.snackbar
);
