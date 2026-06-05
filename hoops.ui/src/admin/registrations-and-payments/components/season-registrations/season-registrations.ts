import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'season-registrations',
    templateUrl: "./season-registrations.html",
    styleUrls: ['./season-registrations.css'],
    standalone: true
})
export class SeasonRegistrations implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
