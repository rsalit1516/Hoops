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

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Director } from '@app/domain/director';
import { DirectorService } from '@app/services/director.service';
import { LoggerService } from '@app/services/logger.service';

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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule
],
  templateUrl: './director-form.html',
  styleUrls: [
    './director-form.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ],
})
export class DirectorForm implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private directorService = inject(DirectorService);
  private logger = inject(LoggerService);

  @Input() director?: Director | null;
  @Output() save = new EventEmitter<Director>();
  @Output() cancel = new EventEmitter<void>();
  @Output() delete = new EventEmitter<Director>();

  saving = signal(false);
  volunteers = signal<Director[]>([]);

  form = this.fb.group({
    directorId: [0],
    companyId: [1],
    personId: [0, Validators.required],
    seq: [0],
    name: [''],
    title: ['', Validators.required],
    createdDate: [new Date()],
    createdUser: [''],
  });

  // Field definitions for the dynamic form template
  fields: FormField[] = [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Enter title' },
    {
      key: 'seq',
      label: 'Sequence',
      type: 'number',
      placeholder: 'Display order',
    },
  ];

  ngOnInit() {
    // Load volunteers for the dropdown
    this.directorService.getDirectorVolunteers().subscribe({
      next: (volunteers) => {
        this.volunteers.set(volunteers);
      },
      error: (error) => {
        this.logger.error('Failed to load director volunteers', error);
      }
    });

    if (this.director) {
      this.form.patchValue(this.director);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['director'] && this.director) {
      this.form.patchValue(this.director);
    }
  }

  onVolunteerSelected(personId: number) {
    const selectedVolunteer = this.volunteers().find(v => v.personId === personId);
    if (selectedVolunteer) {
      this.form.patchValue({
        personId: selectedVolunteer.personId,
        name: selectedVolunteer.name
      });
    }
  }

  onSubmit() {
    this.logger.debug('DirectorForm.onSubmit called');
    this.logger.debug('Form valid:', this.form.valid);
    this.logger.debug('Form value:', this.form.value);

    if (this.form.valid) {
      this.logger.info('Emitting save event with:', this.form.value);
      this.save.emit(this.form.value as Director);
    } else {
      this.logger.error('Form is invalid!', this.form.value);
      // Log which fields are invalid
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control && control.invalid) {
          this.logger.error(`Field '${key}' is invalid:`, control.errors);
        }
      });
    }
  }

  onCancelClick() {
    this.cancel.emit();
  }

  onDeleteClick() {
    if (this.director && this.director.directorId) {
      this.delete.emit(this.director);
    }
  }
}
