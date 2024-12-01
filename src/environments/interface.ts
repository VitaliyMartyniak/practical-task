export interface Environment {
  production: boolean,
  firebase: {
    apiKey: string,
    authDomain: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
  },
}
