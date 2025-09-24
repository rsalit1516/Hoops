import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  inject,
  input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Person } from '@app/domain/person';
import { PeopleService } from '@app/services/people.service';
import { SectionTitle } from '@app/shared/components/section-title/section-title';
import { PeopleSearch } from '../people-search/people-search';
import { Router } from '@angular/router';
import { HouseholdService } from '@app/services/household.service';
import { PeopleAlphabet } from '../../admin-shared/people-alphabet/people-alphabet';

@Component({
  selector: 'csbc-people-search-results',
  imports: [
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
    SectionTitle,
    PeopleSearch,
    PeopleAlphabet,
  ],
  templateUrl: './people-search-results.html',
  styleUrls: [
    './people-search-results.scss',
    '../../admin.scss',
    '../../../shared/scss/tables.scss',
    '../../../shared/scss/cards.scss',
  ],
  providers: [MatSort, MatPaginator, DatePipe],
})
export class PeopleSearchResults implements OnInit, OnChanges, AfterViewInit {
  pageTitle = 'People Search Results';
  #peopleService = inject(PeopleService);
  #householdService = inject(HouseholdService);
  readonly #router = inject(Router);
  results = input<Person[]>();
  register = 'Register';
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
    'register',
  ];
  dataSource = new MatTableDataSource<Person>([]);

  constructor() {
    effect(() => {
      this.dataSource = new MatTableDataSource<Person>(
        this.#peopleService.results()
      );
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator.pageSize = this.pageSize;
      this.paginator.page.subscribe(() => this.refreshData());
    });
  }
  ngOnInit() {}
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    this.paginator.page.subscribe(() => this.refreshData());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getRecord(row: any) {
    console.log(row);
    this.#peopleService.updateSelectedPerson(row);
    this.#householdService.selectedHouseholdByHouseId(row.houseId);
    this.#router.navigate(['/admin/people/detail']);
  }
  refreshData() {
    this.dataSource._updateChangeSubscription();
    this.dataSource.disconnect();
    this.dataSource.connect();
  }
}
