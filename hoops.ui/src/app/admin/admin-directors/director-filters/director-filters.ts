import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime } from 'rxjs';

// Interface for filter data structure
export interface DirectorFilterCriteria {
  searchText?: string;
}

@Component({
  selector: 'csbc-director-filters',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './director-filters.html',
  styleUrls: ['./director-filters.scss',
      '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss']

})
export class DirectorFilters implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() filters: DirectorFilterCriteria = {};
  @Output() filterChange = new EventEmitter<DirectorFilterCriteria>();

  filterForm = this.fb.group({
    searchText: [''],
  });

  ngOnInit() {
    // Apply initial filters
    if (this.filters) {
      this.filterForm.patchValue(this.filters);
    }

    // Emit on changes (with debounce for search)
    this.filterForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.emitFilters());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters'] && !changes['filters'].firstChange) {
      this.filterForm.patchValue(this.filters, { emitEvent: false });
    }
  }

  emitFilters() {
    const filters: DirectorFilterCriteria = {};
    const formValue = this.filterForm.value;

    if (formValue.searchText) filters.searchText = formValue.searchText;

    this.filterChange.emit(filters);
  }

  clearFilters() {
    this.filterForm.reset({
      searchText: '',
    });
  }

  get hasActiveFilters(): boolean {
    const value = this.filterForm.value;
    return !!(value.searchText);
  }
}
