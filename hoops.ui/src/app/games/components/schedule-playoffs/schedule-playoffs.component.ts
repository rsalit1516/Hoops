import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';
import { Game } from '@app/domain/game';

@Component({
  selector: 'schedule-playoffs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule-playoffs.component.html',
  styleUrls: ['./schedule-playoffs.component.scss']
})
export class SchedulePlayoffsComponent {
  @Input() divisionId: number | undefined;
  public games: Game[] | undefined;

  constructor(private store: Store<fromGames.State>) { }

  ngOnIt() {
    this.store.select(fromGames.getCurrentDivision).subscribe((division) => {
      this.store.select(fromGames.getFilteredGames).subscribe((games) => {
        this.games = games;

        // this.gameService.groupByDate(games).subscribe((dailyGames) => {
        //   this.dailySchedule.push(dailyGames);
        });
      });
    };
}


