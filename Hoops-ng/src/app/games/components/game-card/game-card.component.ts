import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../../domain/game';

@Component({
  selector: 'csbc-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent implements OnInit {
  @Input() game: Game;
  constructor() { }

  ngOnInit() {
  }

}
