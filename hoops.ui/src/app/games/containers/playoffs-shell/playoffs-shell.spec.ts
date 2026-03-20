import { Component, OnInit, inject } from '@angular/core';

import { SchedulePlayoffs } from '@app/games/components/schedule-playoffs/schedule-playoffs';
import { Store } from '@ngrx/store';
import * as fromGames from '../../state';
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
  private store = inject<Store<fromGames.State>>(Store);
  private gameService = inject(PlayoffGameService);

  dailyPlayoffSchedule!: Array<PlayoffGame[]>;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor () { }

  ngOnInit () {
    this.store.select(fromGames.getCurrentDivision).subscribe((division) => {
      this.store
        .select(fromGames.getDivisionPlayoffGames)
        .subscribe((playoffGames) => {
          // this.dailyPlayoffSchedule = playoffGames;
          // console.log(playoffGames);
          this.dailyPlayoffSchedule = [];
          this.gameService
            .groupPlayoffGamesByDate(playoffGames);
        });
    });
  }

}
