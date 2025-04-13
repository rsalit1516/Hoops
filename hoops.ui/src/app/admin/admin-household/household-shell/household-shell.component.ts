import { AfterViewInit, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { HouseholdDetailComponent } from '@app/admin/admin-household/household-detail/household-detail.component';
import { CommonModule } from '@angular/common';
import { HouseholdSearchComponent } from '@app/admin/admin-household/household-search/household-search.component';
import { HouseholdListComponent } from '@app/admin/admin-household/household-list/household-list.component';
import { householdSearchCriteria, HouseholdService } from '@app/services/household.service';
import { Household } from '@app/domain/household';
import { HouseholdMembersComponent } from '@app/admin/admin-household/household-members/household-members.component';
import { SectionTitleComponent } from '@app/shared/section-title/section-title.component';
import { ShellTitleComponent } from '@app/shared/shell-title/shell-title.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-household-shell',
  imports: [ CommonModule,
RouterModule,
    MatSidenavModule,
    MatExpansionModule,
    MatIconModule,
    HouseholdDetailComponent,
    HouseholdSearchComponent,
    HouseholdListComponent,
    HouseholdMembersComponent,
    ShellTitleComponent
  ],
  template: `<section class="container">
  <csbc-shell-title [title]="title"/>
  <router-outlet></router-outlet>
</section>`,
  styleUrls: [ './household-shell.component.scss',
    '../../admin.component.scss',
    '../../containers/admin-shell/admin-shell.component.scss',
    '../../../shared/scss/cards.scss',
  ]
})
export class HouseholdShellComponent  {
  title = 'Household Management';
  isSidenavOpen = false;
  householdService = inject(HouseholdService);
  selectedRecord = this.householdService.selectedRecordSignal();

  private searchCriteria = signal<householdSearchCriteria | null>(null); // Signal for search criteria
  results = signal<Household[] | undefined>([]); // Signal for search results
  selectedHousehold = signal<Household | null>(null);
  constructor() {
  }

  onSearch(criteria: householdSearchCriteria) {
    console.log(criteria);
    this.searchCriteria.set(criteria);
    this.householdService.getResults(criteria).subscribe(data => {
      // console.log('Results', data);
      this.results.update(() => data);
    });
  }

}
