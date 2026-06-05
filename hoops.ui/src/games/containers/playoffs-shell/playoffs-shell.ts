import { Component, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { SchedulePlayoffs } from '@app/games/components/schedule-playoffs/schedule-playoffs';
import { PlayoffGameService } from '@app/services/playoff-game.service';
import { PlayoffGame } from '@app/domain/playoffGame';
import { SeasonService } from '@app/services/season.service';
import { LoggerService } from '@app/services/logger.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csbc-playoffs-shell',
  imports: [SchedulePlayoffs],
  providers: [PlayoffGameService],
  template: ` <section class="container mx-auto">
    <h2>{{ title }}</h2>
    <div class="row">
      <csbc-schedule-playoffs [playoffGames]="dailyPlayoffSchedule" />
    </div>
  </section>`,
  styleUrl: './playoffs-shell.scss',
})
export class PlayoffsShell implements OnInit {
  readonly #gameService = inject(PlayoffGameService);
  readonly #seasonService = inject(SeasonService);
  private readonly logger = inject(LoggerService);
  title = 'Playoff Schedule';
  dailyPlayoffSchedule!: Array<PlayoffGame[]>;
  playoffGames = computed(() => this.#gameService.divisionPlayoffGames());

  constructor() {}

  ngOnInit() {
    // this.#store.select(fromGames.getCurrentDivision).subscribe((division) => {
    //   this.#store
    //     .select(fromGames.getDivisionPlayoffGames)
    //     .subscribe((playoffGames) => {
    // this.dailyPlayoffSchedule = playoffGames;
    this.dailyPlayoffSchedule = [];
    this.dailyPlayoffSchedule = this.#gameService.groupPlayoffGamesByDate(
      this.playoffGames()!,
    );
    this.logger.debug('Daily playoff schedule:', this.dailyPlayoffSchedule);
    // .subscribe(games => {
    //   this.dailyPlayoffSchedule.push(games);
    //   console.log(this.dailyPlayoffSchedule);
    // });
    //     });
    // });
  }
}
