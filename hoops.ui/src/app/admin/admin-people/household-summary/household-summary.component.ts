import { Component, effect, inject } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { HouseholdService } from '@app/services/household.service';

@Component({
  selector: 'app-household-summary',
  imports: [MatCardModule],
  templateUrl: './household-summary.component.html',
  styleUrls: [ './household-summary.component.scss',
    '../../admin.component.scss',
    '../../../shared/scss/cards.scss',
  ],

})
export class HouseholdSummaryComponent {
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
