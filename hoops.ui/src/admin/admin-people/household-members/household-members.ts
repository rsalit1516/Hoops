import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, input, linkedSignal, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PaginationPreferencesService } from '@app/services/pagination-preferences.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Household } from '@app/domain/household';
import { Person } from '@app/domain/person';
import { HouseholdService } from '@app/services/household.service';
import { PeopleService } from '@app/services/people.service';
import { SectionTitle } from '@app/shared/components/section-title/section-title';
import { LoggerService } from '@app/services/logger.service';
import { ConfirmDialog } from '@app/admin/shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'csbc-household-members',
  imports: [
    MatCardModule,
    MatTableModule,
    MatListModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    DatePipe,
    SectionTitle
  ],
  templateUrl: './household-members.html',
  styleUrls: ['./household-members.scss',
    '../../admin.scss',
    '../../../shared/scss/tables.scss',
    '../../../shared/scss/cards.scss',
  ],
  providers: [MatSort, MatPaginator, DatePipe]
})
export class HouseholdMembers implements OnInit {
  pageTitle = 'Household members';
  /* injected */
  #peopleService = inject(PeopleService);
  #HouseholdService = inject(HouseholdService);
  #router = inject(Router);
  #logger = inject(LoggerService);
  #dialog = inject(MatDialog);
  #prefs = inject(PaginationPreferencesService);

  results = input<Household[]>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = inject(MatSort);
  showFirstLastButtons = true;
  pageSize = this.#prefs.getPageSize(10);

  displayedColumns = [
    'lastName',
    'firstName',
    'birthDate',
    // 'gender',
    // 'register'
  ]

  dataSource!: MatTableDataSource<Person>;
  // people = linkedSignal(this.#peopleService.householdMembers);
  people = linkedSignal(() => this.#peopleService.householdMembers);
  peopleList = this.people();

  constructor () {
    effect(() => {
      const record = this.#peopleService.householdMembers();
      // console.log(record);
      if (record !== null) {
        this.dataSource = new MatTableDataSource(record);
      }
    });

  }
  ngOnInit () {
    // console.log('results', this.people());
    // this.dataSource = new MatTableDataSource(this.people());
  }

  getRecord (row: Person) {
    this.#logger.debug('Selected record:', row);

    // Check if the current form has unsaved changes
    if (this.#peopleService.isFormDirty()) {
      // Show confirmation dialog
      const dialogRef = this.#dialog.open(ConfirmDialog, {
        width: '400px',
        data: {
          title: 'Discard Changes?',
          message: 'You have unsaved changes. Do you want to discard them and navigate to the selected person?'
        }
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          // User confirmed - navigate to the selected person
          this.navigateToPerson(row);
        }
        // If not confirmed, do nothing (stay on current person)
      });
    } else {
      // No unsaved changes - navigate directly
      this.navigateToPerson(row);
    }
  }

  private navigateToPerson(person: Person) {
    this.#peopleService.updateSelectedPerson(person);
    this.#router.navigate(['/admin/people/detail']);
  }
  onPage(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.#prefs.savePageSize(event.pageSize);
  }

  addHouseHoldMember () {
    this.#logger.info('Adding household member');
    var newPerson = new Person();
    // Use the correct signal to get the household ID
    newPerson.houseId = this.#HouseholdService.selectedRecordSignal()?.houseId ?? 0;
    this.#logger.info('Setting houseId to:', newPerson.houseId);
    this.#peopleService.updateSelectedPerson(newPerson);
    this.#router.navigate(['/admin/people/detail']);
  }

}
