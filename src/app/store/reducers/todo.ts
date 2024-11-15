import { createReducer, on } from '@ngrx/store';
import * as TodoActions from '../actions/todo';
import { Todo } from '../../shared/interfaces/todo';

export interface TodoState {
  todos: Todo[];
  isLoading: boolean;
}

const initialState: TodoState = {
  todos: [],
  isLoading: false,
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.addTodoSuccess, (state, { todo, docID }) => ({
    ...state,
    todos: [...state.todos, { ...todo, docID }]
  })),
  on(TodoActions.setTodosLoading, (state, {isLoading}) => {
    return {
      ...state,
      isLoading,
    }
  }),
  // on(TodoActions.updateTodo, (state, { todo }) => ({
  //   ...state,
  //   todos: state.todos.map(t => t.id === todo.id ? { ...t, ...todo } : t)
  // })),
  // on(TodoActions.deleteTodo, (state, { id }) => ({
  //   ...state,
  //   todos: state.todos.filter(t => t.id !== id)
  // })),
  // on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
  //   ...state,
  //   todos
  // }))
);
