import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

import { SeasonService } from '../../services/season.service';
import { Season } from '../../domain/season';
import { Observable } from 'rxjs';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'csbc-season-select',
    templateUrl: './csbc-season-select.component.html',
    styleUrls: ['./csbc-season-select.component.scss'],
    standalone: true,
    imports: [MatFormFieldModule, MatSelectModule, NgFor, MatOptionModule, AsyncPipe]
})
export class CsbcSeasonSelectComponent implements OnInit {
  @Input() seasons$: Observable<Season[]> | undefined;
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
    if (season.seasonId !== undefined) {
      this.selectedSeason = season;
      console.log(season);
      this.setSeason.emit(season);
    }
  }
}
