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
import { FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { debounceTime } from 'rxjs';

// Interface for filter data structure
export interface DirectorFilterCriteria {
  searchText?: string;
  active?: boolean | null;
  role?: string;
}

@Component({
  selector: 'csbc-director-filters',
  imports: [MatCardModule],
  templateUrl: './director-filters.html',
  styleUrl: './director-filters.scss',
})
export class DirectorFilters implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() filters: DirectorFilterCriteria = {};
  @Output() filterChange = new EventEmitter<DirectorFilterCriteria>();

  filterForm = this.fb.group({
    searchText: [''],
    active: [null as boolean | null],
    role: [''],
  });

  roles = [
    { value: '', label: 'All Roles' },
    { value: 'player', label: 'Player' },
    { value: 'coach', label: 'Coach' },
    { value: 'parent', label: 'Parent' },
    { value: 'admin', label: 'Admin' },
  ];

  activeOptions = [
    { value: null, label: 'All' },
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
  ];

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
    if (formValue.active !== null) filters.active = formValue.active!;
    if (formValue.role) filters.role = formValue.role;

    this.filterChange.emit(filters);
  }

  clearFilters() {
    this.filterForm.reset({
      searchText: '',
      active: null,
      role: '',
    });
  }

  get hasActiveFilters(): boolean {
    const value = this.filterForm.value;
    return !!(value.searchText || value.active !== null || value.role);
  }
}
