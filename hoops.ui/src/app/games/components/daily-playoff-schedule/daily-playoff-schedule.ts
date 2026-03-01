import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PlayoffGame } from '@app/domain/playoffGame';

@Component({
  selector: 'csbc-daily-playoff-schedule',
  imports: [DatePipe],
  templateUrl: './daily-playoff-schedule.html',
  styleUrls: ['./daily-playoff-schedule.scss'],
})
export class DailyPlayoffSchedule {
  readonly playoffGames = input.required<PlayoffGame[]>();

  gameDate = computed(() => {
    const games = this.playoffGames();
    return games.length > 0 ? new Date(games[0].gameDate) : null;
  });

  sortedGames = computed(() =>
    [...this.playoffGames()].sort((a, b) => {
      const ta = a.gameTime ? new Date(a.gameTime).getTime() : 0;
      const tb = b.gameTime ? new Date(b.gameTime).getTime() : 0;
      return ta - tb;
    }),
  );
}
