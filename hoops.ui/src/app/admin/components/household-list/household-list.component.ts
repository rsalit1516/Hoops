import { NgFor, NgForOf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Household } from '@app/domain/household';
import { HouseholdService } from '@app/services/household.service';

@Component({
  selector: 'csbc-household-list',
  imports: [
    MatCardModule,
    MatTableModule,
    MatListModule,
    NgFor,
    NgForOf
  ],
  templateUrl: './household-list.component.html',
  styleUrls: ['./household-list.component.scss',
  '../../admin.component.scss',
  '../../../shared/scss/tables.scss',
  '../../../shared/scss/cards.scss',
  ]
})
export class HouseholdListComponent implements OnInit {

  pageTitle = 'Household List';

  /* injects */
  private householdService = inject(HouseholdService);

  errorMessage = this.householdService.errorMessage;
  // households = this.householdService.households;
  // Subscribe to the households signal and update the dataSource
  displayedColumns = [
    'householdName',
    'address',
    'phone',
    'email',
  ]
  dataSource!: MatTableDataSource<Household>;
  results: Household[] = [];

  constructor() { }

  ngOnInit() {
    // this.householdService.households().subscribe(households => {
    const households = this.householdService.results;
    console.log('households', households);
    this.results = this.householdService.results;
    console .log('results', this.results);
    this.dataSource = new MatTableDataSource(this.results);

    // households = this.householdService.households;
    // isLoading = this.#householdService.isLoading;

  }

  getRecord(row : any){};

}
