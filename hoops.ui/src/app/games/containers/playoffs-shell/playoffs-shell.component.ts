import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulePlayoffsComponent } from '@app/games/components/schedule-playoffs/schedule-playoffs.component';
import { Store } from '@ngrx/store';
import * as fromGames from '../../state';
import { GameService } from '@app/games/game.service';
import { PlayoffGame } from '@app/domain/playoffGame';

@Component({
  selector: 'csbc-playoffs-shell',
  standalone: true,
  imports: [ CommonModule, SchedulePlayoffsComponent ],
  providers: [ GameService, Store],
  template: `
    <div class="row">
    <h1>Playoffs</h1>
      <schedule-playoffs [playoffGames]="dailyPlayoffSchedule"> </schedule-playoffs>
  </div>`,
  styleUrl: './playoffs-shell.component.scss'
})
export class PlayoffsShellComponent implements OnInit  {
  dailyPlayoffSchedule!: Array<PlayoffGame[]>;

  constructor(private store: Store<fromGames.State>,
    private gameService: GameService ) { }

  ngOnInit() {
    this.store.select(fromGames.getCurrentDivision).subscribe((division) => {
      this.store
        .select(fromGames.getDivisionPlayoffGames)
        .subscribe((playoffGames) => {
          // this.dailyPlayoffSchedule = playoffGames;
          // console.log(playoffGames);
          this.dailyPlayoffSchedule = [];
          this.gameService
            .groupPlayoffsByDate(playoffGames)
            .subscribe(games => {
              this.dailyPlayoffSchedule.push(games);
              console.log(this.dailyPlayoffSchedule);
            });
        });
    });
  }

}
