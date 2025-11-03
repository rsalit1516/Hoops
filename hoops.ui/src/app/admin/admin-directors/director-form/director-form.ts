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
import { FormBuilder, Validators } from '@angular/forms';
import { Person } from '@app/domain/person';

@Component({
  selector: 'csbc-director-form',
  imports: [],
  templateUrl: './director-form.html',
  styleUrl: './director-form.scss',
})
export class DirectorForm implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() person?: Person;
  @Output() save = new EventEmitter<Person>();
  @Output() cancel = new EventEmitter<void>();

  saving = signal(false);

  form = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    active: [true],
  });

  ngOnInit() {
    if (this.person) {
      this.form.patchValue(this.person);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['person'] && this.person) {
      this.form.patchValue(this.person);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value as Person);
    }
  }

  onCancelClick() {
    this.cancel.emit();
  }
}
