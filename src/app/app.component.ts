import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoPageComponent } from './portal/views/todo-page/todo-page.component';
import { Store } from '@ngrx/store';
import { selectIsLightMode } from './store/selectors/theme';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TodoPageComponent,
    CommonModule,
    AsyncPipe,
    MatButton
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isLightMode$ = this.store.select(selectIsLightMode);

  constructor(private store: Store) {}
}
