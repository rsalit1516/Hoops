import { CommonModule } from '@angular/common';
import { Component, inject, model, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { peopleSearchCriteria } from '@app/services/people.service';
import { FormSettings } from '@app/shared/constants';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'csbc-people-search',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './people-search.html',
  styleUrls: [
    './people-search.scss',
    '../../admin.scss',
    '../../../shared/scss/forms.scss',
  ],
})
export class PeopleSearch {
  private readonly logger = inject(LoggerService);

  // Two-way binding with parent component
  selectedFilter = model<peopleSearchCriteria>({
    lastName: '',
    firstName: '',
    playerOnly: false,
  });

  readonly inputStyle = FormSettings.inputStyle;
  readonly pageTitle = 'Search People';

  constructor() {
    // React to changes in the filter model
    effect(() => {
      const filter = this.selectedFilter();
      this.logger.info('Filter criteria changed:', filter);
      // Save to localStorage for persistence
      localStorage.setItem('peopleSearchCriteria', JSON.stringify(filter));
    });
  }

  updateLastName(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.selectedFilter.update((criteria) => ({
      ...criteria,
      lastName: value,
    }));
  }

  updateFirstName(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.selectedFilter.update((criteria) => ({
      ...criteria,
      firstName: value,
    }));
  }

  updatePlayerOnly(checked: boolean): void {
    this.selectedFilter.update((criteria) => ({
      ...criteria,
      playerOnly: checked,
    }));
  }

  newPerson(): void {
    this.logger.info('New person requested');
    // Implement new person logic
  }
}
