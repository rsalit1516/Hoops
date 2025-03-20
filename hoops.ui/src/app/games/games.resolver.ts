import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import * as fromGames from './state';
import * as gameActions from './state/games.actions';
import { GameService } from '@app/services/game.service';

@Injectable({
  providedIn: 'root',
})
export class GamesResolver {
  constructor (
    private store: Store<fromGames.State>,
    private _gameService: GameService
  ) { }

  resolve (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return of(true);
  }
}
