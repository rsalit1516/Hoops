import { Component, OnInit, inject, input, output } from '@angular/core';

import { SeasonService } from '../../../services/season.service';
import { Season } from '../../../domain/season';
import { Observable } from 'rxjs';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'csbc-season-select',
  templateUrl: './csbc-season-select.component.html',
  styleUrls: ['./csbc-season-select.component.scss'],
  imports: [MatFormFieldModule, MatSelectModule, NgFor, MatOptionModule, AsyncPipe]
})
export class CsbcSeasonSelectComponent implements OnInit {
  private _seasonService = inject(SeasonService);
  readonly seasons$ = input<Observable<Season[]>>();
  selectedSeason = input<Season>(new Season());
  readonly setSeason = output<Season>(); // : Season;

  season: Season = new Season();
  constructor () { }

  ngOnInit () {
    // this.seasons = this._seasonService.getSeasons();
    console.log(this.seasons$());
    // this.selectedSeason = this.seasons[0];
  }

  onClick (season: Season): void {
    console.log(season);
    if (season.seasonId !== undefined) {
      //this.selectedSeason = season;
      console.log(season);
      this.setSeason.emit(season);
    }
  }
}
