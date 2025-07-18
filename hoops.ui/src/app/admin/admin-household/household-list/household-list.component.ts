import { NgFor, NgForOf, NgIf } from '@angular/common';
import { AfterViewInit, Component, effect, inject, input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Household } from '@app/domain/household';
import { HouseholdService } from '@app/services/household.service';
import { SectionTitleComponent } from '@app/shared/section-title/section-title.component';
import { HouseholdSearchComponent } from "../household-search/household-search.component";

@Component({
  selector: 'csbc-household-list',
  imports: [
    MatCardModule,
    MatTableModule,
    MatListModule,
    NgFor,
    NgForOf,
    NgIf,
    MatSortModule,
    MatPaginatorModule,
    SectionTitleComponent,
    HouseholdSearchComponent
  ],
  templateUrl: './household-list.component.html',
  styleUrls: ['./household-list.component.scss',
    '../../admin.component.scss',
    '../../../shared/scss/tables.scss',
    '../../../shared/scss/cards.scss',
  ],
  providers: [MatSort, MatPaginator]
})
export class HouseholdListComponent implements OnInit, OnChanges, AfterViewInit {
  readonly #router = inject(Router);
  households = input<Household[]>(); // Signal
  pageTitle = 'Household List';
  results = input<Household[]>();
  readonly #householdService = inject(HouseholdService);

  @ViewChild('householdPaginator') paginator: MatPaginator = inject(MatPaginator);
  @ViewChild(MatSort) sort: MatSort = inject(MatSort);
  showFirstLastButtons = true;
  pageSize = 10;
  errorMessage = this.#householdService.errorMessage;
  noDataMessage = 'Enter search criteria';
  displayedColumns = [
    'houseId',
    'name',
    'address1',
    'phone',
    'email',
  ]

  dataSource = new MatTableDataSource<Household>([]);

  constructor () {
    effect(() => {
      this.dataSource = new MatTableDataSource<Household>(this.#householdService.householdSearchResults());
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator.pageSize = this.pageSize;
      this.paginator.page.subscribe(() => this.refreshData());

    });
  }

  ngOnInit () {
    // this.dataSource = new MatTableDataSource(this.results());
    // this.refreshData();
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
  getRecord (row: Household) {
    this.#householdService.updateSelectedHousehold(row);
    console.log(this.#householdService.selectedHousehold);
    //this.divisionService.getDvision(division);
    //console.log(this.divisionService.currentDivision());
    // this.store.dispatch(new adminActions.SetSelectedDivision(division));
    this.#router.navigate(['./admin/households/detail']);
  }
  refreshData () {
    this.dataSource._updateChangeSubscription();
    this.dataSource.disconnect()
    this.dataSource.connect();
  }
}
