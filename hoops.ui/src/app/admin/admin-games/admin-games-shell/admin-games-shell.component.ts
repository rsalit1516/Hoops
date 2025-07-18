import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import * as adminActions from '../../state/admin.actions';
import * as fromAdmin from '../../state';

// import { GameService } from '@app/services/game.service';
import { Season } from '@app/domain/season';
import { RegularGame } from '@app/domain/regularGame';
import { AdminGameDetailComponent } from '../admin-game-detail/admin-game-detail.component';
import { AdminGamesPlayoffsListComponent } from '../admin-games-playoffs-list/admin-games-playoffs-list.component';
import { AdminGamesListComponent } from '../admin-games-list/admin-games-list.component';
import { NgIf } from '@angular/common';
import { DivisionSelectComponent } from '../../admin-shared/division-select/division-select.component';
import { GameTypeSelectComponent } from '../../admin-shared/game-type-select/game-type-select.component';
import { SeasonSelectComponent } from '../../admin-shared/season-select/season-select.component';
import { ShellTitleComponent } from '@app/shared/shell-title/shell-title.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { AdminGamesPlayoffsDetailComponent } from "../admin-games-playoffs-detail/admin-games-playoffs-detail.component";
import { MatButtonModule } from '@angular/material/button';
import { AdminGamesFilterComponent } from '../admin-games-filter/admin-games-filter.component';
import { AdminGameService } from '../adminGame.service';
import { LoggerService } from '@app/services/logging.service';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'csbc-admin-games-shell',
  template: `<section class="container">
  <h2>{{title}}</h2>
  <router-outlet></router-outlet>
</section>`,

  styleUrls: [
    './admin-games-shell.component.scss',
    '../../admin.component.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ],
  imports: [
    // MatToolbarModule,
    RouterOutlet,

    MatSidenavModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    SeasonSelectComponent,
    GameTypeSelectComponent,
    DivisionSelectComponent,
    NgIf,
    AdminGamesListComponent,
    AdminGamesPlayoffsListComponent,
    AdminGameDetailComponent,
    ShellTitleComponent,
    AdminGamesPlayoffsDetailComponent,
    AdminGamesFilterComponent
  ]
})
export class AdminGamesShellComponent implements OnInit {
  readonly #logger = inject(LoggerService);
  readonly gameService = inject(AdminGameService);
  readonly #store = inject(Store<fromAdmin.State>);
  pageTitle = 'Game Management';
  title = 'Game Management';
  isSidenavOpen = false;
  seasons$ = this.#store.select(fromAdmin.getSeasons);
  divisions$ = this.#store.select(fromAdmin.getSeasonDivisions);
  showRegularSeason = true;
  showPlayoffs = false;
  games: RegularGame[] | undefined;

  selectedRecord = signal<RegularGame | null>(null);
  // this.gameService.selectedRecordSignal();

  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('firstPanel') firstPanel!: MatExpansionPanel;

  constructor (


  ) {
    effect(() => {
      const record = this.gameService.selectedRecordSignal();
      console.log('Selected record changed:', record);
      if (record !== null) {
        console.log(`Record updated: ${ record.scheduleGamesId }`);
        this.selectedRecord.set(record);
        this.isSidenavOpen = true;
        // Allow the sidenav to open first, then expand the first panel
        setTimeout(() => {
          if (this.firstPanel) {
            this.firstPanel.expanded = true;
          }
        }, 300);
      }
    });

  }

  ngOnInit (): void {
    this.gameService.filteredGames();
    console.log(this.gameService.filteredGames());
    // console.log((gameType === 'Regular Season'));
    // this.showPlayoffs = (gameType === 'Playoffs');
    // this.showRegularSeason = (gameType === 'Regular Season');
    // if (gameType !== undefined) {
    //   console.log('Calling filtered games');
    //   this.#store.dispatch(new adminActions.LoadDivisionGames());
    //   this.#store.dispatch(new adminActions.LoadDivisionTeams());
    //   this.#store.dispatch(new adminActions.LoadPlayoffGames());
    // }

  }
  selectedSeason (season: Season) {
    // this.store.dispatch(new adminActions.SetCurrentSeason(season));
  }
  clickedDivision (division: MouseEvent) {
    // TODO: need to change the parameter
    console.log(division);
  }
  newGame () {

  }
  closeSidenav () {
    this.isSidenavOpen = false;
  }
  handlefilterUpdate ($event: any) {
    // console.log($event);
    // console.log($event.division);
    // console.log($event.season);
    this.#logger.log($event.gametType);
    if ($event.gameType === 'Playoffs') {
      this.showPlayoffs = true;
      this.showRegularSeason = false;
    } else {
      this.showPlayoffs = false;
      this.showRegularSeason = true;

    }
  }
}
