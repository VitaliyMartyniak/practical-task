import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../../../shared/interfaces/todo';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { MatCard } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    TodoItemComponent,
    MatCard,
    MatList,
    MatListItem,
    NgForOf
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Output() deleteTodo = new EventEmitter<string>();
  @Output() updateTodo = new EventEmitter<Todo>();

  onDelete(id: string) {
    this.deleteTodo.emit(id);
  }

  onToggleComplete(todo: Todo) {
    this.updateTodo.emit({ ...todo, completed: !todo.completed, completionDate: todo.completed ? null : new Date() });
  }
}
