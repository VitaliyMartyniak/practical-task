export interface Environment {
  production: boolean,
  apiKey: string,
  fbDBUrl: string,
  firebase: {
    apiKey: string,
    authDomain: string,
    databaseURL: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
  },
}
