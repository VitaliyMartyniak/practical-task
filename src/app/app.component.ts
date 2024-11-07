import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { todoReducer } from './store/reducers/todo.reducer';
import { TodoPageComponent } from './views/todo-page/todo-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TodoPageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'practical-task';
}
