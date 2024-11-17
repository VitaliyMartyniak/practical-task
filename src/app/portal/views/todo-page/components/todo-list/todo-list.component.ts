import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../../../../shared/interfaces/todo';
import { MatCard } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable } from '@angular/material/table';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { TodoUpdateModalComponent } from '../todo-update-modal/todo-update-modal.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    MatCard,
    MatList,
    MatListItem,
    NgForOf,
    DatePipe,
    MatCheckbox,
    MatIcon,
    MatIconButton,
    NgIf,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatButton,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatFormField,
    FormsModule,
    MatInput,
    MatLabel
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Output() deleteTodo = new EventEmitter<string>();
  @Output() bulkDeleteTodo = new EventEmitter<string[]>();
  @Output() updateTodos = new EventEmitter<Todo[]>();

  displayedColumns: string[] = [
    'select',
    'description',
    'dueDate',
    'creationDate',
    'completed',
    'completionDate',
    'priority',
    'actions',
  ];

  selection: Set<string> = new Set();

  constructor(private dialog: MatDialog) {
  }

  openUpdateModal(id?: string) {
    let selectedTodos: Todo[];
    if (id) {
      const neededTodo = this.todos.find(todo => todo.docID === id)!;
      selectedTodos = [neededTodo];
    } else {
      selectedTodos = this.todos.filter(todo => this.selection.has(todo.docID));
    }
    const dialogRef = this.dialog.open(TodoUpdateModalComponent, {
      width: '400px',
      data: { todos: selectedTodos },
    });

    dialogRef.afterClosed().subscribe((updatedTodos: Todo[] | undefined) => {
      if (updatedTodos) {
        this.updateTodos.emit(updatedTodos);
        this.selection.clear();
      }
    });
  }

  toggleSelection(id: string) {
    if (this.selection.has(id)) {
      this.selection.delete(id);
    } else {
      this.selection.add(id);
    }
  }

  selectAll() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.todos.forEach(todo => this.selection.add(todo.docID));
    }
  }

  isAllSelected(): boolean {
    return this.todos.length > 0 && this.todos.every(todo => this.selection.has(todo.docID));
  }

  bulkDelete() {
    const todosToDelete = this.todos.filter(todo => this.selection.has(todo.docID));
    this.bulkDeleteTodo.emit(todosToDelete.map(todo => todo.docID))
    this.selection.clear();
  }

  triggerDeleteTodo(docID: string) {
    this.deleteTodo.emit(docID)
  }

  onToggleComplete(todo: Todo) {
    // this.updateTodos.emit({ ...todo, completed: !todo.completed, completionDate: todo.completed ? null : new Date() });
  }
}
