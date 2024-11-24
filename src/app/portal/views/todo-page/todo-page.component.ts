import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../../../shared/interfaces/todo';
import { selectFilteredAndSortedTodos, todosLoadingSelector } from '../../../store/selectors/todo';
import { Store } from '@ngrx/store';
import { addTodo, bulkDeleteTodo, deleteTodo, getTodos, updateTodos } from '../../../store/actions/todo';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { TodoUpdateModalComponent } from './components/todo-update-modal/todo-update-modal.component';
import { FormsModule } from '@angular/forms';
import { TodoFiltersComponent } from './components/todo-filters/todo-filters.component';

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [
    CommonModule,
    TodoFormComponent,
    TodoListComponent,
    AsyncPipe,
    LoaderComponent,
    TodoUpdateModalComponent,
    FormsModule,
    TodoFiltersComponent
  ],
  templateUrl: './todo-page.component.html',
  styleUrl: './todo-page.component.scss'
})
export class TodoPageComponent implements OnInit {
  todos$: Observable<Todo[]> = this.store.select(selectFilteredAndSortedTodos);
  isLoading$: Observable<boolean> = this.store.select(todosLoadingSelector);

  constructor(
    private store: Store
  ) {}

  ngOnInit(): void {
    this.getAllTodos();
  }

  getAllTodos() {
    this.store.dispatch(getTodos());
  }

  onSave(todo: Todo) {
    this.store.dispatch(addTodo({ todo }));
  }

  onDelete(docID: string) {
    this.store.dispatch(deleteTodo({ docID }));
  }

  onBulkDelete(docIDs: string[]) {
    this.store.dispatch(bulkDeleteTodo({ docIDs }));
  }

  onUpdate(todos: Todo[]) {
    this.store.dispatch(updateTodos({ todos }));
  }
}

