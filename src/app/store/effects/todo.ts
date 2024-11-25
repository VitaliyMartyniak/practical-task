import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, map, mergeMap } from 'rxjs/operators';
import { finalize, Observable, of } from 'rxjs';
import { TodoService } from '../../portal/services/todo.service';
import * as TodoActions from '../actions/todo';
import { setSearchQuery } from '../actions/todo';
import * as NotificationsActions from '../actions/notifications';
import { Store } from '@ngrx/store';
import { Todo } from '../../shared/interfaces/todo';
import { SnackbarType } from '../../shared/enums/SnackbarTypes';

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
              this.store.dispatch(NotificationsActions.setSnackbar({ text: err, snackbarType: SnackbarType.ERROR }))
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
              map(() => {
                this.store.dispatch(NotificationsActions.setSnackbar({ text: 'Added todo successfully!', snackbarType: SnackbarType.SUCCESS }))
                return TodoActions.addTodoSuccess({ todo: action.todo, docID });
              }),
              finalize((): void => {
                this.store.dispatch(TodoActions.setTodosLoading({ isLoading: false }))
              }),
              catchError(err => {
                this.store.dispatch(NotificationsActions.setSnackbar({ text: err, snackbarType: SnackbarType.ERROR }))
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
          map(() => {
            this.store.dispatch(NotificationsActions.setSnackbar({ text: "Updated todo('s) successfully!", snackbarType: SnackbarType.SUCCESS }))
            return TodoActions.updateTodosSuccess({ todos: action.todos })
          }),
          finalize((): void => {
            this.store.dispatch(TodoActions.setTodosLoading({ isLoading: false }))
          }),
          catchError(err => {
            this.store.dispatch(NotificationsActions.setSnackbar({ text: err, snackbarType: SnackbarType.ERROR }))
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
          map(() => {
            this.store.dispatch(NotificationsActions.setSnackbar({ text: 'Deleted todo successfully!', snackbarType: SnackbarType.SUCCESS }))
            return TodoActions.deleteTodoSuccess({ docID: action.docID })
          }),
          finalize((): void => {
            this.store.dispatch(TodoActions.setTodosLoading({ isLoading: false }))
          }),
          catchError(err => {
            this.store.dispatch(NotificationsActions.setSnackbar({ text: err, snackbarType: SnackbarType.ERROR }))
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
          map(() => {
            this.store.dispatch(NotificationsActions.setSnackbar({ text: 'Deleted todos successfully!', snackbarType: SnackbarType.SUCCESS }))
            return TodoActions.bulkDeleteTodoSuccess({ docIDs: action.docIDs })
          }),
          finalize((): void => {
            this.store.dispatch(TodoActions.setTodosLoading({ isLoading: false }))
          }),
          catchError(err => {
            this.store.dispatch(NotificationsActions.setSnackbar({ text: err, snackbarType: SnackbarType.ERROR }))
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
