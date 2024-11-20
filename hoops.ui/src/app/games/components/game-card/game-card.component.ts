import { Component, OnInit, input } from '@angular/core';
import { Game } from '../../../domain/game';
import { NgIf, DatePipe } from '@angular/common';

@Component({
    selector: 'csbc-game-card',
    templateUrl: './game-card.component.html',
    styleUrls: ['./game-card.component.scss'],
    imports: [NgIf, DatePipe]
})
export class GameCardComponent implements OnInit {
  readonly game = input.required<Game>();
  constructor() { }

  ngOnInit() {
  }

}
