import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoPageComponent } from './portal/views/todo-page/todo-page.component';

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
