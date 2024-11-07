import { Component, OnInit } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Todo } from '../../shared/interfaces/todo';
import { selectAllTodos } from '../../store/selectors/todo.selectors';
import { Store } from '@ngrx/store';
import { addTodo, deleteTodo, updateTodo } from '../../store/actions/todo.actions';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [
    TodoFormComponent,
    TodoListComponent,
    AsyncPipe
  ],
  templateUrl: './todo-page.component.html',
  styleUrl: './todo-page.component.scss'
})
export class TodoPageComponent {
  todos$: Observable<Todo[]> = this.store.select(selectAllTodos);
  // todos$: Observable<Todo[]> = of([]);

  constructor(private store: Store) {}

  // todos$!: Observable<Todo[]>;
  //
  // constructor(private store: Store) {}
  //
  // ngOnInit(): void {
  //   this.todos$ = of([]);
  // }

  onSave(todo: Todo) {
    this.store.dispatch(addTodo({ todo }));
  }

  onDelete(id: string) {
    this.store.dispatch(deleteTodo({ id }));
  }

  onUpdate(todo: Todo) {
    this.store.dispatch(updateTodo({ todo }));
  }
}
