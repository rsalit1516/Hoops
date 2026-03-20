import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  model,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime } from 'rxjs';
import { AlphabeticalSearch } from '@app/admin/admin-shared/alphabetical-search/alphabetical-search';
import { LoggerService } from '@app/services/logger.service';

// Interface for filter data structure
export interface HouseholdFilterCriteria {
  searchText?: string;
  letter?: string;
  email?: string;
  phone?: string;
}

@Component({
  selector: 'csbc-household-filters',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    AlphabeticalSearch,
  ],
  templateUrl: './household-filters.html',
  styleUrls: [
    './household-filters.scss',
    '../../../shared/scss/cards.scss',
    '../../../shared/scss/forms.scss',
  ],
})
export class HouseholdFilters implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private logger = inject(LoggerService);

  @Input() filters: HouseholdFilterCriteria = {};
  @Output() filterChange = new EventEmitter<HouseholdFilterCriteria>();

  selectedLetter = model<string>('A');

  filterForm = this.fb.group({
    searchText: [''],
    email: [''],
    phone: [''],
  });

  constructor() {
    // React to letter changes
    effect(() => {
      const letter = this.selectedLetter();
      this.logger.info('Household filter letter changed:', letter);
      this.emitFilters();
    });
  }

  ngOnInit() {
    // Apply initial filters
    if (this.filters) {
      this.filterForm.patchValue(this.filters);
      if (this.filters.letter) {
        this.selectedLetter.set(this.filters.letter);
      }
    }

    // Emit on form changes (with debounce for text inputs)
    this.filterForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.emitFilters());

    // Emit initial filters to trigger search with 'A'
    this.emitFilters();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters'] && !changes['filters'].firstChange) {
      this.filterForm.patchValue(this.filters, { emitEvent: false });
      if (this.filters.letter) {
        this.selectedLetter.set(this.filters.letter);
      }
    }
  }

  emitFilters() {
    const filters: HouseholdFilterCriteria = {};
    const formValue = this.filterForm.value;

    // Always include letter if set
    const letter = this.selectedLetter();
    if (letter) {
      filters.letter = letter;
    }

    if (formValue.searchText) filters.searchText = formValue.searchText;
    if (formValue.email) filters.email = formValue.email;
    if (formValue.phone) filters.phone = formValue.phone;

    this.logger.info('Emitting household filters:', filters);
    this.filterChange.emit(filters);
  }

  clearFilters() {
    this.filterForm.reset({
      searchText: '',
      email: '',
      phone: '',
    });
    this.selectedLetter.set('A');
  }

  get hasActiveFilters(): boolean {
    const value = this.filterForm.value;
    const letter = this.selectedLetter();
    return !!(
      value.searchText ||
      value.email ||
      value.phone ||
      (letter && letter !== 'A')
    );
  }
}
