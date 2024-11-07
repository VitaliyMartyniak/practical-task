import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { todoReducer } from './store/reducers/todo.reducer';

import { environment } from '../environments/environment';
import {initializeFirestore, provideFirestore} from "@angular/fire/firestore";
import {getApp, initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {getAuth, provideAuth} from "@angular/fire/auth";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({todos: todoReducer}),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => initializeFirestore(getApp(), { experimentalForceLongPolling: true })),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })]
};
