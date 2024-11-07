import { Component, EventEmitter, Output } from '@angular/core';
import { Todo } from '../../../../shared/interfaces/todo';
import { MatCard } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    FormsModule,
    MatInput,
    MatCard,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatDatepicker,
    MatButton
  ],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss'
})
export class TodoFormComponent {
  newTodo: Partial<Todo> = { description: '', dueDate: null, completed: false, creationDate: new Date(), completionDate: null };

  @Output() saveTodo = new EventEmitter<Todo>();

  onSave() {
    this.saveTodo.emit({ ...this.newTodo, creationDate: new Date() } as Todo);
    this.newTodo = { description: '', dueDate: null, completed: false, creationDate: new Date(), completionDate: null };
  }
}
