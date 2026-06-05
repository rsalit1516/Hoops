import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-sponsor-listing',
    templateUrl: "./sponsor-listing.html",
    styleUrls: ['./sponsor-listing.scss'],
    standalone: true
})
export class SponsorListing implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
