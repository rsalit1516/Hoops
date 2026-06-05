import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'player-info',
    templateUrl: "./player-info.html",
    styleUrls: ['./player-info.css'],
    standalone: true
})
export class PlayerInfo implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
