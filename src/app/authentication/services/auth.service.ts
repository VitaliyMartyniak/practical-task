import { Injectable } from '@angular/core';
import { catchError, from, Observable, of, take } from "rxjs";
import { addDoc, collection, doc, Firestore, getDocs, getFirestore, query, updateDoc, where } from "@angular/fire/firestore";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";
import { cleanupAuthStore, logoutUser, setUser } from "../../store/actions/auth";
import { Store } from "@ngrx/store";
import { AuthResponse } from "../../shared/interfaces/auth";
import { DocumentData } from 'firebase/firestore';
import { setSnackbar } from '../../store/actions/notifications';
import { SnackbarType } from '../../shared/enums/SnackbarTypes';
import { cleanupTodoStore } from '../../store/actions/todo';
import { setTheme } from '../../store/actions/theme';

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
    return from(sendPasswordResetEmail(this.auth, email));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth).then(() => {
      this.clearStore();
      localStorage.clear();
    }));
  }

  clearStore(): void {
    this.store.dispatch(cleanupAuthStore());
    this.store.dispatch(cleanupTodoStore());
    this.store.dispatch(setTheme({ isLightMode: true }));
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  get token(): string | null {
    const tokenExp = localStorage.getItem('token-exp');
    const expDate = tokenExp ? new Date(tokenExp) : null;
    if(!expDate || new Date() > expDate) {
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
