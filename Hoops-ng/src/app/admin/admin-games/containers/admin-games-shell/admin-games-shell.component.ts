import { Component, OnInit } from '@angular/core';
import * as fromGames from '../../../../games/state';
import * as gameActions from '../../../../games/state/games.actions';
import { Store } from '@ngrx/store';

import * as adminActions from '../../../state/admin.actions';
import * as fromAdmin from '../../../state';
import * as fromUser from '../../../../user/state';

import { GameService } from 'app/games/game.service';
import { LoadSeasons } from './../../../state/admin.actions';

@Component({
  selector: 'csbc-admin-games-shell',
  templateUrl: './admin-games-shell.component.html',
  styleUrls: [
    './admin-games-shell.component.scss',
    '../../../admin.component.scss'
  ]
})
export class AdminGamesShellComponent implements OnInit {
  seasons$ = this.store.select(fromAdmin.getSeasons);
  divisions$ = this.store.select(fromAdmin.getSeasonDivisions);
  constructor(
    private store: Store<fromGames.State>,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    //    this.store.dispatch(new adminActions.LoadSeasons());

    this.store.select(fromAdmin.getCurrentSeason).subscribe(season => {
      console.log(season);

//       this.store.dispatch(new gameActions.Load());
      this.store.dispatch(new gameActions.LoadDivisions());
//       this.store.dispatch(new gameActions.LoadTeams());
    });
  }
  selectedSeason(season) {
    console.log(season);
    this.store.dispatch(new gameActions.SetCurrentSeason(season));
  }
  clickedDivision(division) {
    console.log(division);
  }
}
