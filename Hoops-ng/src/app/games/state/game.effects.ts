import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as gameActions from './games.actions';
import * as fromGames from './';
import {
  map,
  switchMap,
  mergeMap,
  catchError,
  tap,
  mapTo,
  withLatestFrom,
  exhaustMap,
  concatMap,
  shareReplay
} from 'rxjs/operators';
import { Store, Action, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { GameService } from '../game.service';
import { TeamService } from 'app/services/team.service';
import { getCurrentDivision } from './';
import { SeasonService } from 'app/services/season.service';
import { DivisionService } from 'app/services/division.service';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'app/services/data.service';
import { Game } from 'app/domain/game';
import { Division } from 'app/domain/division';

@Injectable()
export class GameEffects {
  seasonId: number;
  index: number;
  currentSeasonId = 2190;
  divisionId$: Observable<number>;
  divisionId: number;
  private gameUrl = this.dataService.webUrl + '/api/schedulegame/getSeasonGames';
  private divisionUrl =
    this.dataService.webUrl + '/api/division/GetSeasonDivisions/';
  private divisionStartUrl =
    this.dataService.webUrl + '/api/division/GetSeasonDivisions/';

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private seasonService: SeasonService,
    private divisionService: GameService,
    private gameService: GameService,
    private teamService: TeamService,
    private dataService: DataService,

    private store: Store<fromGames.State>
  ) {}

  // tslint:disable-next-line:member-ordering
  @Effect()
  loadGames$: Observable<Action> = this.actions$.pipe(
    ofType(gameActions.GameActionTypes.Load),
    concatMap(action =>
      of(action).pipe(
        withLatestFrom(this.store.pipe(select(fromGames.getCurrentSeason))),
        tap(divisions => console.log(divisions))
      )
    ),
    tap(([action, t]) => {
      if (t) {
        this.seasonId = t.seasonId;
      } else {
        this.seasonId = 0;
      }
    }),

    mergeMap(action =>
      this.http.get<Game[]>(this.gameUrl +'?seasonId='+ this.seasonId).pipe(
        // tap(data => console.log('All games: ' + JSON.stringify(data))),
        shareReplay(1),
        map(games => new gameActions.LoadSuccess(games)),
        tap(games => console.log(games)),
        catchError(err => of(new gameActions.LoadFail(err)))
      )
    )
  );
  // tslint:disable-next-line:member-ordering
  @Effect()
  setCurrentSeason$: Observable<Action> = this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadCurrentSeason),
    mergeMap(action =>
      this.seasonService.currentSeason$.pipe(
        map(season => new gameActions.SetCurrentSeason(season)),
        tap(data => console.log(data)),
        catchError(err => of(new gameActions.LoadDivisionsFail(err)))
      )
    )
  );

  // tslint:disable-next-line:member-ordering
  @Effect()
  loadDivisions$: Observable<Action> = this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadDivisions),
    concatMap(action =>
      of(action).pipe(
        withLatestFrom(this.store.pipe(select(fromGames.getCurrentSeason))),
        tap(divisions => console.log(divisions))
      )
    ),
    tap(([action, t]) => {
      console.log(t);
      console.log(action);
      if (t) {
        this.seasonId = t.seasonId;
      } else {
        this.seasonId = 0;
      }
    }),
    mergeMap(action =>
      this.http.get<Division[]>(this.divisionStartUrl + this.seasonId).pipe(
        // tap(data => console.log('All games: ' + JSON.stringify(data))),
        shareReplay(1),
        map(divisions => new gameActions.LoadDivisionsSuccess(divisions)),
        tap(divisions => console.log('Divisions are:' + divisions)),
        catchError(err => of(new gameActions.LoadDivisionsFail(err)))
      )
    )
  );
  // switchMap(action =>
  //   this.divisionService.getDivisions(this.seasonId).pipe(
  //     map(
  //       divisions =>
  //         new gameActions.LoadDivisionsSuccess(divisions)
  //     ),
  //     tap(divisions => console.log(divisions)),
  //     map(divisions => new gameActions.SetCurrentDivision(divisions[0])),
  //     shareReplay(1),
  //     catchError(err => of(new gameActions.LoadDivisionsFail(err)))
  //   )
  // )
  // );

  // tslint:disable-next-line:member-ordering
  @Effect()
  changeDivision$: Observable<Action> = this.actions$.pipe(
    ofType(gameActions.GameActionTypes.SetCurrentDivision),
    mapTo(new gameActions.LoadStandings()),
    mapTo(new gameActions.LoadFilteredGames()),
    tap(() => 'changed division')
  );

  // tslint:disable-next-line:member-ordering
  @Effect()
  loadTeams$: Observable<Action> = this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadTeams),
    mergeMap(action =>
      this.teamService.getTeams().pipe(
        map(teams => new gameActions.LoadTeamsSuccess(teams)),
        // tap(response => 'got Teams'),
        catchError(err => of(new gameActions.LoadDivisionsFail(err)))
      )
    )
  );
  // tslint:disable-next-line:member-ordering
  @Effect()
  loadFilteredGames$: Observable<Action> = this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadFilteredGames),
    concatMap(action =>
      of(action).pipe(
        withLatestFrom(this.store.pipe(select(getCurrentDivision)))
      )
    ),
    tap(([action, t]) => {
      if (t) {
        this.divisionId = t.divisionId;
      } else {
        this.divisionId = 0;
      }
    }),
    switchMap(action =>
      this.gameService.divisionGames$.pipe(
        map(games => new gameActions.LoadFilteredGamesSuccess(games)),
        tap(response => console.log(response)),
        catchError(err => of(new gameActions.LoadFilteredGamesFail(err)))
      )
    )
  );

  // tslint:disable-next-line:member-ordering
  @Effect()
  loadStandings$: Observable<Action> = this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadStandings),
    concatMap(action =>
      of(action).pipe(
        withLatestFrom(this.store.pipe(select(getCurrentDivision))),
        tap(([action, t]) => {
          if (t) {
            this.divisionId = t.divisionId;
          } else {
            this.divisionId = 0;
          }
        })
      )
    ),
    switchMap(x =>
      this.gameService.getStandingsByDivision(this.divisionId).pipe(
        map(standings => new gameActions.LoadStandingsSuccess(standings)),
        tap(response => 'got Standings'),
        catchError(err => of(new gameActions.LoadStandingsFail(err)))
      )
    )
  );

  // tslint:disable-next-line:member-ordering
  // @Effect()
  // loadFilteredGamesByTeam$: Observable<Action> = this.actions$.pipe(
  //   ofType(gameActions.GameActionTypes.LoadFilteredGames),
  //   mergeMap(action =>
  //     this.gameService.filterGamesByTeam().pipe(
  //       // map(games => (new gameActions.LoadFilteredGamesSuccess(games))),
  //       catchError(err => of(new gameActions.LoadFilteredGamesFail(err)))
  //     )
  //   )
  // );
}
