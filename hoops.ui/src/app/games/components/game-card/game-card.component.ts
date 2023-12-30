import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../../domain/game';
import { NgIf, DatePipe } from '@angular/common';

@Component({
    selector: 'csbc-game-card',
    templateUrl: './game-card.component.html',
    styleUrls: ['./game-card.component.scss'],
    standalone: true,
    imports: [NgIf, DatePipe]
})
export class GameCardComponent implements OnInit {
  @Input() game!: Game;
  constructor() { }

  ngOnInit() {
  }

}
