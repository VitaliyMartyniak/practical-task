import { createAction, props } from '@ngrx/store';
import { Todo } from '../../shared/interfaces/todo';

export const addTodo = createAction('[Todo] Add Todo', props<{ todo: Todo }>());
export const updateTodo = createAction('[Todo] Update Todo', props<{ todo: Todo }>());
export const deleteTodo = createAction('[Todo] Delete Todo', props<{ id: string }>());
export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
