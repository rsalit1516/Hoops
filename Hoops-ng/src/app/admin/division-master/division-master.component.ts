import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { CsbcSeasonSelectComponent } from '../../shared/season-select/csbc-season-select.component';
import { Season } from '../../domain/season';
import { SeasonService } from '../../services/season.service';

@Component({
  selector: 'csbc-division-master',
  templateUrl: './division-master.component.html',
  styleUrls: ['./division-master.component.css']
})
export class DivisionMasterComponent implements OnInit {
  selectedSeason: Observable<Season>;
   seasons: Observable<Season[]>;
  constructor(public seasonService: SeasonService) { }

  ngOnInit() {
    this.seasons = this.seasonService.getSeasons();
    // this.selectedSeason = this.seasons[0];
    console.log(this.selectedSeason);
    if (this.selectedSeason !== undefined) {
      this.seasonService.selectedSeason$.subscribe(
           
        () => console.log('Help'));
    }
  }
  setSeason() {
    // this.selectedSeason = season;
    
    this.selectedSeason = this.seasonService.selectedSeason$;
    console.log(this.selectedSeason);
    //this.seasonService.selectedSeason$.subscribe(
           
           
  //          () => console.log('Help'));
  }

}
