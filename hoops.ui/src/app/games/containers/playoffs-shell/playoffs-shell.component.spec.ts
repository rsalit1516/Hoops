import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulePlayoffsComponent } from '@app/games/components/schedule-playoffs/schedule-playoffs.component';
import { Store } from '@ngrx/store';
import * as fromGames from '../../state';
import { GameService-deprecated } from '@app/games/game.service';
import { PlayoffGame } from '@app/domain/playoffGame';
import { PlayoffGameService } from '@app/services/playoff-game.service';

@Component({
  selector: 'csbc-playoffs-shell',
  imports: [CommonModule, SchedulePlayoffsComponent],
  providers: [GameService-deprecated, Store],
  template: `
    <div class="row">
    <h1>Playoffs</h1>
      <csbc-schedule-playoffs [playoffGames]="dailyPlayoffSchedule" />
  </div>`,
  styleUrl: './playoffs-shell.component.scss'
})
export class PlayoffsShellComponent implements OnInit {
  dailyPlayoffSchedule!: Array<PlayoffGame[]>;

  constructor (private store: Store<fromGames.State>,
    private gameService: PlayoffGameService) { }

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
