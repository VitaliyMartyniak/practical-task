import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CommonModule } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { PrioritiesEnum } from '../../../../../shared/enums/priorities';
import { Todo } from '../../../../../shared/interfaces/todo';
import { CustomValidators } from '../../../../../shared/custom-validators/custom-validators';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    MatCard,
    MatButton,
    MatMomentDateModule,
    MatButton,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss'
})
export class TodoFormComponent implements OnInit {
  priorities: {label: string, value: PrioritiesEnum}[] = [
    { label: 'Low', value: PrioritiesEnum.LOW },
    { label: 'Medium', value: PrioritiesEnum.MEDIUM },
    { label: 'High', value: PrioritiesEnum.HIGH }
  ]
  form!: FormGroup;
  tomorrow = new Date();

  @Output() saveTodo = new EventEmitter<Todo>();

  ngOnInit(): void {
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);

    this.form = new FormGroup({
      description: new FormControl('', [
        Validators.required, Validators.pattern(/\S+/)
      ]),
      dueDate: new FormControl(this.tomorrow, [
        Validators.required,
      ]),
      priority: new FormControl(PrioritiesEnum.LOW, [
        Validators.required,
      ]),
    }, [CustomValidators.dateValidator]);
  }

  onSave(): void {
    if (this.form.valid) {
      const newTodo = {
        completed: false,
        ...this.form.value,
        creationDate: new Date(),
        completionDate: null
      }
      this.saveTodo.emit(newTodo);
      this.form.reset();
      this.form.get('dueDate')?.setValue(this.tomorrow)
      this.form.get('priority')?.setValue(PrioritiesEnum.LOW)
    }
  }
}
