import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulePlayoffsComponent } from '@app/games/components/schedule-playoffs/schedule-playoffs.component';
import { Store } from '@ngrx/store';
import * as fromGames from '../../state';
import { GameService } from '@app/games/game.service';
import { PlayoffGame } from '@app/domain/playoffGame';

@Component({
  selector: 'csbc-playoffs-shell',
  imports: [CommonModule, SchedulePlayoffsComponent],
  providers: [GameService, Store],
  template: `
    <section class="container mx-auto">
    <h1>Playoffs</h1>
      <csbc-schedule-playoffs [playoffGames]="dailyPlayoffSchedule" />
</section>`,
  styleUrl: './playoffs-shell.component.scss'
})
export class PlayoffsShellComponent implements OnInit {
  private gameService = inject(GameService);
  dailyPlayoffSchedule!: Array<PlayoffGame[]>;

  constructor (private store: Store<fromGames.State>) { }

  ngOnInit () {
    this.store.select(fromGames.getCurrentDivision).subscribe((division) => {
      this.store
        .select(fromGames.getDivisionPlayoffGames)
        .subscribe((playoffGames) => {
          // this.dailyPlayoffSchedule = playoffGames;
          // console.log(playoffGames);
          this.dailyPlayoffSchedule = [];
          this.dailyPlayoffSchedule = this.gameService
            .groupPlayoffsByDate(playoffGames);
          // .subscribe(games => {
          //   this.dailyPlayoffSchedule.push(games);
          //   console.log(this.dailyPlayoffSchedule);
          // });
        });
    });
  }

}
