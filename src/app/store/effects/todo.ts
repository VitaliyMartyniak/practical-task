import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { finalize, of } from 'rxjs';
import { TodoService } from '../../portal/services/todo.service';
import * as TodoActions from '../actions/todo';
import * as NotificationsActions from '../actions/notifications';
import { addTodo, addTodoSuccess, addTodoFailure, setTodosLoading } from '../actions/todo';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Snackbar } from '../../shared/interfaces/snackbar';

@Injectable()
export class TodoEffects {
  constructor(
    private store: Store,
    private actions$: Actions,
    private todoService: TodoService
  ) {}

  // Observable<Action>
  // addTodo$ = createEffect((): Observable<any> =>
  //     this.actions$.pipe(
  //       ofType(TodoActions.addTodo),
  //       mergeMap(action =>
  //         this.todoService.addNewTodo(action.todo).pipe(
  //           map(docID => TodoActions.addTodoSuccess({ docID })),
  //           catchError(error => of(TodoActions.addTodoFailure({ error })))
  //         )
  //       )
  //     )
  // );

  addTodo$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(TodoActions.addTodo),
      mergeMap(action => {
        this.store.dispatch(TodoActions.setTodosLoading({ isLoading: true }))
        return this.todoService.addNewTodo(action.todo).pipe(
          mergeMap((docID: string) =>
            this.todoService.saveDocumentID(docID).pipe(
              map(() => TodoActions.addTodoSuccess({ todo: action.todo, docID })),
              finalize((): void => {
                this.store.dispatch(TodoActions.setTodosLoading({ isLoading: false }))
              }),
              catchError(err => {
                this.store.dispatch(NotificationsActions.setSnackbar({ text: err, snackbarType: 'error' }))
                return of();
              })
            )
          )
        )
      }),
    )
  );
}
