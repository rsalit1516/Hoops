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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { debounceTime } from 'rxjs';
import { AlphabeticalSearch } from '@app/admin/admin-shared/alphabetical-search/alphabetical-search';
import { LoggerService } from '@app/services/logger.service';
import { peopleSearchCriteria } from '@app/services/people.service';

// Interface for filter data structure (extends peopleSearchCriteria)
export interface PeopleFilterCriteria extends peopleSearchCriteria {
  letter?: string;
}

@Component({
  selector: 'csbc-people-filters',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    AlphabeticalSearch,
  ],
  templateUrl: './people-filters.html',
  styleUrls: [
    './people-filters.scss',
    '../../../shared/scss/cards.scss',
    '../../../shared/scss/forms.scss',
  ],
})
export class PeopleFilters implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private logger = inject(LoggerService);

  @Input() filters: PeopleFilterCriteria = {
    lastName: '',
    firstName: '',
    playerOnly: false,
  };
  @Output() filterChange = new EventEmitter<PeopleFilterCriteria>();

  selectedLetter = model<string>('A');

  filterForm = this.fb.group({
    firstName: [''],
    playerOnly: [false],
  });

  constructor() {
    // React to letter changes
    effect(() => {
      const letter = this.selectedLetter();
      this.logger.info('People filter letter changed:', letter);
      this.emitFilters();
    });
  }

  ngOnInit() {
    // Apply initial filters
    if (this.filters) {
      this.filterForm.patchValue({
        firstName: this.filters.firstName,
        playerOnly: this.filters.playerOnly,
      });
      if (this.filters.letter) {
        this.selectedLetter.set(this.filters.letter);
      } else if (this.filters.lastName && this.filters.lastName.length === 1) {
        this.selectedLetter.set(this.filters.lastName);
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
    const formValue = this.filterForm.value;
    const letter = this.selectedLetter();

    const filters: PeopleFilterCriteria = {
      lastName: letter || '',
      firstName: formValue.firstName || '',
      playerOnly: formValue.playerOnly || false,
      letter: letter,
    };

    this.logger.info('Emitting people filters:', filters);
    this.filterChange.emit(filters);
  }

  clearFilters() {
    this.filterForm.reset({
      firstName: '',
      playerOnly: false,
    });
    this.selectedLetter.set('A');
  }

  get hasActiveFilters(): boolean {
    const value = this.filterForm.value;
    const letter = this.selectedLetter();
    return !!(
      value.firstName ||
      value.playerOnly ||
      (letter && letter !== 'A')
    );
  }
}
