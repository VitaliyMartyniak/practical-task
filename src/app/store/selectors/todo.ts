import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TodoState } from '../reducers/todo';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const todosSelector = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos
);
export const todosLoadingSelector = createSelector(
  selectTodoState,
  state => state.isLoading
);

