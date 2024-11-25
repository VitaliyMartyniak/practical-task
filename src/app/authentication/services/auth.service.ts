import {Injectable} from '@angular/core';
import {catchError, from, Observable, of, take} from "rxjs";
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where
} from "@angular/fire/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from "@angular/fire/auth";
import {setUser} from "../../store/actions/auth";
import {Store} from "@ngrx/store";
import {AuthResponse} from "../../shared/interfaces/auth";
import { DocumentData } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth();
  private db = getFirestore();
  private usersDataRef = collection(this.db, 'usersData');

  constructor(private fireStore: Firestore, private store: Store) {
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return from(signInWithEmailAndPassword(this.auth, email, password).then(r => {
      const clonedResponse = JSON.parse(JSON.stringify(r));
      return {
        uid: clonedResponse.user.uid,
        token: {
          expiresIn: +clonedResponse._tokenResponse.expiresIn,
          idToken: clonedResponse._tokenResponse.idToken
        },
      };
    }));
  }

  autoLogin(): void {
    const userID = localStorage.getItem('userID');
    if (userID) {
      this.getAdditionalData(userID).pipe(
        take(1),
        catchError((e) => {
          // this.store.dispatch(setSnackbar({text: e, snackbarType: 'error'}));
          return of([]);
        }),
      ).subscribe((user: any) => {
        this.store.dispatch(setUser({user}));
      })
    }
  }

  signUpUser(email: string, password: string): Observable<AuthResponse> {
    return from(createUserWithEmailAndPassword(this.auth, email, password).then(r => {
      const clonedResponse = JSON.parse(JSON.stringify(r));
      return {
        uid: clonedResponse.user.uid,
        token: {
          expiresIn: +clonedResponse._tokenResponse.expiresIn,
          idToken: clonedResponse._tokenResponse.idToken
        },
      };
    }));
  }

  setAdditionalData(userData: DocumentData): Observable<string> {
    return from(addDoc(this.usersDataRef, userData).then(r => r.id));
  }

  saveDocumentID(id: string): Observable<void> {
    const docRef = doc(this.db, 'usersData', id);
    // @ts-ignore
    return from(updateDoc(docRef, {
      docID: id
    }).then(() => undefined));
  }

  getAdditionalData(userId: string): Observable<DocumentData> {
    const q = query(this.usersDataRef, where('uid', '==', userId));
    return from(getDocs(q).then(r => {
      return {...r.docs[0].data()};
    }));
  }

  forgotPasswordRequest(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email).then(() => undefined));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth).then(() => {
      this.clearStore();
      localStorage.clear();
      return undefined;
    }));
  }

  clearStore(): void {
    this.store.dispatch(setUser({user: null}));
    // this.store.dispatch(setArticles({articles: []}));
    // this.store.dispatch(setSearch({search: ''}));
    // this.store.dispatch(setOrder({order: 'asc'}));
    // this.store.dispatch(setCategory({category: 'All Categories'}));
    // this.store.dispatch(setWeatherLocations({weatherLocations: []}))
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  get token(): string | null {
    const tokenExp = localStorage.getItem('token-exp');
    const expDate = tokenExp ? new Date(tokenExp) : null;
    if(!expDate || new Date() > expDate) {
      this.logout();
      return null
    }
    return localStorage.getItem('token');
  }

  setToken(expiresIn: number, idToken: string): void {
    const expDate = new Date(new Date().getTime() + expiresIn * 1000);
    localStorage.setItem('token', idToken);
    localStorage.setItem('token-exp', expDate.toString());
  }
}
