import { Component, OnInit } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Todo } from '../../../shared/interfaces/todo';
import { todosLoadingSelector, todosSelector } from '../../../store/selectors/todo';
import { Store } from '@ngrx/store';
import { addTodo, deleteTodo, setTodosLoading, updateTodo } from '../../../store/actions/todo';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [
    CommonModule,
    TodoFormComponent,
    TodoListComponent,
    AsyncPipe,
    LoaderComponent
  ],
  templateUrl: './todo-page.component.html',
  styleUrl: './todo-page.component.scss'
})
export class TodoPageComponent {
  todos$: Observable<Todo[]> = this.store.select(todosSelector);
  isLoading$: Observable<boolean> = this.store.select(todosLoadingSelector);
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
