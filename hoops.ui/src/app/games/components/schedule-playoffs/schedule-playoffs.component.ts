import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as fromGames from '../../state';
import { PlayoffGame } from '@domain/playoffGame';
import { DailyPlayoffScheduleComponent } from '../daily-playoff-schedule/daily-playoff-schedule.component';

@Component({
    selector: 'schedule-playoffs',
    template: `
    <section class="container">
      <div *ngFor="let data of playoffGames()">
        <csbc-daily-playoff-schedule [playoffGames]="data">
        </csbc-daily-playoff-schedule>
      </div>
    </section>
  `,
    styleUrls: ['./schedule-playoffs.component.scss'],
    imports: [CommonModule, DailyPlayoffScheduleComponent],
    providers: [Store]
})
export class SchedulePlayoffsComponent {
  readonly playoffGames = input.required<Array<PlayoffGame[]>>();
  public games: PlayoffGame[] | undefined;


  constructor(private store: Store<fromGames.State>) {
  }


}
