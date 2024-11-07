import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../../../../../shared/interfaces/todo';
import { MatIcon } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { DatePipe, NgIf } from '@angular/common';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    MatIcon,
    MatCheckbox,
    NgIf,
    DatePipe,
    MatIconButton
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss'
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() deleteTodo = new EventEmitter<string>();
  @Output() toggleComplete = new EventEmitter<void>();

  toggleCompleteTrigger() {
    this.toggleComplete.emit();
  }
}
