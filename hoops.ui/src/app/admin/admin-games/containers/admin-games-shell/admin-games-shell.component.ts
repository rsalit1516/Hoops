import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as adminActions from '../../../state/admin.actions';
import * as fromAdmin from '../../../state';
import * as fromUser from '../../../../user/state';

import { GameService } from 'app/games/game.service';
import { Season } from '../../../../domain/season';
import { Game } from '@app/domain/game';
@Component({
  selector: 'csbc-admin-games-shell',
  templateUrl: './admin-games-shell.component.html',
  styleUrls: [
    './admin-games-shell.component.scss',
    '../../../admin.component.scss',
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
      this.showPlayoffs = (gameType == 'Playoffs');
      this.showRegularSeason = (gameType == 'Regular Season');
      if (gameType !== undefined) {
        console.log('Calling filtered games');
        this.store.dispatch(new adminActions.LoadDivisionGames());
        this.store.dispatch(new adminActions.LoadDivisionTeams());
      }
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
