import { DatePipe, NgFor, NgForOf, NgIf } from '@angular/common';
import { Component, computed, effect, inject, input, linkedSignal, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Household } from '@app/domain/household';
import { Person } from '@app/domain/person';
import { HouseholdService } from '@app/services/household.service';
import { PeopleService } from '@app/services/people.service';
import { SectionTitleComponent } from '@app/shared/section-title/section-title.component';

@Component({
  selector: 'csbc-household-members',
  imports: [
    MatCardModule,
    MatTableModule,
    MatListModule,
    NgFor,
    NgForOf,
    NgIf,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
    SectionTitleComponent
  ],
  templateUrl: './household-members.component.html',
  styleUrls: [ './household-members.component.scss',
    '../../admin.component.scss',
    '../../../shared/scss/tables.scss',
    '../../../shared/scss/cards.scss',
  ],
  providers: [ MatSort, MatPaginator, DatePipe ]
})
export class HouseholdMembersComponent implements OnInit {
  pageTitle = 'Household members';
  /* injected */
  #peopleService = inject(PeopleService);
  results = input<Household[]>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = inject(MatSort);
  showFirstLastButtons = true;
  pageSize = 10;

  displayedColumns = [
    'lastName',
    'firstName',
    'birthDate',
    'gender',
    'register'
  ]

  dataSource!: MatTableDataSource<Person>;
  // people = linkedSignal(this.#peopleService.householdMembers);
  people = linkedSignal(() => this.#peopleService.householdMembers);
  peopleList = this.people();

  constructor() {
    effect(() => {
      const record = this.#peopleService.householdMembers();
      // console.log(record);
      if (record !== null) {
        this.dataSource = new MatTableDataSource(record);
      }
    });

  }
  ngOnInit() {
    // console.log('results', this.people());
    // this.dataSource = new MatTableDataSource(this.people());
  }

  getRecord(row: any) {
    console.log(row);
   //  this.#householdService.selectedRecordSignal.set(row);
  }
}
