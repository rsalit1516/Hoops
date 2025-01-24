import { NgFor, NgForOf } from '@angular/common';
import { Component, inject } from '@angular/core';
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
export class HouseholdListComponent {
  pageTitle = 'Household List';

  /* injects */
  #householdService = inject(HouseholdService);

  households = this.#householdService.households;
  // households = this.householdService.households;
  // isLoading = this.#householdService.isLoading;
  errorMessage = this.#householdService.errorMessage;

  displayedColumns = [
    'householdName',
    'address',
    'phone',
    'email',
  ]
  dataSource!: MatTableDataSource<Household>;

  getRecord(row : any){};

}
