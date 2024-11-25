import { createAction, props } from '@ngrx/store';
import { Todo } from '../../shared/interfaces/todo';
import { SortBy, SortOrder } from '../../shared/interfaces/sort';
import { TodoFilters } from '../../shared/interfaces/todo-filters';

export const addTodo = createAction('[TODO] Add Todo', props<{ todo: Todo }>());
export const addTodoSuccess = createAction('[TODO] Add Todo Success', props<{ todo: Todo, docID: string }>());

export const updateTodos = createAction('[TODO] Update Todo', props<{ todos: Todo[] }>());
export const updateTodosSuccess = createAction('[TODO] Update Todo Success', props<{ todos: Todo[] }>());

export const deleteTodo = createAction('[TODO] Delete Todo', props<{ docID: string }>());
export const deleteTodoSuccess = createAction('[TODO] Delete Todo Success', props<{ docID: string }>());

export const bulkDeleteTodo = createAction('[TODO] Bulk Delete Todo', props<{ docIDs: string[] }>());
export const bulkDeleteTodoSuccess = createAction('[TODO] Bulk Delete Todo Success', props<{ docIDs: string[] }>());

export const getTodos = createAction('[TODO] Get Todos');
export const getTodosSuccess = createAction('[TODO] Get Todos Success', props<{ todos: Todo[] }>());

export const setSortOrder = createAction('[TODO] Set Sort Order', props<{ sortBy: SortBy | null, sortOrder: SortOrder | null }>());
export const setFilters = createAction('[TODO] Set Filters', props<{ filters: TodoFilters}>());
export const setSearchQuery = createAction('[TODO] Set Search Query', props<{ query: string}>());
export const updateSearchQuery = createAction('[TODO] Update Search Query', props<{ query: string }>()
);

export const setTodosLoading = createAction('[TODO] Set Todos Loading', props<{isLoading: boolean}>());
