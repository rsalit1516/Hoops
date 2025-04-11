import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
// import { CsbcSeasonSelectComponent } from '../../shared/season-select/csbc-season-select.component';
import { Season } from '../../domain/season';
import { SeasonService } from '../../services/season.service';
import { DivisionListComponent } from '../admin-divisions/admin-division-list/divisionList.component';
import { CsbcSeasonSelectComponent } from '../../shared/season-select/csbc-season-select.component';

@Component({
    selector: 'csbc-division-master',
    templateUrl: './division-master.component.html',
    styleUrls: ['./division-master.component.css'],
    imports: [CsbcSeasonSelectComponent, DivisionListComponent]
})
export class DivisionMasterComponent implements OnInit {
  selectedSeason?: Season;//  = signal(new Season() );
  seasonService = inject(SeasonService);
  seasons = signal(this.seasonService.selectedSeason);

  constructor() { }

  ngOnInit() {
    if (this.seasonService.selectedSeason !== undefined) {
      this.selectedSeason = this.seasonService.seasons![ 0 ];
    }
      // .subscribe(seasons => {
      //   // this.seasons = seasons;
      //   this.selectedSeason = seasons[ 0 ];
      //   console.log(this.selectedSeason);
      // });
    // this.selectedSeason.update(this.seasonService.season);
  }
  setSeason() {
    // this.selectedSeason = season;

    // this.selectedSeason = this.seasonService.selectedSeason;
    // console.log(this.selectedSeason);
    //this.seasonService.selectedSeason$.subscribe(


  //          () => console.log('Help'));
  }

}
