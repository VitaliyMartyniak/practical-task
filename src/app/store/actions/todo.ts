import { createAction, props } from '@ngrx/store';
import { Todo } from '../../shared/interfaces/todo';

export const addTodo = createAction('[Todo] Add Todo', props<{ todo: Todo }>());
export const addTodoSuccess = createAction('[Todo] Add Todo Success', props<{ todo: Todo, docID: string }>());
export const addTodoFailure = createAction('[Todo] Add Todo Failure', props<{ error: Error }>());

export const updateTodos = createAction('[Todo] Update Todo', props<{ todos: Todo[] }>());
export const updateTodosSuccess = createAction('[Todo] Update Todo Success', props<{ todos: Todo[] }>());
export const deleteTodo = createAction('[Todo] Delete Todo', props<{ docID: string }>());
export const deleteTodoSuccess = createAction('[Todo] Delete Todo Success', props<{ docID: string }>());

export const bulkDeleteTodo = createAction('[Todo] Bulk Delete Todo', props<{ docIDs: string[] }>());
export const bulkDeleteTodoSuccess = createAction('[Todo] Bulk Delete Todo Success', props<{ docIDs: string[] }>());
export const getTodos = createAction('[Todo] Get Todos');
export const getTodosSuccess = createAction('[Todo] Get Todos Success', props<{ todos: Todo[] }>());

export const setTodosLoading = createAction('[Todo] Set Todos Loading',
  props<{isLoading: boolean}>()
);
