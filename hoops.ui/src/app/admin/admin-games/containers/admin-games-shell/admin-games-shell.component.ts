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
    '../../../admin.component.scss'
  ]
})
export class AdminGamesShellComponent implements OnInit {
  seasons$ = this.store.select(fromAdmin.getSeasons);
  divisions$ = this.store.select(fromAdmin.getSeasonDivisions);
  constructor(
    private store: Store<fromAdmin.State>,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    //    this.store.dispatch(new adminActions.LoadSeasons());

    this.store.select(fromAdmin.getCurrentSeason).subscribe(season => {
      console.log(season);

//       this.store.dispatch(new adminActions.Load());
      this.store.dispatch(new adminActions.LoadDivisions());
      this.store.dispatch(new adminActions.LoadTeams());
    });
  }
  selectedSeason(season: Season) {
    console.log(season);
    this.store.dispatch(new adminActions.SetCurrentSeason(season));
  }
  clickedDivision(division: MouseEvent) {
    // TODO: need to change the parameter
    console.log(division);
  }
}
