import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as adminActions from '../../../state/admin.actions';
import * as fromAdmin from '../../../state';

import { GameService } from '@app/games/game.service';
import { Season } from '../../../../domain/season';
import { Game } from '@app/domain/game';
import { AdminGameDetailComponent } from '../../../admin-shared/admin-game-detail/admin-game-detail.component';
import { AdminGamesPlayoffsListComponent } from '../../components/admin-games-playoffs-list/admin-games-playoffs-list.component';
import { AdminGamesListComponent } from '../../../admin-shared/admin-games-list/admin-games-list.component';
import { NgIf } from '@angular/common';
import { DivisionSelectComponent } from '../../../admin-shared/division-select/division-select.component';
import { GameTypeSelectComponent } from '../../../admin-shared/game-type-select/game-type-select.component';
import { SeasonSelectComponent } from '../../../admin-shared/season-select/season-select.component';
import { MatToolbarModule } from '@angular/material/toolbar';
@Component({
    selector: 'csbc-admin-games-shell',
    templateUrl: './admin-games-shell.component.html',
    styleUrls: [
        './admin-games-shell.component.scss',
        '../../../admin.component.scss',
    ],
    standalone: true,
    imports: [
        MatToolbarModule,
        SeasonSelectComponent,
        GameTypeSelectComponent,
        DivisionSelectComponent,
        NgIf,
        AdminGamesListComponent,
        AdminGamesPlayoffsListComponent,
        AdminGameDetailComponent,
    ],
})
export class AdminGamesShellComponent implements OnInit {
  seasons$ = this.store.select(fromAdmin.getSeasons);
  divisions$ = this.store.select(fromAdmin.getSeasonDivisions);
  showRegularSeason = true;
  showPlayoffs = false;
  games: Game[] | undefined;

  constructor(
    private store: Store<fromAdmin.State>,
    private gameService: GameService
  ) {}

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
}
