import { Component, OnInit, input, ChangeDetectionStrategy } from '@angular/core';
import { RegularGame } from '../../../domain/regularGame';
import { DatePipe } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csbc-game-card',
  templateUrl: "./game-card.html",
  styleUrls: ['./game-card.scss'],
  imports: [DatePipe]
})
export class GameCard implements OnInit {
  readonly game = input.required<RegularGame>();
  constructor () { }

  ngOnInit () {
  }

}
