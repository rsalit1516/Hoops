import { Component, OnInit, input } from '@angular/core';
import { RegularGame } from '../../../domain/regularGame';
import { NgIf, DatePipe } from '@angular/common';

@Component({
  selector: 'csbc-game-card',
  templateUrl: "./game-card.html",
  styleUrls: ['./game-card.scss'],
  imports: [NgIf, DatePipe]
})
export class GameCard implements OnInit {
  readonly game = input.required<RegularGame>();
  constructor () { }

  ngOnInit () {
  }

}
