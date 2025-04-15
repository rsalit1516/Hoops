import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, effect, inject, input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Person } from '@app/domain/person';
import { PeopleService } from '@app/services/people.service';
import { SectionTitleComponent } from '@app/shared/section-title/section-title.component';
import { PeopleSearchComponent } from '../people-search/people-search.component';

@Component({
  selector: 'csbc-people-search-results',
  imports: [
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
    SectionTitleComponent,
    PeopleSearchComponent
  ],
  templateUrl: './people-search-results.component.html',
  styleUrls: ['./people-search-results.component.scss',
    '../../admin.component.scss',
    '../../../shared/scss/tables.scss',
    '../../../shared/scss/cards.scss',
  ],
  providers: [MatSort, MatPaginator, DatePipe]
})
export class PeopleSearchResultsComponent  implements OnInit, OnChanges, AfterViewInit  {
  pageTitle = 'People Search Results';
  #peopleService = inject(PeopleService);
  results = input<Person[]>();

    @ViewChild('peoplePaginator') paginator: MatPaginator = inject(MatPaginator);
  @ViewChild(MatSort) sort: MatSort = inject(MatSort);

  showFirstLastButtons = true;
  pageSize = 10;

  displayedColumns = [
    'houseId',
    'lastName',
    'firstName',
    'birthDate',
    'gender',
    'register'
  ]
  dataSource = new MatTableDataSource<Person>([]);;

  constructor () {
    effect(() => {
      console.log(this.#peopleService.results());
      this.dataSource = new MatTableDataSource<Person>(this.#peopleService.results());
    });
  }
  ngOnInit () {
    // this.refreshData();
    this.dataSource = new MatTableDataSource(this.results());
    // this.dataSource.data = this.results() || [];
    this.refreshData();
  }
  ngAfterViewInit () {
    this.dataSource.data = this.results() || [];
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.pageSize = this.pageSize;
    this.paginator.page.subscribe(() => this.refreshData());
  }

  ngOnChanges () {
    this.dataSource.data = this.results() || [];;
    this.paginator.page.subscribe(() => this.refreshData());
  }

  getRecord (row: any) {
    console.log(row);
    //  this.#householdService.selectedRecordSignal.set(row);
  }
  refreshData () {
    this.dataSource._updateChangeSubscription();
    this.dataSource.disconnect()
    this.dataSource.connect();
  }
}
