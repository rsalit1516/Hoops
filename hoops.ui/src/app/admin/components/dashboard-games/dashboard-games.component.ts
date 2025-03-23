import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AdminGamesListComponent } from '@app/admin/admin-games/admin-games-list/admin-games-list.component';
import { GameService } from '@app/services/game.service';

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
  teamGames = this.#gameService.teamGames;
  selectedTeam = this.#gameService.selectedTeam;
  seasonGamesCount = this.#gameService.seasonGamesSignal.length;
  selectedSeason = this.#gameService.selectedSeason;
}
