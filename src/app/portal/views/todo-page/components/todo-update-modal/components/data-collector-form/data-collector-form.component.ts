import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgForOf, NgIf } from '@angular/common';
import { PrioritiesEnum } from '../../../../../../../shared/enums/priorities';

@Component({
  selector: 'app-data-collector-form',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        MatFormField,
        MatInput,
        MatLabel,
        MatSuffix,
        NgForOf,
        ReactiveFormsModule,
        MatError,
        NgIf
    ],
  templateUrl: './data-collector-form.component.html',
  styleUrl: './data-collector-form.component.scss'
})
export class DataCollectorFormComponent {
  @Input() formGroup!: FormGroup;

  priorities: {label: string, value: PrioritiesEnum}[] = [
    { label: 'Low', value: PrioritiesEnum.LOW },
    { label: 'Medium', value: PrioritiesEnum.MEDIUM },
    { label: 'High', value: PrioritiesEnum.HIGH }
  ]
}
