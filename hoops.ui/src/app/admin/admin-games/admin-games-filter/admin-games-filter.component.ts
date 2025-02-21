import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DivisionSelectComponent } from '@app/admin/admin-shared/division-select/division-select.component';
import { GameTypeSelectComponent } from '@app/admin/admin-shared/game-type-select/game-type-select.component';
import { SeasonSelectComponent } from '@app/admin/admin-shared/season-select/season-select.component';
import { Division } from '@app/domain/division';
import { Season } from '@app/domain/season';

@Component({
  selector: 'csbc-admin-games-filter',
  imports: [MatToolbarModule,
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
selectSeason: any;
selectGameType: any;
newGame() {
    throw new Error('Method not implemented.');
  }

handleSeasonChange(season: Season) {
  console.log('Selected season:', season);
  // Handle the selected season
  }
  handleDivisionChange (division: Division) {
    console.log('Selected division:', division);
    // Handle the selected season
  }
  handleGameTypeChange (gameType: string) {
    console.log('Selected gameType:', gameType);
    // Handle the selected season
  }
}
