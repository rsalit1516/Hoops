import { Component, inject, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { RegularGame } from '@app/domain/regularGame';
import { GameScoreDialog } from '../game-score-dialog/game-score-dialog';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { TeamDisplayPipe } from '@app/shared/pipes/team-display.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@app/services/auth.service';
import { GameService } from '@app/services/game.service';
import { LoggerService } from '@app/services/logger.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csbc-daily-schedule',
  templateUrl: './daily-schedule.html',
  styleUrls: ['./daily-schedule.scss'],
  imports: [MatButtonModule, MatIconModule, DatePipe, TeamDisplayPipe],
})
export class DailySchedule {
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
      panelClass: 'score-dialog',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.logger.debug('Game score dialog closed');
    });
  }
}
