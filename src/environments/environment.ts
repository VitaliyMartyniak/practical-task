// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {Environment} from "./interface";

export const environment: Environment = {
  production: false,
  // apiKey: 'AIzaSyAtfjX7eKFbmxD7YqV6KPr8mT-lMDwowmU',
  // fbDBUrl: 'https://middle-project-6ebe9-default-rtdb.europe-west1.firebasedatabase.app',
  apiKey: '',
  fbDBUrl: '',
  firebase: {
    // databaseURL: 'https://middle-project-6ebe9-default-rtdb.europe-west1.firebasedatabase.app',
    databaseURL: '',
    apiKey: "AIzaSyCEGpMEs5JHMrwtEZWWz9GHblr1HstUhdI",
    authDomain: "practical-task-ce5ee.firebaseapp.com",
    projectId: "practical-task-ce5ee",
    storageBucket: "practical-task-ce5ee.firebasestorage.app",
    messagingSenderId: "583945143044",
    appId: "1:583945143044:web:d315916d8bafb1598c8651"
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
