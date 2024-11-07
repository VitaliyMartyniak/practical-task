import { createReducer, on } from '@ngrx/store';
import * as TodoActions from '../actions/todo.actions';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from '../../shared/interfaces/todo'; // Add UUID for unique IDs

export interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: []
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.addTodo, (state, { todo }) => ({
    ...state,
    todos: [...state.todos, { ...todo, id: uuidv4(), creationDate: new Date() }]
  })),
  on(TodoActions.updateTodo, (state, { todo }) => ({
    ...state,
    todos: state.todos.map(t => t.id === todo.id ? { ...t, ...todo } : t)
  })),
  on(TodoActions.deleteTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(t => t.id !== id)
  })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos
  }))
);
