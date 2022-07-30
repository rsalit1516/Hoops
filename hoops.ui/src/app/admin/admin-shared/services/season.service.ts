import { Injectable } from '@angular/core';
import { Season } from '@app/domain/season';
import { DataService } from '@app/services/data.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as fromAdmin from '../../state';

@Injectable({
  providedIn: 'root',
})
export class SeasonService {
  seasons: Season[] | undefined;

  constructor(
    private store: Store<fromAdmin.State>,
    private dataService: DataService
  ) {}

  getSeason(id: number): Season {
    let selectedSeason = new Season();
    this.store.select(fromAdmin.getSeasons).subscribe((seasons) => {
      const s = seasons.find((season) => {
        // console.log(season);
        selectedSeason = season;
        return (season.seasonId === id);
      });
      // return s;
    });
    return selectedSeason;
  }
}
