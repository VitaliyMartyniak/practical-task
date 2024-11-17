import { Injectable } from '@angular/core';
import { from, Observable, ObservedValueOf, of } from "rxjs";
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
      r.docs.forEach((todoDoc: any) => {
        const todo: Todo = {...todoDoc.data()};
        todos.push({
          ...todo,
          completionDate: todo.completionDate ? new Date(todoDoc.data().completionDate.seconds * 1000) : null,
          creationDate: new Date(todoDoc.data().creationDate.seconds * 1000),
          dueDate: new Date(todoDoc.data().dueDate.seconds * 1000),
        });
      })
      return todos;
    }));
  }

  updateTodos(todoData: Todo[]): Observable<ObservedValueOf<Promise<Awaited<Observable<ObservedValueOf<Promise<undefined>>>>[]>>> {
    const updatePromises = todoData.map((todo) => {
      const { docID, ...data } = todo;
      const docRef = doc(this.db, 'todos', docID);

      return from(updateDoc(docRef, data).then(() => undefined));
    });

    return from(Promise.all(updatePromises));
  }

  deleteTodo(id: string): Observable<void> {
    const docRef = doc(this.db, 'todos', id);
    return from(deleteDoc(docRef).then(() => undefined));
  }

  bulkDeleteTodo(idsArray: string[]): Observable<ObservedValueOf<Promise<Awaited<void>[]>>> {
    const deletePromises = idsArray.map(id => {
      const docRef = doc(this.db, 'todos', id);
      return deleteDoc(docRef);
    });

    return from(Promise.all(deletePromises));
  }
}
