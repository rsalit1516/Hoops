import { Component, effect, inject } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { HouseholdService } from '@app/services/household.service';

@Component({
  selector: 'app-household-summary',
  imports: [MatCardModule],
  templateUrl: "./household-summary.html",
  styleUrls: [ './household-summary.scss',
    '../../admin.scss',
    '../../../shared/scss/cards.scss',
  ],

})
export class HouseholdSummary {
  readonly pageTitle = 'Household Summary';
  readonly householdService = inject(HouseholdService);
  readonly #router = inject(Router);
  household = this.householdService.selectedHousehold;
  constructor() {
    effect(() => {
      this.household = this.householdService.selectedHousehold;
    });
  }
  gotoHouseHold() {

  }
}
