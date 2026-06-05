import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'drafted-players',
    templateUrl: "./drafted-players.html",
    styleUrls: ['./drafted-players.css'],
    standalone: true
})
export class DraftedPlayers implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
