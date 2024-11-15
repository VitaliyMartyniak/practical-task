import { Injectable } from '@angular/core';
import {from, Observable} from "rxjs";
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, getFirestore, updateDoc } from "@angular/fire/firestore";
import { DocumentData } from 'firebase/firestore';
import { Todo } from '../../shared/interfaces/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private db = getFirestore();
  private todosRef = collection(this.db, 'todos');

  constructor(private firestore: Firestore) { }

  addNewTodo(newTodo: DocumentData): Observable<string> {
    return from(addDoc(this.todosRef, newTodo).then(r => r.id));
  }

  saveDocumentID(id: string): Observable<void> {
    const docRef = doc(this.db, 'todos', id);
    // @ts-ignore
    return from(updateDoc(docRef, {
      docID: id
    }).then(() => undefined));
  }

  getTodos(): Observable<Todo[]> {
    return from(getDocs(this.todosRef).then(r => {
      const todos: Todo[] = [];
      r.docs.forEach((article: any) => {
        todos.push({...article.data()});
      })
      return todos;
    }));
  }

  updateTodo(todoData: DocumentData, id: string): Observable<void> {
    const docRef = doc(this.db, 'todos', id);
    // @ts-ignore
    return from(updateDoc(docRef, todoData).then(() => undefined));
  }

  deleteTodo(id: string): Observable<void> {
    const docRef = doc(this.db, 'todos', id);
    return from(deleteDoc(docRef).then(() => undefined));
  }
}
