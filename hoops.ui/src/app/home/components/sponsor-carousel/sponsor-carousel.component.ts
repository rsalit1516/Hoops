import { Component, OnInit } from '@angular/core';
import { throwMatDuplicatedDrawerError } from '@angular/material/sidenav';
import { Sponsor } from '@app/domain/sponsor';
import { HomeService } from '@app/home/home.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sponsor-carousel',
  templateUrl: './sponsor-carousel.component.html',
  styleUrls: ['../../home.component.scss'],
  providers: [NgbCarouselConfig],
})
export class SponsorCarouselComponent implements OnInit {
  showNavigationArrows = false;
  showNavigationIndicators = false;
  sponsors: Sponsor[] | undefined;
  constructor(private homeService: HomeService) {
    // config.showNavigationArrows = false;
    // config.showNavigationInidicators =true;
  }

  ngOnInit(): void {
    console.log('getting sponsors');
    this.homeService.getSponsorUrl().subscribe((x) => {
      console.log(x);
      this.sponsors = x;
    });
  }
}
