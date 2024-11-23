import { Component, OnInit } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { Todo } from '../../../shared/interfaces/todo';
import { selectFilteredAndSortedTodos, todosLoadingSelector } from '../../../store/selectors/todo';
import { Store } from '@ngrx/store';
import { addTodo, bulkDeleteTodo, deleteTodo, getTodos, setFilters, setSortOrder, updateSearchQuery, updateTodos } from '../../../store/actions/todo';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { TodoUpdateModalComponent } from './components/todo-update-modal/todo-update-modal.component';
import { SortBy, SortOrder } from '../../../shared/interfaces/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TodoFilters } from '../../../shared/interfaces/todo-filters';

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
  todos$: Observable<Todo[]> = this.store.select(selectFilteredAndSortedTodos);
  sortBy: SortBy | null = null;
  sortOrder: SortOrder | null = null;
  filters: TodoFilters = {};
  searchQuery: string = ''; // Local searchQuery variable
  isLoading$: Observable<boolean> = this.store.select(todosLoadingSelector);

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllTodos();
    this.route.queryParams
      .pipe(
        take(1),
        map((params) => ({
          sortBy: params['sortBy'] || null,
          sortOrder: params['sortOrder'] || null,
          filters: {
            completed: params['completed']
              ? params['completed'].split(',').map((v: string) => v === 'true')
              : [true, false],
          },
          searchQuery: params['search'] || '',
        }))
      )
      .subscribe(({ sortBy, sortOrder, filters, searchQuery }) => {
        this.sortBy = sortBy as SortBy | null;
        this.sortOrder = sortOrder as SortOrder | null;
        this.filters = filters;
        this.searchQuery = searchQuery;

        this.store.dispatch(setSortOrder({ sortBy: this.sortBy, sortOrder: this.sortOrder }));
        this.store.dispatch(setFilters({ filters: this.filters }));
        this.store.dispatch(updateSearchQuery({ query: this.searchQuery }));
      });
  }

  onRouterAndStoreUpdate(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sortBy: this.sortBy || undefined,
        sortOrder: this.sortOrder || undefined,
        completed: this.filters['completed']?.join(',') || undefined,
        search: this.searchQuery || undefined,
      },
      queryParamsHandling: 'merge',
    });

    this.store.dispatch(setSortOrder({ sortBy: this.sortBy, sortOrder: this.sortOrder }));
    this.store.dispatch(setFilters({ filters: this.filters }));
    this.store.dispatch(updateSearchQuery({ query: this.searchQuery })); // Update store
  }

  toggleFilter(filterKey: keyof TodoFilters, value: boolean, event: any): void {
    const target = event.target as HTMLInputElement;

    const currentFilter: boolean[] = this.filters[filterKey] || [];

    if (target.checked) {
      this.filters = {
        ...this.filters,
        [filterKey]: currentFilter.includes(value) ? [...currentFilter] : [...currentFilter, value],
      };
    } else {
      this.filters = {
        ...this.filters,
        [filterKey]: currentFilter.filter((item) => item !== value),
      };
    }
    this.onRouterAndStoreUpdate();
  }

  onSearch(event: any): void {
    this.searchQuery = event.target.value;
    this.onRouterAndStoreUpdate();
  }

  onSortChange(): void {
    this.onRouterAndStoreUpdate();
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

