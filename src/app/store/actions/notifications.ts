import {createAction, props} from "@ngrx/store";
import { SnackbarType } from '../../shared/enums/SnackbarTypes';

export const setSnackbar = createAction('[NOTIFICATIONS] set snackbar',
  props<{text: string, snackbarType: SnackbarType}>()
);
export const clearSnackbar = createAction('[NOTIFICATIONS] clear snackbar');
