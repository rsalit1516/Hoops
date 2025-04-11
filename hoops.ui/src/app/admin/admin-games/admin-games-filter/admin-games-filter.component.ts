import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { DivisionSelectComponent } from '@app/admin/admin-shared/division-select/division-select.component';
import { GameTypeSelectComponent } from '@app/admin/admin-shared/game-type-select/game-type-select.component';
import { SeasonSelectComponent } from '@app/admin/admin-shared/season-select/season-select.component';
import { Division } from '@app/domain/division';
import { Season } from '@app/domain/season';
import { DivisionService } from '@app/services/division.service';
import { SeasonService } from '@app/services/season.service';

@Component({
  selector: 'csbc-admin-games-filter',
  imports: [MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    SeasonSelectComponent,
    GameTypeSelectComponent,
    DivisionSelectComponent,
  ],
  templateUrl: './admin-games-filter.component.html',
  styleUrls: ['./admin-games-filter.component.scss',
    '../../admin.component.scss',
  ],
})
export class AdminGamesFilterComponent {
  @Output() gameFilterChanged = new EventEmitter<{ season: Season; gameType: string; division: Division }>();
  readonly #router = inject(Router);
  #seasonService = inject(SeasonService);
  #divisionService = inject(DivisionService);

  selectSeason: Season | undefined;
  selectDivision: Division | undefined;

  selectedSeason = signal<Season | undefined>(undefined);
  selectedDivision = signal<Division | null>(null) as any;

  selectGameType: string = 'Regular Season';


  // gameFilterEvent = EventEmitter(Season, gameType, Division, );
  newGame () {
    this.#router.navigate(['./admin/games/detail-regular']);
  }

  handleSeasonChange (season: Season) {
    console.log('Selected season:', season);
    // Handle the selected season
  }
  handleDivisionChange (division: Division) {
    console.log('Selected division:', division);
    // Handle the selected season
  }
  handleGameTypeChange (gameType: string) {
    console.log('Selected gameType:', gameType);
    console.log('Selected season:', this.selectedSeason());
    console.log('Selected division:', this.selectedDivision());
    if (!this.selectedSeason()) {
      this.#seasonService.updateSelectedSeason(this.selectedSeason()!);
    }
    if (!this.selectedDivision) {
      this.selectedDivision.update(() => this.#divisionService.selectedDivision);
    }
    console.log('Selected season:', this.selectedSeason());
    console.log('Selected division:', this.selectedDivision());

    // if (this.selectedSeason() && this.selectedDivision()) {
    this.gameFilterChanged.emit({ season: this.selectedSeason()!, gameType, division: this.selectedDivision() });
    // } else {
    //   console.error('Season or Division is undefined');
    // }
    // Handle the selected season
  }
}
