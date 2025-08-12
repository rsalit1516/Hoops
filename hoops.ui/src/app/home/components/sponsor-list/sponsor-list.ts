import { Component, OnInit } from '@angular/core';
import { Sponsor } from '@app/domain/sponsor';
import { Store } from '@ngrx/store';
import * as fromHome from '../../state';
import { NgFor } from '@angular/common';
// import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-sponsor-list',
    templateUrl: "./sponsor-list.html",
    styleUrls: ['./sponsor-list.scss', '../../home.scss'],
    imports: [ NgFor]
})
export class SponsorList implements OnInit {
  sponsors: Sponsor[] | undefined;

  constructor(private store: Store<fromHome.State>) { }

  ngOnInit(): void {
    this.store
    .select(fromHome.getSponsors)
    .subscribe((sponsors) => (this.sponsors = sponsors));
    // this.sponsors = this.getSponsors();

  }
  getSponsors(): Sponsor[] {
    const sponsor = new Sponsor();
    sponsor.name = 'Test';
    sponsor.phone = '999-999-9990';
    sponsor.website = 'https://cnn.com';
    let sponsors = [];
    sponsors.push(sponsor);
    const sponsor2 = new Sponsor();
    sponsor2.name = 'Test 2';
    sponsor2.phone = '999-992-9990';
    sponsor2.website = 'https://amazon.com';
    sponsors.push(sponsor2);
    return sponsors;
  }
}
