import { Component, inject, computed, input } from '@angular/core';
import { RegularGame } from '@app/domain/regularGame';
import { Store } from '@ngrx/store';
import { GameScoreDialog } from '../game-score-dialog/game-score-dialog';
import * as fromGames from '../../state';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { TeamDisplayPipe } from '@app/shared/pipes/team-display.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@app/services/auth.service';
import { GameService } from '@app/services/game.service';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'csbc-daily-schedule',
  templateUrl: './daily-schedule.html',
  styleUrls: ['./daily-schedule.scss'],
  imports: [MatButtonModule, MatIconModule, DatePipe, TeamDisplayPipe],
})
export class DailySchedule {
  private store = inject<Store<fromGames.State>>(Store);
  private dialog = inject(MatDialog);
  private logger = inject(LoggerService);
  private authService = inject(AuthService);
  private gameService = inject(GameService);

  readonly games = input.required<RegularGame[]>();

  canEdit = computed(() => this.authService.canEditGames());

  gameDate = computed(() => {
    const games = this.games();
    return games.length > 0 ? new Date(games[0].gameDate) : null;
  });

  sortedGames = computed(() =>
    [...this.games()].sort((a, b) => {
      const ta = a.gameTime ? new Date(a.gameTime).getTime() : 0;
      const tb = b.gameTime ? new Date(b.gameTime).getTime() : 0;
      return ta - tb;
    }),
  );

  editGame(game: RegularGame) {
    this.gameService.updateSelectedGame(game);
    const dialogRef = this.dialog.open(GameScoreDialog, {
      width: '500px',
      data: { game },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.logger.debug('Game score dialog closed');
    });
  }
}
