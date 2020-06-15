import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { SeasonService } from '../../services/season.service';
import { Season } from '../../domain/season';

@Component({
  selector: 'csbc-season-select',
  templateUrl: './csbc-season-select.component.html',
  styleUrls: ['./csbc-season-select.component.css']
})
export class CsbcSeasonSelectComponent implements OnInit {
  @Input() seasons$: Observable<Season[]>;
  @Input() selectedSeason: Season = new Season();
  @Output() setSeason = new EventEmitter<Season>(); // : Season;
  
  season: Season = new Season();
  constructor(private _seasonService: SeasonService) {}

  ngOnInit() {
    // this.seasons = this._seasonService.getSeasons();
    console.log(this.seasons$);
    // this.selectedSeason = this.seasons[0];
  }

  onClick(season: Season): void {
    console.log(season);
    if (season.seasonID !== undefined) {
      this.selectedSeason = season;
      console.log(season);
      this.setSeason.emit(season);
    }
  }
}
