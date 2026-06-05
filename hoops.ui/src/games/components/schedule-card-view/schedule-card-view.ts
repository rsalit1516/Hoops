import { Component, OnInit, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { RegularGame } from '../../../domain/regularGame';
import { GameCard } from '../game-card/game-card';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csbc-schedule-card-view',
  templateUrl: "./schedule-card-view.html",
  styleUrls: ['./schedule-card-view.scss'],
  imports: [GameCard]
})
export class ScheduleCardView implements OnInit {
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

  ngOnInit () {}
}
