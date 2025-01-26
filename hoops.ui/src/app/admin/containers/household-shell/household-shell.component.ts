import { Component, inject, signal } from '@angular/core';
import { HouseholdDetailComponent } from '@app/admin/components/household-detail/household-detail.component';
import { CommonModule } from '@angular/common';
import { HouseholdSearchComponent } from '@app/admin/components/household-search/household-search.component';
import { HouseholdListComponent } from '@app/admin/components/household-list/household-list.component';
import { MatCardModule } from '@angular/material/card';
import { householdSearchCriteria, HouseholdService } from '@app/services/household.service';
import { Household } from '@app/domain/household';

@Component({
  selector: 'app-household-shell',
  imports: [ CommonModule,
    HouseholdDetailComponent,
    HouseholdSearchComponent,
    HouseholdListComponent
  ],
  templateUrl: './household-shell.component.html',
  styleUrl: './household-shell.component.scss'
})
export class HouseholdShellComponent {
  pageTitle = 'Household Management';

  householdService = inject(HouseholdService);

  private searchCriteria = signal<householdSearchCriteria | null>(null); // Signal for search criteria
  results = signal<Household[] | undefined>([]); // Signal for search results

  constructor() { }

  onSearch(criteria: householdSearchCriteria) {
    console.log(criteria);
    this.searchCriteria.set(criteria);
    this.householdService.getResults(criteria).subscribe(data => {
      console.log('Results', data);
      this.results.set(data);
    });
  }
}
