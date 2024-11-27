import { createReducer, on } from '@ngrx/store';
import * as TodoActions from '../actions/todo';
import { Todo } from '../../shared/interfaces/todo';
import { setSearchQuery, setSortOrder, updateTodosSuccess } from '../actions/todo';
import { SortBy, SortOrder } from '../../shared/interfaces/sort';
import { TodoFilters } from '../../shared/interfaces/todo-filters';

export interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  sortBy: SortBy | null;
  sortOrder: SortOrder | null;
  filters: TodoFilters;
  searchQuery: string;
}

const initialState: TodoState = {
  todos: [],
  isLoading: false,
  sortBy: null,
  sortOrder: null,
  filters: {
    completed: [true, false],
  },
  searchQuery: ''
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.getTodosSuccess, (state, { todos }) => ({
    ...state,
    todos
  })),
  on(TodoActions.addTodoSuccess, (state, { todo, docID }) => ({
    ...state,
    todos: [...state.todos, { ...todo, docID }]
  })),
  on(updateTodosSuccess, (state, { todos }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todos.find(updatedTodo => updatedTodo.docID === todo.docID) || todo
    ),
  })),
  on(TodoActions.deleteTodoSuccess, (state, { docID }) => ({
    ...state,
    todos: state.todos.filter(t => t.docID !== docID)
  })),
  on(TodoActions.bulkDeleteTodoSuccess, (state, { docIDs }) => ({
    ...state,
    todos: state.todos.filter(t => !docIDs.includes(t.docID))
  })),
  on(TodoActions.setTodosLoading, (state, {isLoading}) => ({
    ...state,
    isLoading,
  })),
  on(TodoActions.setSortOrder, (state, { sortBy, sortOrder }) => ({
    ...state,
    sortBy,
    sortOrder
  })),
  on(TodoActions.setFilters, (state, { filters }) => ({
    ...state,
    filters,
  })),
  on(TodoActions.setSearchQuery, (state, { query }) => ({
    ...state,
    searchQuery: query,
  })),
  on(TodoActions.cleanupTodoStore, () => {
    return {
      ...initialState
    }
  }),
);
