import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TodoState } from '../reducers/todo.reducer';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectAllTodos = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos
);
