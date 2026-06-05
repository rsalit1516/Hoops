import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'sponsor-info',
    templateUrl: "./sponsor-info.html",
    styleUrls: ['./sponsor-info.css'],
    standalone: true
})
export class SponsorInfo implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
