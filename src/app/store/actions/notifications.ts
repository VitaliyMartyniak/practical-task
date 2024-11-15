import {createAction, props} from "@ngrx/store";

export const setSnackbar = createAction('[NOTIFICATIONS] set snackbar',
  props<{text: string, snackbarType: string}>()
);
export const clearSnackbar = createAction('[NOTIFICATIONS] clear snackbar');
