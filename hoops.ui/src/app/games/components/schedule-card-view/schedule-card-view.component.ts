import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../../domain/game';
import { Store, select } from '@ngrx/store';
import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';
import { GameCardComponent } from '../game-card/game-card.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'csbc-schedule-card-view',
    templateUrl: './schedule-card-view.component.html',
    styleUrls: ['./schedule-card-view.component.scss'],
    standalone: true,
    imports: [NgFor, GameCardComponent]
})
export class ScheduleCardViewComponent implements OnInit {
  errorMessage: string | undefined;
  public title: string;
  get games() {
    return this._games;
  }
  @Input()
  set games (games: Game[] | null) {
    this._games = games;
    // console.log(games);
  }
  private _games!: Game[] | null;

  constructor(    private store: Store<fromGames.State>,
    private userStore: Store<fromUser.State>) {
    this.title = 'Games!';
  }

  ngOnInit() {
    this.store.select(fromGames.getFilteredGames)
    .subscribe(games => {
      this.games = games;
      // this.dailySchedule = games;
    });
  }
}
