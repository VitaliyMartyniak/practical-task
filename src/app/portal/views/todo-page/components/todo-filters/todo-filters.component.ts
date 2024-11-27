import { Component, OnInit } from '@angular/core';
import { SortBy, SortOrder } from '../../../../../shared/interfaces/sort';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { setFilters, setSearchQuery, setSortOrder, updateSearchQuery } from '../../../../../store/actions/todo';
import { TodoFilters } from '../../../../../shared/interfaces/todo-filters';
import { map, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-filters',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatCheckbox,
    FormsModule,
  ],
  templateUrl: './todo-filters.component.html',
  styleUrl: './todo-filters.component.scss'
})
export class TodoFiltersComponent implements OnInit {
  sortBy: SortBy | null = null;
  sortOrder: SortOrder | null = null;
  filters: TodoFilters = {};
  searchQuery: string = '';

  protected readonly SortOrder = SortOrder;
  protected readonly SortBy = SortBy;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
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
        this.store.dispatch(setSearchQuery({ query: this.searchQuery }));
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
    this.store.dispatch(updateSearchQuery({ query: this.searchQuery }));
  }

  toggleFilter(filterKey: keyof TodoFilters, value: boolean, event: MatCheckboxChange): void {
    const currentFilter: boolean[] = this.filters[filterKey] || [];

    if (event.checked) {
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
}
