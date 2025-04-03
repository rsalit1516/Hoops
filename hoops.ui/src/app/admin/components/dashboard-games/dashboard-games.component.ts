import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AdminGamesListComponent } from '@app/admin/admin-games/admin-games-list/admin-games-list.component';
import { GameService } from '@app/services/game.service';
import { Constants } from '@app/shared/constants';
import { Literals } from '@app/shared/constants';

@Component({
  selector: 'csbc-dashboard-games',
  imports: [
    MatCardModule,
    AdminGamesListComponent
  ],
  templateUrl: './dashboard-games.component.html',
  styleUrls: [
    '../../../shared/scss/cards.scss',
    '../../dashboard/admin-dashboard.component.scss',
    '../../admin.component.scss'
  ]
})
export class DashboardGamesComponent {
  readonly #gameService = inject(GameService);
  constants = Literals;
  teamGames = this.#gameService.teamGames;
  selectedTeam = this.#gameService.selectedTeam;
  seasonGamesCount = this.#gameService.seasonGames!.length;
  selectedSeason = this.#gameService.selectedSeason;
}
