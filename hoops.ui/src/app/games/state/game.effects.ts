import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as gameActions from './games.actions';
import * as fromGames from './';
import { map, switchMap, mergeMap, catchError, tap, mapTo, withLatestFrom, concatMap, shareReplay} from 'rxjs/operators';
import { Store, Action, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { GameService } from '../game.service';
import { TeamService } from '@app/services/team.service';
import { getCurrentDivision, getCurrentTeam } from './';
import { SeasonService } from '@app/services/season.service';
import { HttpClient } from '@angular/common/http';
import { DataService } from '@app/services/data.service';
import { Game } from '@app/domain/game';
import { PlayoffGame } from '@app/domain/playoffGame';
import { Division } from '@app/domain/division';
import { Team } from '@app/domain/team';

@Injectable()
export class GameEffects {
  seasonId!: number;
  index!: number;
  currentSeasonId: number | undefined;
  divisionId$!: Observable<number>;
  divisionId!: number;
  private gameUrl = this.dataService.seasonGamesUrl;
  private divisionUrl = this.dataService.seasonDivisionsUrl;
  private divisionStartUrl =  this.dataService.seasonDivisionsUrl;
  private playoffGameUrl = this.dataService.playoffGameUrl;
  teamId: any;
  team: Team | undefined;

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

  loadGames$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(gameActions.GameActionTypes.Load),
    concatMap((action) =>
      of(action).pipe(
        withLatestFrom(this.store.pipe(select(fromGames.getCurrentSeason))),
        // tap((divisions) => console.log(divisions))
      )
    ),
    tap(([action, t]) => {
      if (t) {
        this.seasonId = t.seasonId;
      } else {
        this.seasonId = 0;
      }
    }),

    mergeMap((action) =>
      this.http.get<Game[]>(this.gameUrl + '?seasonId=' + this.seasonId).pipe(
        // tap(data => console.log('All games: ' + JSON.stringify(data))),
        shareReplay(1),
        map((games) => new gameActions.LoadSuccess(games)),
        // tap(games => console.log(games)),
        catchError((err) => of(new gameActions.LoadFail(err)))
      )
    )
  ));

  // tslint:disable-next-line:member-ordering

  loadPlayoffGames$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadPlayoffGames),

    mergeMap((action) =>
      this.gameService.getSeasonPlayoffGames().pipe(
          // tap(data => console.log('All playoff games: ' +this.playoffGameUrl + ' '+ JSON.stringify(data))),
          shareReplay(1),
          map((games) => new gameActions.LoadPlayoffGamesSuccess(games)),
          tap(games => console.log(games)),
          catchError((err) => of(new gameActions.LoadPlayoffGamesFail(err)))
        )
    )
  ));

  // tslint:disable-next-line:member-ordering

  setCurrentSeason$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadCurrentSeason),
    mergeMap((action) =>
      this.seasonService.currentSeason$.pipe(
        map((season) => new gameActions.LoadCurrentSeasonSuccess(season)),
        // tap((data) => console.log(data)),
        catchError((err) => of(new gameActions.LoadCurrentSeasonFail(err)))
      )
    )
  ));

  // tslint:disable-next-line:member-ordering

  loadDivisions$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadDivisions),
    concatMap((action) =>
      of(action).pipe(
        withLatestFrom(this.store.pipe(select(fromGames.getCurrentSeason))),
        // tap((divisions) => console.log(divisions))
      )
    ),
    tap(([action, t]) => {
      if (t) {
        this.seasonId = t.seasonId;
      } else {
        this.seasonId = 0;
      }
    }),
    mergeMap((action) =>
      this.http.get<Division[]>(this.divisionStartUrl + this.seasonId).pipe(
        shareReplay(1),
        map((divisions) => new gameActions.LoadDivisionsSuccess(divisions)),
        catchError((err) => of(new gameActions.LoadDivisionsFail(err)))
      ),
    ),

  ));

  // tslint:disable-next-line:member-ordering

  changeDivision$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadDivisionGames),
    tap((x) => (this.gameService.divisionId = x)),
    switchMap(m => [
      new gameActions.LoadFilteredGames(),
    ]),
    switchMap(m => [
      new gameActions.LoadDivisionPlayoffGames(),
    ]),

    tap(() => 'changed division')
  ));

  // filterTeams$: Observable<Action> = createEffect(() => this.actions$.pipe(
  //   ofType(gameActions.GameActionTypes.SetCurrentDivision),
  //   tap((x) => (this.gameService.divisionId = x)),
  //   switchMap(m => [
  //     new gameActions.LoadFilteredTeams(),
  //   ])
  // ));

  // updateStandingForDivison$: Observable<Action> = createEffect(() => this.actions$.pipe(
  //   ofType(gameActions.GameActionTypes.SetCurrentDivision),
  //   tap((x) => (this.gameService.divisionId = x)),
  //   switchMap(m => [
  //     new gameActions.LoadStandings()
  //   ])
  // ));

  // tslint:disable-next-line:member-ordering

  loadTeams$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadTeams),
    mergeMap((action) =>
      this.teamService.getTeams().pipe(
        map((teams) => new gameActions.LoadTeamsSuccess(teams)),
        // tap((response) => console.log(response)),
        catchError((err) => of(new gameActions.LoadDivisionsFail(err)))
      )
    )
  ));
  // tslint:disable-next-line:member-ordering

  loadFilteredGames$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadFilteredGames),
    concatMap((action) =>
      of(action).pipe(
        withLatestFrom(this.store.pipe(select(getCurrentDivision)))
      )
    ),
    tap(([action, t]) => {
      if (t) {
        // console.log(t);
        this.divisionId = t.divisionId;
      } else {
        this.divisionId = 0;
      }
    }),
    switchMap((action) =>
      this.gameService.filterGamesByDivision(this.divisionId).pipe(
        map((games) => new gameActions.LoadFilteredGamesSuccess(games)),
        // tap(response => console.log(response)),
        catchError((err) => of(new gameActions.LoadFilteredGamesFail(err)))
      )
    )
  ));

  loadDivisionPlayoffGames$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadDivisionPlayoffGames),
    concatMap((action) =>
      of(action).pipe(
        withLatestFrom(this.store.pipe(select(getCurrentDivision)))
      )
    ),
    tap(([action, t]) => {
      if (t) {
        // console.log(t);
        this.divisionId = t.divisionId;
      } else {
        this.divisionId = 0;
      }
    }),
    switchMap((action) =>
      this.gameService.divisionPlayoffGames(this.divisionId).pipe(
        map((games) => new gameActions.LoadDivisionPlayoffGamesSuccess(games)),
        tap(response => console.log(response)),
        catchError((err) => of(new gameActions.LoadDivisionPlayoffGamesFail(err)))
      )
    )
  ));


  // tslint:disable-next-line:member-ordering

  loadStandings$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadStandings),
    concatMap((action) =>
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
    switchMap((x) =>
      this.gameService.getStandingsByDivision(this.divisionId).pipe(
        map((standings) => new gameActions.LoadStandingsSuccess(standings)),
        tap((response) => 'got Standings'),
        catchError((err) => of(new gameActions.LoadStandingsFail(err)))
      )
    )
  ));


  // tslint:disable-next-line:member-ordering

  loadFilteredTeams$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadFilteredTeams),
    concatMap((action) =>
      of(action).pipe(
        withLatestFrom(this.store.pipe(select(getCurrentDivision)))
      )
    ),
    tap(([action, t]) => {
      if (t) {
        // console.log(t);
        this.divisionId = t.divisionId;
      } else {
        this.divisionId = 0;
      }
    }),
    switchMap((action) =>
      this.teamService.filterTeamsByDivision(this.divisionId).pipe(
        map((teams) => new gameActions.LoadFilteredTeamsSuccess(teams)),
        // tap(response => console.log(response)),
        catchError((err) => of(new gameActions.LoadFilteredTeamsFail(err)))
      )
    )
  ));

    // tslint:disable-next-line:member-ordering

    changeTeam$: Observable<Action> = createEffect(() => this.actions$.pipe(
      ofType(gameActions.GameActionTypes.SetCurrentTeam),
      tap(x => this.gameService.teamId = x),
      mapTo(new gameActions.LoadFilteredGamesByTeam()),
      tap(() => 'changed team')
    ));

    // tslint:disable-next-line:member-ordering

  loadFilteredGamesByTeam$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadFilteredGamesByTeam),
    concatMap((action) =>
      of(action).pipe(
        withLatestFrom(this.store.pipe(select(getCurrentTeam)))
      )
    ),
    tap(([action, t]) => {
      if (t) {
        // console.log(t);
        this.team = t;
      } else {
        this.team = undefined;
      }
    }),
    switchMap((action) =>
      this.gameService.filterGamesByTeam(this.team).pipe(
        map((games) => new gameActions.LoadFilteredGamesByTeamSuccess(games)),
        // tap(response => console.log(response)),
        catchError((err) => of(new gameActions.LoadFilteredGamesByTeamFail(err)))
      )
    )
  ));

}
