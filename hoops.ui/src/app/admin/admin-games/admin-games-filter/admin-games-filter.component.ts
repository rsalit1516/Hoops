import { Component, EventEmitter, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DivisionSelectComponent } from '@app/admin/admin-shared/division-select/division-select.component';
import { GameTypeSelectComponent } from '@app/admin/admin-shared/game-type-select/game-type-select.component';
import { SeasonSelectComponent } from '@app/admin/admin-shared/season-select/season-select.component';
import { Division } from '@app/domain/division';
import { Season } from '@app/domain/season';

@Component({
  selector: 'csbc-admin-games-filter',
  imports: [ MatToolbarModule,
    SeasonSelectComponent,
    GameTypeSelectComponent,
    DivisionSelectComponent,
  ],
  templateUrl: './admin-games-filter.component.html',
  styleUrls: [ './admin-games-filter.component.scss',
    '../../admin.component.scss',
  ],
})
export class AdminGamesFilterComponent {
  selectSeason: Season | undefined;
  selectDivision: Division | undefined;

  selectGameType: string = 'Regular Season';

  @Output() gameFilterChanged = new EventEmitter<{ season: Season; gameType: string; division: Division }>();

  // gameFilterEvent = EventEmitter(Season, gameType, Division, );
  newGame() {
    throw new Error('Method not implemented.');
  }

  handleSeasonChange(season: Season) {
    console.log('Selected season:', season);
    // Handle the selected season
  }
  handleDivisionChange(division: Division) {
    console.log('Selected division:', division);
    // Handle the selected season
  }
  handleGameTypeChange(gameType: string) {
    console.log('Selected gameType:', gameType);
    if (this.selectSeason && this.selectDivision) {
      this.gameFilterChanged.emit({ season: this.selectSeason, gameType, division: this.selectDivision });
    } else {
      console.error('Season or Division is undefined');
    }
    // Handle the selected season
  }
}
