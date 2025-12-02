import { Component, inject, signal } from '@angular/core';




import { householdSearchCriteria, HouseholdService } from '@app/services/household.service';
import { Household } from '@app/domain/household';
import { ShellTitle } from '@app/shared/components/shell-title/shell-title';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'csbc-household-shell',
  imports: [RouterModule, MatSidenavModule, MatExpansionModule, MatIconModule, ShellTitle],
  template: `<section class="container">
  <csbc-shell-title [title]="title"/>
  <router-outlet />
</section>`,
  styleUrls: ['./household-shell.scss',
    '../../admin.scss',
    '../../containers/admin-shell/admin-shell.scss',
    '../../../shared/scss/cards.scss',
  ]
})
export class HouseholdShell {
  title = 'Household Management';
  isSidenavOpen = false;
  householdService = inject(HouseholdService);
  logger = inject(LoggerService);
  selectedRecord = this.householdService.selectedRecordSignal();

  private searchCriteria = signal<householdSearchCriteria | null>(null); // Signal for search criteria
  results = signal<Household[] | undefined>([]); // Signal for search results
  selectedHousehold = signal<Household | null>(null);
  constructor () {
  }

  onSearch (criteria: householdSearchCriteria) {
    this.logger.info('Search criteria:', criteria);
    this.searchCriteria.set(criteria);
    this.householdService.getResults(criteria).subscribe(data => {
      this.logger.debug('Search results:', data);
      this.results.update(() => data);
    });
  }

}
