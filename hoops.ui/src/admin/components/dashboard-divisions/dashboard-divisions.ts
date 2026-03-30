import { Component, computed, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Division } from '@app/domain/division';
import { DraftListPlayer } from '@app/domain/draft-list-player';
import { DivisionService } from '@app/services/division.service';
import { SeasonService } from '@app/services/season.service';
import { Constants } from '@shared/constants';

@Component({
  selector: 'csbc-dashboard-divisions',
  imports: [MatCardModule, MatTableModule],
  templateUrl: "./dashboard-divisions.html",
  styleUrls: [
    './dashboard-divisions.scss',
    '../../../shared/scss/cards.scss',
    '../../dashboard/admin-dashboard.scss',
    '../../admin.scss'
  ],
})
export class DashboardDivisions {
  readonly #divisionService = inject(DivisionService);
  readonly #seasonService = inject(SeasonService);
  divisionCount = computed(() => (this.#divisionService.seasonDivisions()?.length ?? 0));
  seasonDivisions = this.#divisionService.seasonDivisions;
  selectedDivision: Division | undefined;
  displayedColumns = ['division', 'players'];

  seasonPlayers = httpResource<DraftListPlayer[]>(() => {
    const seasonId = this.#seasonService.selectedSeason()?.seasonId;
    if (!seasonId) return undefined;
    return `${Constants.GET_SEASON_PLAYERS_URL}/${seasonId}`;
  });

  playerCountByDivision = computed(() =>
    (this.seasonPlayers.value() ?? []).reduce((map, p) => {
      map.set(p.division, (map.get(p.division) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  );

  totalPlayerCount = computed(() => this.seasonPlayers.value()?.length ?? 0);

  getPlayerCount(division: Division): number {
    return this.playerCountByDivision().get(division.divisionDescription) ?? 0;
  }

  goToDivision(division: Division) {
    this.#divisionService.updateSelectedDivision(division);
    this.selectedDivision = division;
  }
}
