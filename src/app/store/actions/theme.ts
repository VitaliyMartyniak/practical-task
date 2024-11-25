import { createAction, props } from '@ngrx/store';

export const toggleTheme = createAction('[THEME] Toggle Theme');
export const setTheme = createAction('[THEME] Set Theme', props<{ isLightMode: boolean }>());
