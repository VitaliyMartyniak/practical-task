import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Todo } from '../../../../../shared/interfaces/todo';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { NgForOf } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DataCollectorFormComponent } from './components/data-collector-form/data-collector-form.component';

@Component({
  selector: 'app-todo-update-modal',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatDialogActions,
    MatButton,
    MatInput,
    MatLabel,
    FormsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    NgForOf,
    ReactiveFormsModule,
    DataCollectorFormComponent
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './todo-update-modal.component.html',
  styleUrl: './todo-update-modal.component.scss'
})
export class TodoUpdateModalComponent implements OnInit {
  dataCollectorForm!: FormGroup;
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TodoUpdateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { todos: Todo[] }
  ) {}

  onCancel() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.dataCollectorForm = this.fb.group({
      forms: this.fb.array([]),
    });
    this.data.todos.forEach(todo => {
      const formGroup = this.fb.group({
        description: [todo.description, [Validators.required]],
        dueDate: [todo.dueDate, [Validators.required]],
        priority: [todo.priority, [Validators.required]],
      });
      this.forms.push(formGroup);
    })
  }

  getItemFormGroup(index: number): FormGroup {
    return this.forms.at(index) as FormGroup;
  }

  get forms(): FormArray {
    return this.dataCollectorForm.get('forms') as FormArray;
  }

  onSubmit(): void {
    const updatedTodos = this.dataCollectorForm.value.forms.map((updatedForm: any, index: number) => {
      return {
        ...this.data.todos[index],
        ...updatedForm
      };
    });

    this.dialogRef.close(updatedTodos);
  }
}
