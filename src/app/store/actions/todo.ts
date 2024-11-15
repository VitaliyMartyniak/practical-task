import { createAction, props } from '@ngrx/store';
import { Todo } from '../../shared/interfaces/todo';

export const addTodo = createAction('[Todo] Add Todo', props<{ todo: Todo }>());
export const addTodoSuccess = createAction('[Todo] Add Todo Success', props<{ todo: Todo, docID: string }>());
export const addTodoFailure = createAction('[Todo] Add Todo Failure', props<{ error: Error }>());

export const updateTodo = createAction('[Todo] Update Todo', props<{ todo: Todo }>());
export const deleteTodo = createAction('[Todo] Delete Todo', props<{ id: string }>());
// export const getTodos = createAction('[Todo] Get Todos');
// export const getTodosSuccess = createAction('[Todo] Get Todos Success', props<{ todos: Todo[] }>());

export const setTodosLoading = createAction('[Todo] Set Todos Loading',
  props<{isLoading: boolean}>()
);
