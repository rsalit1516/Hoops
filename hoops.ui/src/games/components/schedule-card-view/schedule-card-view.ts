import { Component, OnInit, Input, inject, effect } from '@angular/core';
import { RegularGame } from '../../../domain/regularGame';
import { GameService } from '@app/services/game.service';
import { GameCard } from '../game-card/game-card';

@Component({
  selector: 'csbc-schedule-card-view',
  templateUrl: "./schedule-card-view.html",
  styleUrls: ['./schedule-card-view.scss'],
  imports: [GameCard]
})
export class ScheduleCardView implements OnInit {
  private gameService = inject(GameService);

  errorMessage: string | undefined;
  public title: string;
  get games() {
    return this._games;
  }
  @Input()
  set games(games: RegularGame[] | null) {
    this._games = games;
  }
  private _games!: RegularGame[] | null;

  constructor() {
    this.title = 'Games!';
    effect(() => {
      this._games = this.gameService.divisionGames();
    });
  }

  ngOnInit() {}
}
