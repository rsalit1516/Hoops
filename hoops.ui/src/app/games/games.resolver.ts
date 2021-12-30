import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import * as fromGames from './state';
import * as gameActions from './state/games.actions';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root',
})
export class GamesResolver implements Resolve<boolean> {
  constructor(
    private store: Store<fromGames.State>,
    private _gameService: GameService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    this.store.select(fromGames.getCurrentSeason).subscribe((season) => {
      const t = this._gameService.currentSeason$; // = season.seasonID;
      // this.store.dispatch(new gameActions.LoadDivisions());
      this.store.dispatch(new gameActions.LoadPlayoffGames());
      this.store.dispatch(new gameActions.LoadStandings());
      // this.store.select(fromGames.getDivisions).subscribe((divisions) => {
      //   console.log(divisions);
      //   this.store
      //     .select(fromGames.getCurrentDivision)
      //     .subscribe((division) => {
        //     if (division?.seasonId !== season?.seasonId) {
        //       console.log('wrong division set at init');
              // this.store.dispatch(
              //   new gameActions.SetCurrentDivision(divisions[0])
              // );
        //     }
          // });
      // });
    });
    return of(true);
  }
}
