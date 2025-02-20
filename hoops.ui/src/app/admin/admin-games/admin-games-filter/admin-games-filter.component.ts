import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DivisionSelectComponent } from '@app/admin/admin-shared/division-select/division-select.component';
import { GameTypeSelectComponent } from '@app/admin/admin-shared/game-type-select/game-type-select.component';
import { SeasonSelectComponent } from '@app/admin/admin-shared/season-select/season-select.component';

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
newGame() {
    throw new Error('Method not implemented.');
  }
}
