import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, exhaustMap, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { finalize, of } from 'rxjs';
import { TodoService } from '../../portal/services/todo.service';
import * as TodoActions from '../actions/todo';
import * as NotificationsActions from '../actions/notifications';
import { addTodo, addTodoSuccess, addTodoFailure, setTodosLoading, setFilters, setSearchQuery, updateSearchQuery } from '../actions/todo';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Snackbar } from '../../shared/interfaces/snackbar';
import { Todo } from '../../shared/interfaces/todo';

@Injectable()
export class TodoEffects {
  constructor(
    private store: Store,
    private actions$: Actions,
    private todoService: TodoService
  ) {}

  // Observable<Action>
  getTodos$ = createEffect((): Observable<any> =>
      this.actions$.pipe(
        ofType(TodoActions.getTodos),
        mergeMap(() => {
          this.store.dispatch(TodoActions.setTodosLoading({ isLoading: true }))
          return this.todoService.getTodos().pipe(
            map((todos: Todo[]) => TodoActions.getTodosSuccess({ todos })),
            finalize((): void => {
              this.store.dispatch(TodoActions.setTodosLoading({ isLoading: false }))
            }),
            catchError(err => {
              this.store.dispatch(NotificationsActions.setSnackbar({ text: err, snackbarType: 'error' }))
              return of();
            })
          )
        })
      )
  );

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

  updateTodos$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(TodoActions.updateTodos),
      mergeMap(action => {
        this.store.dispatch(TodoActions.setTodosLoading({ isLoading: true }))
        return this.todoService.updateTodos(action.todos).pipe(
          map(() => TodoActions.updateTodosSuccess({ todos: action.todos })),
          finalize((): void => {
            this.store.dispatch(TodoActions.setTodosLoading({ isLoading: false }))
          }),
          catchError(err => {
            this.store.dispatch(NotificationsActions.setSnackbar({ text: err, snackbarType: 'error' }))
            return of();
          })
        )
      })
    )
  );

  deleteTodo$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(TodoActions.deleteTodo),
      mergeMap(action => {
        this.store.dispatch(TodoActions.setTodosLoading({ isLoading: true }))
        return this.todoService.deleteTodo(action.docID).pipe(
          map(() => TodoActions.deleteTodoSuccess({ docID: action.docID })),
          finalize((): void => {
            this.store.dispatch(TodoActions.setTodosLoading({ isLoading: false }))
          }),
          catchError(err => {
            this.store.dispatch(NotificationsActions.setSnackbar({ text: err, snackbarType: 'error' }))
            return of();
          })
        )
      })
    )
  );

  bulkDeleteTodo$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(TodoActions.bulkDeleteTodo),
      mergeMap(action => {
        this.store.dispatch(TodoActions.setTodosLoading({ isLoading: true }))
        return this.todoService.bulkDeleteTodo(action.docIDs).pipe(
          map(() => TodoActions.bulkDeleteTodoSuccess({ docIDs: action.docIDs })),
          finalize((): void => {
            this.store.dispatch(TodoActions.setTodosLoading({ isLoading: false }))
          }),
          catchError(err => {
            this.store.dispatch(NotificationsActions.setSnackbar({ text: err, snackbarType: 'error' }))
            return of();
          })
        )
      })
    )
  );

  updateSearchQuery$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(TodoActions.updateSearchQuery),
      debounceTime(1000),
      map(({ query }) => {
        return setSearchQuery({ query });
      })
    )
  );
}
