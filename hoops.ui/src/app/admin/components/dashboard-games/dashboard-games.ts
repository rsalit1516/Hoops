import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AdminGamesList } from '@app/admin/admin-games/admin-games-list/admin-games-list';
import { GameService } from '@app/services/game.service';
import { SeasonService } from '@app/services/season.service';
import { TeamService } from '@app/services/team.service';
import { Constants } from '@app/shared/constants';
import { Literals } from '@app/shared/constants';

@Component({
  selector: 'csbc-dashboard-games',
  imports: [MatCardModule, AdminGamesList],
  templateUrl: './dashboard-games.html',
  styleUrls: [
    '../../../shared/scss/cards.scss',
    '../../dashboard/admin-dashboard.scss',
    '../../admin.scss',
  ],
})
export class DashboardGames {
  readonly #gameService = inject(GameService);
  readonly seasonService = inject(SeasonService);
  readonly teamService = inject(TeamService);
  constants = Literals;
  teamGames = this.#gameService.teamGames;
  selectedTeam = this.teamService.selectedTeam;
  seasonGamesCount = this.#gameService.seasonGamesCount;
  selectedSeason = this.seasonService.selectedSeason();
}
