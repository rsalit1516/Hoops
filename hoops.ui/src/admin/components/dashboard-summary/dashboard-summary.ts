import { Component, computed, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { DraftListPlayer } from '@app/domain/draft-list-player';
import { DivisionService } from '@app/services/division.service';
import { TeamService } from '@app/services/team.service';
import { SeasonService } from '@app/services/season.service';
import { GameService } from '@app/services/game.service';
import { Constants } from '@shared/constants';

@Component({
  selector: 'csbc-dashboard-summary',
  imports: [MatCardModule],
  templateUrl: './dashboard-summary.html',
  styleUrls: [
    '../../../shared/scss/cards.scss',
    '../../dashboard/admin-dashboard.scss',
    '../../admin.scss'
  ],
})
export class DashboardSummary {
  readonly #divisionService = inject(DivisionService);
  readonly #teamService = inject(TeamService);
  readonly #seasonService = inject(SeasonService);
  readonly #gameService = inject(GameService);

  divisionCount = computed(() => this.#divisionService.seasonDivisions()?.length ?? 0);
  teamCount = computed(() => this.#teamService.seasonTeams()?.length ?? 0);

  #seasonPlayers = httpResource<DraftListPlayer[]>(() => {
    const seasonId = this.#seasonService.selectedSeason()?.seasonId;
    if (!seasonId) return undefined;
    return `${Constants.GET_SEASON_PLAYERS_URL}/${seasonId}`;
  });

  playerCount = computed(() => this.#seasonPlayers.value()?.length ?? 0);
  gameCount = this.#gameService.seasonGamesCount;
}
