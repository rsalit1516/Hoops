import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulePlayoffs } from '@app/games/components/schedule-playoffs/schedule-playoffs';
import { Store } from '@ngrx/store';
import * as fromGames from '../../state';
import { PlayoffGameService } from '@app/services/playoff-game.service';
import { PlayoffGame } from '@app/domain/playoffGame';
import { SeasonService } from '@app/services/season.service';

@Component({
  selector: 'csbc-playoffs-shell',
  imports: [CommonModule, SchedulePlayoffs],
  providers: [PlayoffGameService, Store],
  template: `
    <section class="container mx-auto">
    <h1>{{title}}</h1>
    <div class="row">
      <csbc-schedule-playoffs [playoffGames]="dailyPlayoffSchedule" />
      </div>
      </section>`,
  styleUrl: './playoffs-shell.scss'
})
export class PlayoffsShell implements OnInit {
  readonly #gameService = inject(PlayoffGameService);
  readonly #seasonService = inject(SeasonService);
  readonly #store = inject(Store<fromGames.State>);
  title = 'Playoff Schedule';
  dailyPlayoffSchedule!: Array<PlayoffGame[]>;
  playoffGames = computed(() => this.#gameService.divisionPlayoffGames());

  constructor () { }

  ngOnInit () {


    // this.#store.select(fromGames.getCurrentDivision).subscribe((division) => {
    //   this.#store
    //     .select(fromGames.getDivisionPlayoffGames)
    //     .subscribe((playoffGames) => {
    // this.dailyPlayoffSchedule = playoffGames;
    // console.log(playoffGames);
    this.dailyPlayoffSchedule = [];
    this.dailyPlayoffSchedule = this.#gameService
      .groupPlayoffGamesByDate(this.playoffGames()!);
    console.log(this.dailyPlayoffSchedule);
    // .subscribe(games => {
    //   this.dailyPlayoffSchedule.push(games);
    //   console.log(this.dailyPlayoffSchedule);
    // });
    //     });
    // });
  }

}
