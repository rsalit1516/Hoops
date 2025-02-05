import { Component, inject, signal } from '@angular/core';
import { HouseholdDetailComponent } from '@app/admin/components/household-detail/household-detail.component';
import { CommonModule } from '@angular/common';
import { HouseholdSearchComponent } from '@app/admin/components/household-search/household-search.component';
import { HouseholdListComponent } from '@app/admin/components/household-list/household-list.component';
import { householdSearchCriteria, HouseholdService } from '@app/services/household.service';
import { Household } from '@app/domain/household';
import { HouseholdMembersComponent } from '@app/admin/components/household-members/household-members.component';
import { SectionTitleComponent } from '@app/shared/section-title/section-title.component';
import { ShellTitleComponent } from '@app/shared/shell-title/shell-title.component';

@Component({
  selector: 'app-household-shell',
  imports: [ CommonModule,
    HouseholdDetailComponent,
    HouseholdSearchComponent,
    HouseholdListComponent,
    HouseholdMembersComponent,
    ShellTitleComponent
  ],
  templateUrl: './household-shell.component.html',
  styleUrls: ['./household-shell.component.scss',
  '../../admin.component.scss',
  '../../../shared/scss/forms.scss',
  '../../../shared/scss/cards.scss',
  ]
})
export class HouseholdShellComponent {
  pageTitle = 'Household Management';

  householdService = inject(HouseholdService);

  private searchCriteria = signal<householdSearchCriteria | null>(null); // Signal for search criteria
  results = signal<Household[] | undefined>([]); // Signal for search results

  selectedHousehold = signal<Household | null>(null);

  constructor() { }

  onSearch(criteria: householdSearchCriteria) {
    console.log(criteria);
    this.searchCriteria.set(criteria);
    this.householdService.getResults(criteria).subscribe(data => {
      // console.log('Results', data);
      this.results.set(data);
    });
  }
}
