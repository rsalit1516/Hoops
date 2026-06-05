import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'current-season-sponsors',
    templateUrl: "./current-season-sponsors.html",
    styleUrls: ['./current-season-sponsors.css'],
    standalone: true
})
export class CurrentSeasonSponsors implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
