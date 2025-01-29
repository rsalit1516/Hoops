import { NgFor, NgForOf, NgIf } from '@angular/common';
import { AfterViewInit, Component, inject, Input, input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Household } from '@app/domain/household';
import { HouseholdService } from '@app/services/household.service';

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
        MatPaginatorModule

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
  households = input<Household[]>(); // Signal
  pageTitle = 'Household List';
  results = input<Household[]>();

  /* injects */
  private householdService = inject(HouseholdService);
  #router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = inject(MatSort);
  showFirstLastButtons = true;
  pageSize = 10;

  errorMessage = this.householdService.errorMessage;
  // households = this.householdService.households;
  // Subscribe to the households signal and update the dataSource
  displayedColumns = [
    'houseId',
    'name',
    'address1',
    'phone',
    'email',
  ]
  dataSource!: MatTableDataSource<Household>;

  constructor() { }

  ngOnInit() {
    console .log('results', this.results);
    this.dataSource = new MatTableDataSource(this.results());

    // households = this.householdService.households;
    // isLoading = this.#householdService.isLoading;

  }
  ngAfterViewInit () {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.results());
//     [...this.results];
  }
  getRecord(row: Household) {
    console.log('Row: ', row);
    // this.#router.navigate(['/admin/household', row.houseId]);
    this.householdService.updateSelectedRecord(row);
  };

}
