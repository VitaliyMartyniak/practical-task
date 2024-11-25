import { SnackbarType } from '../enums/SnackbarTypes';

export interface Snackbar {
  text: string,
  snackbarType: SnackbarType | null,
}
