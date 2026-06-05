import { Component, OnInit, inject } from '@angular/core';

import { SchedulePlayoffs } from '@app/games/components/schedule-playoffs/schedule-playoffs';
import { PlayoffGame } from '@app/domain/playoffGame';
import { PlayoffGameService } from '@app/services/playoff-game.service';

@Component({
  selector: 'csbc-playoffs-shell',
  imports: [SchedulePlayoffs],
  template: `
    <div class="row">
    <h1>Playoffs</h1>
      <csbc-schedule-playoffs [playoffGames]="dailyPlayoffSchedule" />
  </div>`,
  styleUrl: './playoffs-shell.scss'
})
export class PlayoffsShell implements OnInit {
  private gameService = inject(PlayoffGameService);

  dailyPlayoffSchedule!: Array<PlayoffGame[]>;

  constructor() {}

  ngOnInit() {
    this.dailyPlayoffSchedule = [];
  }
}
