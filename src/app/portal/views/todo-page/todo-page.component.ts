import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Todo } from '../../../shared/interfaces/todo';
import { selectSortedTodos, todosLoadingSelector } from '../../../store/selectors/todo';
import { Store } from '@ngrx/store';
import { addTodo, bulkDeleteTodo, deleteTodo, getTodos, setSortOrder, updateTodos } from '../../../store/actions/todo';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { TodoUpdateModalComponent } from './components/todo-update-modal/todo-update-modal.component';
import { SortBy, SortOrder } from '../../../shared/interfaces/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
    FormsModule
  ],
  templateUrl: './todo-page.component.html',
  styleUrl: './todo-page.component.scss'
})
export class TodoPageComponent implements OnInit {
  protected readonly SortBy = SortBy;
  protected readonly SortOrder = SortOrder;
  todos$: Observable<Todo[]> = this.store.select(selectSortedTodos);
  sortBy: SortBy | null = null;
  sortOrder: SortOrder | null = null;
  isLoading$: Observable<boolean> = this.store.select(todosLoadingSelector);

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllTodos();
    this.route.queryParams
      .pipe(map(params => ({
        sortBy: params['sortBy'] || null,
        sortOrder: params['sortOrder'] || null
      })))
      .subscribe(({ sortBy, sortOrder }) => {
        this.sortBy = sortBy ? sortBy : null;
        this.sortOrder = sortOrder ? sortOrder : null;
        this.store.dispatch(setSortOrder({ sortOrder: this.sortOrder, sortBy: this.sortBy }));
      });
  }

  onSortChange(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sortBy: this.sortBy, sortOrder: this.sortOrder },
      queryParamsHandling: 'merge'
    });

    this.store.dispatch(setSortOrder({ sortOrder: this.sortOrder, sortBy: this.sortBy }));
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
