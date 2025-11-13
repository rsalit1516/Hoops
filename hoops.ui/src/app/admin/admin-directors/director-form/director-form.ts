import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Director } from '@app/domain/director';

// Interface for form field definitions
interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  options?: { value: any; label: string }[];
}

@Component({
  selector: 'csbc-director-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './director-form.html',
  styleUrl: './director-form.scss',
})
export class DirectorForm implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() director?: Director | null;
  @Output() save = new EventEmitter<Director>();
  @Output() cancel = new EventEmitter<void>();

  saving = signal(false);

  form = this.fb.group({
    directorId: [0],
    companyId: [1],
    peopleId: [0],
    seq: [0],
    name: ['', Validators.required],
    title: ['', Validators.required],
    createdDate: [new Date()],
    createdUser: [''],
  });

  // Field definitions for the dynamic form template
  fields: FormField[] = [
    { key: 'name', label: 'Name', type: 'text', placeholder: 'Enter name' },
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Enter title' },
    { key: 'seq', label: 'Sequence', type: 'number', placeholder: 'Display order' },
  ];

  ngOnInit() {
    if (this.director) {
      this.form.patchValue(this.director);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['director'] && this.director) {
      this.form.patchValue(this.director);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value as Director);
    }
  }

  onCancelClick() {
    this.cancel.emit();
  }
}
