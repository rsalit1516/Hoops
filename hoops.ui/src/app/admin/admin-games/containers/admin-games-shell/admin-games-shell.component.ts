import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as adminActions from '../../../state/admin.actions';
import * as fromAdmin from '../../../state';
import * as fromUser from '../../../../user/state';

import { GameService } from 'app/games/game.service';
import { Season } from '../../../../domain/season';
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
  
  constructor(
    private store: Store<fromAdmin.State>,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.store.select(fromAdmin.getSelectedSeason).subscribe((season) => {
      console.log(season);
      if (season !== undefined) {
        this.store.dispatch(new adminActions.LoadGames());
        this.store.dispatch(new adminActions.LoadDivisions());
        this.store.dispatch(new adminActions.LoadSeasonTeams());
        this.store.dispatch(new adminActions.LoadPlayoffGames());
      }
    });

    this.store.select(fromAdmin.getSelectedDivision).subscribe((division) => {
      console.log(division);
      if (division !== undefined) {
        this.store.dispatch(new adminActions.LoadFilteredGames());
        this.store.dispatch(new adminActions.LoadDivisionTeams());
      }
    });
  }
  selectedSeason(season: Season) {
    console.log(season);
    // this.store.dispatch(new adminActions.SetCurrentSeason(season));
  }
  clickedDivision(division: MouseEvent) {
    // TODO: need to change the parameter
    console.log(division);
  }
}
