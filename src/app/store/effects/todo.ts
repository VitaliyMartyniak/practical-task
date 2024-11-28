import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, distinctUntilChanged, map, mergeMap } from 'rxjs/operators';
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
      mergeMap(({ docID }) => {
        this.store.dispatch(TodoActions.setTodosLoading({ isLoading: true }));
        return this.todoService.getTodos(docID).pipe(
          map((todos: Todo[]) => TodoActions.getTodosSuccess({ todos })),
          catchError((err) => {
            this.store.dispatch(
              NotificationsActions.setSnackbar({
                text: err.message,
                snackbarType: SnackbarType.ERROR,
              })
            );
            return of();
          }),
          finalize(() => {
            this.store.dispatch(TodoActions.setTodosLoading({ isLoading: false }));
          })
        );
      })
    )
  );

  addTodo$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(TodoActions.addTodo),
      mergeMap((action) => {
        this.store.dispatch(TodoActions.setTodosLoading({ isLoading: true }));
        return this.todoService.addNewTodo(action.todo).pipe(
          mergeMap((docID: string) =>
            this.todoService.saveDocumentID(docID).pipe(
              map(() => TodoActions.addTodoSuccess({ todo: action.todo, docID }))
            )
          ),
          catchError((err) => {
            this.store.dispatch(
              NotificationsActions.setSnackbar({
                text: err.message,
                snackbarType: SnackbarType.ERROR,
              })
            );
            return of();
          }),
          finalize(() => {
            this.store.dispatch(
              TodoActions.setTodosLoading({ isLoading: false })
            );
            this.store.dispatch(
              NotificationsActions.setSnackbar({
                text: 'Added todo successfully!',
                snackbarType: SnackbarType.SUCCESS,
              })
            );
          })
        );
      })
    )
  );

  updateTodos$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(TodoActions.updateTodos),
      mergeMap((action) => {
        this.store.dispatch(TodoActions.setTodosLoading({ isLoading: true }));
        return this.todoService.updateTodos(action.todos).pipe(
          map(() =>
            TodoActions.updateTodosSuccess({ todos: action.todos })
          ),
          catchError((err) => {
            this.store.dispatch(
              NotificationsActions.setSnackbar({
                text: err.message,
                snackbarType: SnackbarType.ERROR,
              })
            );
            return of();
          }),
          finalize(() => {
            this.store.dispatch(
              TodoActions.setTodosLoading({ isLoading: false })
            );
            this.store.dispatch(
              NotificationsActions.setSnackbar({
                text: "Updated todo's successfully!",
                snackbarType: SnackbarType.SUCCESS,
              })
            );
          })
        );
      })
    )
  );

  deleteTodo$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(TodoActions.deleteTodo),
      mergeMap((action) => {
        this.store.dispatch(TodoActions.setTodosLoading({ isLoading: true }));
        return this.todoService.deleteTodo(action.docID).pipe(
          map(() => TodoActions.deleteTodoSuccess({ docID: action.docID })),
          catchError((err) => {
            this.store.dispatch(
              NotificationsActions.setSnackbar({
                text: err.message,
                snackbarType: SnackbarType.ERROR,
              })
            );
            return of();
          }),
          finalize(() => {
            this.store.dispatch(TodoActions.setTodosLoading({ isLoading: false }));
            this.store.dispatch(
              NotificationsActions.setSnackbar({
                text: 'Deleted todo successfully!',
                snackbarType: SnackbarType.SUCCESS,
              })
            );
          })
        );
      })
    )
  );

  bulkDeleteTodo$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(TodoActions.bulkDeleteTodo),
      mergeMap((action) => {
        this.store.dispatch(TodoActions.setTodosLoading({ isLoading: true }));
        return this.todoService.bulkDeleteTodo(action.docIDs).pipe(
          map(() => TodoActions.bulkDeleteTodoSuccess({ docIDs: action.docIDs })),
          catchError((err) => {
            this.store.dispatch(
              NotificationsActions.setSnackbar({
                text: err.message,
                snackbarType: SnackbarType.ERROR,
              })
            );
            return of(); // Gracefully terminate the observable on error.
          }),
          finalize(() => {
            this.store.dispatch(TodoActions.setTodosLoading({ isLoading: false }));
            this.store.dispatch(
              NotificationsActions.setSnackbar({
                text: 'Deleted todos successfully!',
                snackbarType: SnackbarType.SUCCESS,
              })
            );
          })
        );
      })
    )
  );

  updateSearchQuery$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(TodoActions.updateSearchQuery),
      debounceTime(1000),
      distinctUntilChanged(),
      map(({ query }) => setSearchQuery({ query }))
    )
  );
}
