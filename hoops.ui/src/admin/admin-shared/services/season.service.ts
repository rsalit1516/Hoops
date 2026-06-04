import { inject, Injectable, signal } from '@angular/core';
import { Season } from '@app/domain/season';
import { SeasonService } from '@app/services/season.service';

@Injectable({
  providedIn: 'root',
})
export class AdminSeasonService {
  private readonly seasonService = inject(SeasonService);

  selectedSeason = signal<Season | undefined>(undefined);

  updateSelectedSeason(season: Season) {
    this.selectedSeason.update(() => season);
  }
}
