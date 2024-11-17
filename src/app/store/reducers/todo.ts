import { createReducer, on } from '@ngrx/store';
import * as TodoActions from '../actions/todo';
import { Todo } from '../../shared/interfaces/todo';
import { updateTodosSuccess } from '../actions/todo';

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
);
