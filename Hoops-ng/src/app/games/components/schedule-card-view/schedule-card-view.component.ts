import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../../domain/game';

@Component({
  selector: 'csbc-schedule-card-view',
  templateUrl: './schedule-card-view.component.html',
  styleUrls: ['./schedule-card-view.component.scss']
})
export class ScheduleCardViewComponent implements OnInit {
errorMessage: string;
  public title: string;
  get games () {
    return this._games;
  }
  @Input()
  set games (games: Game[]) {
    this._games = games;
    console.log(games);
  }
  private _games: Game[];

  constructor() {
    this.title = 'Games!';
  }

  ngOnInit() {}
}
