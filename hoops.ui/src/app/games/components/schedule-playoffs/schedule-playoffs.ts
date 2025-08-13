import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayoffGame } from '@domain/playoffGame';
import { DailyPlayoffSchedule } from '../daily-playoff-schedule/daily-playoff-schedule';
import { PlayoffGameService } from '@app/services/playoff-game.service';

@Component({
  selector: 'csbc-schedule-playoffs',
  template: `
@for( data of dailyPlayoffSchedule(); track $index) {
      <div >
        <csbc-daily-playoff-schedule [playoffGames]="data">
        </csbc-daily-playoff-schedule>
      </div>
}
  `,
  styleUrls: ['./schedule-playoffs.scss'],
  imports: [CommonModule, DailyPlayoffSchedule],
})
export class SchedulePlayoffs {
  readonly playoffGames = input.required<Array<PlayoffGame[]>>();
  readonly #playoffGameService = inject(PlayoffGameService);
  public games: PlayoffGame[] | undefined;

  dailyPlayoffSchedule = computed(() => this.#playoffGameService.dailyPlayoffSchedule())


  constructor () { }

}
