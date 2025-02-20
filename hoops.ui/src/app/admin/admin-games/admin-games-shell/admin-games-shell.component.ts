import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import * as adminActions from '../../state/admin.actions';
import * as fromAdmin from '../../state';

import { GameService } from '@app/services/game.service';
import { Season } from '../../../domain/season';
import { Game } from '@app/domain/game';
import { AdminGameDetailComponent } from '../admin-game-detail/admin-game-detail.component';
import { AdminGamesPlayoffsListComponent } from '../admin-games-playoffs-list/admin-games-playoffs-list.component';
import { AdminGamesListComponent } from '../admin-games-list/admin-games-list.component';
import { NgIf } from '@angular/common';
import { DivisionSelectComponent } from '../../admin-shared/division-select/division-select.component';
import { GameTypeSelectComponent } from '../../admin-shared/game-type-select/game-type-select.component';
import { SeasonSelectComponent } from '../../admin-shared/season-select/season-select.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ShellTitleComponent } from '@app/shared/shell-title/shell-title.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { AdminGamesPlayoffsDetailComponent } from "../admin-games-playoffs-detail/admin-games-playoffs-detail.component";
import { MatButtonModule } from '@angular/material/button';
import { AdminGamesFilterComponent } from '../admin-games-filter/admin-games-filter.component';
@Component({
  selector: 'csbc-admin-games-shell',
  templateUrl: './admin-games-shell.component.html',

  styleUrls: [
    './admin-games-shell.component.scss',
    '../../admin.component.scss',
    '../../../shared/scss/forms.scss',
  ],
  imports: [
    MatToolbarModule,
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
  gameService = inject(GameService);
  pageTitle = 'Game Management';
  isSidenavOpen = false;

  seasons$ = this.store.select(fromAdmin.getSeasons);
  divisions$ = this.store.select(fromAdmin.getSeasonDivisions);
  showRegularSeason = true;
  showPlayoffs = false;
  games: Game[] | undefined;

  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('firstPanel') firstPanel!: MatExpansionPanel;

  constructor(
    private store: Store<fromAdmin.State>,

  ) {
        effect(() => {
          const record = this.gameService.selectedRecordSignal();
          console.log('Selected record changed:', record);
          if (record !== null) {
            console.log(`Record updated: ${record.gameScheduleId}`);
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

  ngOnInit(): void {
    this.store.select(fromAdmin.getSelectedDivision).subscribe((division) => {
      console.log(division);
      if (division !== undefined) {
        this.store.dispatch(new adminActions.LoadDivisionGames());
        this.store.dispatch(new adminActions.LoadDivisionTeams());
      }
    });
    this.store.select(fromAdmin.getSelectedTeam).subscribe((team) => {
      console.log(team);
      if (team !== undefined) {
        this.store.dispatch(new adminActions.LoadTeamGames());
        // this.store.dispatch(new adminActions.LoadDivisionTeams());
      }
    });
    this.store.select(fromAdmin.getGameType).subscribe((gameType) => {
      console.log(gameType);
      console.log((gameType === 'Regular Season'));
      this.showPlayoffs = (gameType === 'Playoffs');
      this.showRegularSeason = (gameType === 'Regular Season');
      if (gameType !== undefined) {
        console.log('Calling filtered games');
        this.store.dispatch(new adminActions.LoadDivisionGames());
        this.store.dispatch(new adminActions.LoadDivisionTeams());
      }
    });
    this.store.select(fromAdmin.getDivisionGames).subscribe((games) => {
      this.store.dispatch(new adminActions.SetFilteredGames(games as Game[]));
    });
    this.store.select(fromAdmin.getFilteredGames).subscribe((games) => {
      this.games = games;
    });

  }
  selectedSeason(season: Season) {
    // this.store.dispatch(new adminActions.SetCurrentSeason(season));
  }
  clickedDivision(division: MouseEvent) {
    // TODO: need to change the parameter
    console.log(division);
  }
  newGame() {

  }
  closeSidenav() {
    this.isSidenavOpen = false;
  }
}
