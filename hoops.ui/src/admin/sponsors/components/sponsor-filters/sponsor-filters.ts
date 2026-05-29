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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { debounceTime } from 'rxjs';
import { FilterCard } from '@app/shared/components/filter-card/filter-card';

export interface SponsorFilterCriteria {
  name: string;
  currentSeasonOnly: boolean;
}

@Component({
  selector: 'csbc-sponsor-filters',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FilterCard,
  ],
  templateUrl: './sponsor-filters.html',
  styleUrls: [
    './sponsor-filters.scss',
    '../../../../shared/scss/cards.scss',
    '../../../../shared/scss/forms.scss',
  ],
})
export class SponsorFilters implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() filters: SponsorFilterCriteria = { name: '', currentSeasonOnly: false };
  @Output() filterChange = new EventEmitter<SponsorFilterCriteria>();

  filterForm = this.fb.group({
    name: [''],
    currentSeasonOnly: [false],
  });

  ngOnInit() {
    if (this.filters) {
      this.filterForm.patchValue({ name: this.filters.name, currentSeasonOnly: this.filters.currentSeasonOnly });
    }

    this.filterForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.emitFilters());

    this.emitFilters();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters'] && !changes['filters'].firstChange) {
      this.filterForm.patchValue(this.filters, { emitEvent: false });
    }
  }

  emitFilters() {
    const value = this.filterForm.value;
    this.filterChange.emit({
      name: value.name ?? '',
      currentSeasonOnly: value.currentSeasonOnly ?? false,
    });
  }

  clearFilters() {
    this.filterForm.reset({ name: '', currentSeasonOnly: false });
  }

  get hasActiveFilters(): boolean {
    const value = this.filterForm.value;
    return !!(value.name || value.currentSeasonOnly);
  }
}
