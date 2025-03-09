import { inject, Injectable, signal } from '@angular/core';
import { Season } from '@app/domain/season';
import { DataService } from '@app/services/data.service';
import { Store } from '@ngrx/store';
import * as fromAdmin from '../../state';
import { SeasonService } from '@app/services/season.service';

@Injectable({
  providedIn: 'root',
})
export class AdminSeasonService {
  private store = inject(Store<fromAdmin.State>);

  seasons: Season[] | undefined;
  selectedSeason = signal<Season | undefined>(undefined);

  constructor () { }

  getSeason (id: number): Season {
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
  updateSelectedSeason (season: Season) {
    this.selectedSeason.update(() => season);
  }
}
