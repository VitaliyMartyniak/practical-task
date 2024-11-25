import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { todoReducer } from './store/reducers/todo';
import { authReducer } from './store/reducers/auth';

import { environment } from '../environments/environment';
import {initializeFirestore, provideFirestore} from "@angular/fire/firestore";
import {getApp, initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {getAuth, provideAuth} from "@angular/fire/auth";
import { provideAnimations } from '@angular/platform-browser/animations';
import { TodoEffects } from './store/effects/todo';
import { notificationsReducer } from './store/reducers/notifications';
import { themeReducer } from './store/reducers/theme';
import { AuthEffects } from './store/effects/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({todos: todoReducer, auth: authReducer, notifications: notificationsReducer, theme: themeReducer,}),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => initializeFirestore(getApp(), { experimentalForceLongPolling: true })),
    provideEffects([AuthEffects, TodoEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })]
};
