import { AfterViewInit, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { HouseholdDetailComponent } from '@app/admin/components/household-detail/household-detail.component';
import { CommonModule } from '@angular/common';
import { HouseholdSearchComponent } from '@app/admin/components/household-search/household-search.component';
import { HouseholdListComponent } from '@app/admin/components/household-list/household-list.component';
import { householdSearchCriteria, HouseholdService } from '@app/services/household.service';
import { Household } from '@app/domain/household';
import { HouseholdMembersComponent } from '@app/admin/components/household-members/household-members.component';
import { SectionTitleComponent } from '@app/shared/section-title/section-title.component';
import { ShellTitleComponent } from '@app/shared/shell-title/shell-title.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-household-shell',
  imports: [ CommonModule,
    MatSidenavModule,
    MatExpansionModule,
    MatIconModule,
    HouseholdDetailComponent,
    HouseholdSearchComponent,
    HouseholdListComponent,
    HouseholdMembersComponent,
    ShellTitleComponent
  ],
  templateUrl: './household-shell.component.html',
  styleUrls: [ './household-shell.component.scss',
    '../../admin.component.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ]
})
export class HouseholdShellComponent implements AfterViewInit {
  pageTitle = 'Household Management';
  isSidenavOpen = false;

  householdService = inject(HouseholdService);

  selectedRecord = this.householdService.selectedRecordSignal();

  private searchCriteria = signal<householdSearchCriteria | null>(null); // Signal for search criteria
  results = signal<Household[] | undefined>([]); // Signal for search results

  selectedHousehold = signal<Household | null>(null);

  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('firstPanel') firstPanel!: MatExpansionPanel;

  constructor() {
    effect(() => {
      const record = this.householdService.selectedRecordSignal();
      console.log('Selected record changed:', record);
      if (record !== null) {
        console.log(`Record updated: ${record.name}`);
        this.isSidenavOpen = true;
        // Allow the sidenav to open first, then expand the first panel
        setTimeout(() => {
          if (this.firstPanel) {
            this.firstPanel.expanded = true;
          }
        }, 300);
      }
    });        // Optionally trigger additional logic here
  }
  ngAfterViewInit() {
    // Ensure the first panel expands when the sidenav opens
    this.sidenav.openedStart.subscribe(() => {
      if (this.firstPanel) {
        this.firstPanel.expanded = true;
      }
    });
  }
  onSearch(criteria: householdSearchCriteria) {
    console.log(criteria);
    this.searchCriteria.set(criteria);
    this.householdService.getResults(criteria).subscribe(data => {
      // console.log('Results', data);
      this.results.set(data);
    });
  }
  selectRecord(record: Household) {
    this.selectedRecord = record;
    this.isSidenavOpen = true;
  }
  closeSidenav() {
    this.isSidenavOpen = false;
  }
}
