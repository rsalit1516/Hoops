import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as adminActions from './admin.actions';
// import * as fromGames from './state';
import {
  map,
  switchMap,
  mergeMap,
  catchError,
  concatMap,
  withLatestFrom,
  tap,
  shareReplay
} from 'rxjs/operators';
import { Store, Action, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { SeasonService } from 'app/services/season.service';
import { DivisionService } from 'app/services/division.service';
// import { GameService } from '../game.service';
import * as fromAdmin from './';
import { Game } from 'app/domain/game';
import { HttpClient } from '@angular/common/http';
import { GameService } from 'app/games/game.service';
import { TeamService } from 'app/services/team.service';
import { DataService } from 'app/services/data.service';
import { Division } from 'app/domain/division';

@Injectable()
export class AdminEffects {
  seasonId: number;
  gameUrl: string;
  divisionStartUrl: string;
  constructor(
    private actions$: Actions,
    private seasonService: SeasonService,
    private divisionService: DivisionService,
    private http: HttpClient,
    private gameService: GameService,
    private teamService: TeamService,
    private dataService: DataService,
    private store: Store<fromAdmin.State>
  ) {}

  // tslint:disable-next-line:member-ordering
  @Effect()
  loadSeasons$: Observable<Action> = this.actions$.pipe(
    ofType(adminActions.AdminActionTypes.LoadSeasons),
    mergeMap(action =>
      this.seasonService.seasons$.pipe(
        map(seasons => new adminActions.LoadSeasonsSuccess(seasons)),
        catchError(err => of(new adminActions.LoadSeasonsFail(err)))
      )
    )
  );

    // tslint:disable-next-line:member-ordering
    @Effect()
    loadDivisions$: Observable<Action> = this.actions$.pipe(
      ofType(adminActions.AdminActionTypes.LoadDivisions),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.pipe(select(fromAdmin.getCurrentSeason))),
          tap(divisions => console.log(divisions))
        )
      ),
      tap(([action, t]) => {
        if (t) {
          this.seasonId = t.seasonID;
        } else {
          this.seasonId = 0;
        }
      }),
      mergeMap(action =>
        this.http.get<Division[]>(this.divisionStartUrl + this.seasonId).pipe(
          // tap(data => console.log('All games: ' + JSON.stringify(data))),
          shareReplay(1),
          map(divisions => new adminActions.LoadDivisionsSuccess(divisions)),
          tap(divisions => console.log(divisions)),
          catchError(err => of(new adminActions.LoadDivisionsFail(err)))
        )
      )
    );
  
  // tslint:disable-next-line:member-ordering
  @Effect()
  loadGames$: Observable<Action> = this.actions$.pipe(
    ofType(adminActions.AdminActionTypes.LoadGames),
    concatMap(action =>
      of(action).pipe(
        withLatestFrom(this.store.pipe(select(fromAdmin.getCurrentSeason))),
        tap(divisions => console.log(divisions))
      )
    ),
    tap(([action, t]) => {
      if (t) {
        this.seasonId = t.seasonID;
      } else {
        this.seasonId = 0;
      }
    }),

    mergeMap(action =>
      this.http.get<Game[]>(this.gameUrl + this.seasonId).pipe(
        // tap(data => console.log('All games: ' + JSON.stringify(data))),
        shareReplay(1),
        map(games => new adminActions.LoadGamesSuccess(games)),
        tap(games => console.log(games)),
        catchError(err => of(new adminActions.LoadGamesFail(err)))
      )
    )
  );
    // tslint:disable-next-line:member-ordering
    @Effect()
    setCurrentSeason$: Observable<Action> = this.actions$.pipe(
      ofType(adminActions.AdminActionTypes.LoadCurrentSeason),
      mergeMap(action =>
        this.seasonService.currentSeason$.pipe(
          map(season => new adminActions.SetCurrentSeason(season)),
          tap(data => console.log(data)),
          catchError(err => of(new adminActions.LoadDivisionsFail(err)))
        )
      )
    );
  
}
