import { DatePipe } from '@angular/common';
import { Component, inject, input, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTab } from '@angular/material/tabs';
import { Person } from '@app/domain/person';
import { PeopleService } from '@app/services/people.service';
import { SectionTitleComponent } from '@app/shared/section-title/section-title.component';

@Component({
  selector: 'csbc-people-search-results',
  imports: [
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
    SectionTitleComponent
  ],
  templateUrl: './people-search-results.component.html',
  styleUrls: ['./people-search-results.component.scss',
  '../../admin.component.scss',
  '../../../shared/scss/tables.scss',
  '../../../shared/scss/cards.scss',
  ],
    providers: [ MatSort, MatPaginator, DatePipe ]
})
export class PeopleSearchResultsComponent {
  pageTitle = 'People Search Results';
    #peopleService = inject(PeopleService);
  results = input<Person[]>();

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

  constructor() {
    //    this.dataSource = new MatTableDataSource(this.results);

  }
  getRecord(row: any) {
    console.log(row);
   //  this.#householdService.selectedRecordSignal.set(row);
  }
}
