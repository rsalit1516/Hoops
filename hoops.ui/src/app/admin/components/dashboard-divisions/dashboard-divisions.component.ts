import { Component, computed, inject } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { Division } from '@app/domain/division';
import { DivisionService } from '@app/services/division.service';

@Component({
  selector: 'csbc-dashboard-divisions',
  imports: [MatCardModule,
    MatListModule,
  ],
  templateUrl: './dashboard-divisions.component.html',
  styleUrls: [
    '../../../shared/scss/cards.scss',
    '../../dashboard/admin-dashboard.component.scss',
    '../../admin.component.scss'
  ],
})
export class DashboardDivisionsComponent {
  readonly #divisionService = inject(DivisionService);
  readonly router = inject(Router);
  divisionCount = computed(() => (this.#divisionService.seasonDivisions()?.length ?? 0));
  seasonDivisions = this.#divisionService.seasonDivisions;
  selectedDivision: Division | undefined;

  goToDivision (division: Division) {
    // this.store.dispatch(new adminActions.SetSelectedDivision(division));
  this.#divisionService.updateSelectedDivision(division);
    this.selectedDivision = division;
//    this.router.navigate(['/admin/division']);
  }
}
