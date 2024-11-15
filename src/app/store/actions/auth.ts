import {createAction, props} from "@ngrx/store";
import { UserData } from '../../shared/interfaces/auth';

export const setUser = createAction('[AUTH] set user',
  props<{user: UserData | null}>()
);

export const setAuthLoading = createAction('[AUTH] set auth loading',
  props<{isLoading: boolean}>()
);
