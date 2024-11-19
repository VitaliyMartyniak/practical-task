import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TodoState } from '../reducers/todo';
import { SortBy, SortOrder } from '../../shared/interfaces/sort';
import { PrioritiesEnum } from '../../shared/enums/priorities';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const todosSelector = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos
);
export const sortBySelector = createSelector(
  selectTodoState,
  (state: TodoState) => state.sortBy
);
export const sortOrderSelector = createSelector(
  selectTodoState,
  (state: TodoState) => state.sortOrder
);
export const todosLoadingSelector = createSelector(
  selectTodoState,
  state => state.isLoading
);

export const selectSortedTodos = createSelector(
  selectTodoState,
  (state) => {
    if (!state.sortBy || !state.sortOrder) {
      return state.todos;
    }

    return [...state.todos].sort((a, b) => {
      let valueA: any, valueB: any;

      switch (state.sortBy) {
        case SortBy.DueDate:
          valueA = a.dueDate ? new Date(a.dueDate).getTime() : null;
          valueB = b.dueDate ? new Date(b.dueDate).getTime() : null;

          if (valueA === null && valueB === null) return 0;
          if (valueA === null) return state.sortOrder === SortOrder.Ascending ? 1 : -1;
          if (valueB === null) return state.sortOrder === SortOrder.Ascending ? -1 : 1;
          break;
        case SortBy.Priority:
          const priorityMap: Record<PrioritiesEnum, number> = {
            [PrioritiesEnum.LOW]: 1,
            [PrioritiesEnum.MEDIUM]: 2,
            [PrioritiesEnum.HIGH]: 3,
          };

          valueA = priorityMap[a.priority];
          valueB = priorityMap[b.priority];
          break;
        case SortBy.Completed:
          valueA = a.completed ? 1 : 0;
          valueB = b.completed ? 1 : 0;
          break;
      }

      return state.sortOrder === SortOrder.Ascending ? valueA - valueB : valueB - valueA;
    });
  }
);
