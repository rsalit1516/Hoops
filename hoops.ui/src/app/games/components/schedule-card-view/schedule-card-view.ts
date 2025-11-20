import { Component, OnInit, Input, inject } from '@angular/core';
import { RegularGame } from '../../../domain/regularGame';
import { Store, select } from '@ngrx/store';
import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';
import { GameCard } from '../game-card/game-card';


@Component({
  selector: 'csbc-schedule-card-view',
  templateUrl: "./schedule-card-view.html",
  styleUrls: ['./schedule-card-view.scss'],
  imports: [GameCard]
})
export class ScheduleCardView implements OnInit {
  private store = inject<Store<fromGames.State>>(Store);
  private userStore = inject<Store<fromUser.State>>(Store);

  errorMessage: string | undefined;
  public title: string;
  get games () {
    return this._games;
  }
  @Input()
  set games (games: RegularGame[] | null) {
    this._games = games;
    // console.log(games);
  }
  private _games!: RegularGame[] | null;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor () {
    this.title = 'Games!';
  }

  ngOnInit () {
    this.store.select(fromGames.getFilteredGames)
      .subscribe(games => {
        this.games = games;
        // this.dailySchedule = games;
      });
  }
}
