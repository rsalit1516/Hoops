import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as gameActions from './games.actions';
import * as fromGames from './';
import { map, switchMap, mergeMap, catchError, tap, mapTo, withLatestFrom, concatMap, shareReplay } from 'rxjs/operators';
import { Store, Action, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { GameService } from '../../services/game.service';
import { TeamService } from '@app/services/team.service';
import { getCurrentDivision, getCurrentTeam } from './';
import { SeasonService } from '@app/services/season.service';
import { HttpClient } from '@angular/common/http';
import { DataService } from '@app/services/data.service';
import { PlayoffGameService } from '@app/services/playoff-game.service';
import { Division } from '@app/domain/division';
import { Team } from '@app/domain/team';

@Injectable()
export class GameEffects {
  readonly http = inject(HttpClient);
  readonly seasonService = inject(SeasonService);
  readonly gameService = inject(GameService);
  readonly playoffGameService = inject(PlayoffGameService);
  readonly teamService = inject(TeamService);
  readonly dataService = inject(DataService);
  readonly actions$ = inject(Actions);
  readonly store = inject(Store<fromGames.State>);

  seasonId!: number;
  index!: number;
  currentSeasonId: number | undefined;
  divisionId$!: Observable<number>;
  divisionId!: number;
  readonly divisionStartUrl = this.dataService.seasonDivisionsUrl;
  teamId: any;
  team: Team | undefined;

  // tslint:disable-next-line:member-ordering

  loadGames$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadGames),
    mergeMap(() =>
      this.gameService.getGames().pipe(
        map((games) => new gameActions.LoadGamesSuccess(games)),
        tap(games => console.log(games)),
        catchError((err) => of(new gameActions.LoadGamesFail(err)))
      )
    )
  ));

  // tslint:disable-next-line:member-ordering

  loadPlayoffGames$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadPlayoffGames),
    // ofType(gameActions.GameActionTypes.LoadPlayoffGames),

    mergeMap(() =>
      this.playoffGameService.getSeasonPlayoffGames().pipe(
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
    mergeMap(() =>
      this.seasonService.currentSeason$.pipe(
        map((season) => new gameActions.LoadCurrentSeasonSuccess(season)),
        // tap((data) => console.log(this.seasonService.selectedSeason)),
        catchError((err) => of(new gameActions.LoadCurrentSeasonFail(err)))
      )
    )
  ));

  // tslint:disable-next-line:member-ordering

  loadDivisions$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadDivisions),
    mergeMap(() =>
      this.http.get<Division[]>(this.divisionStartUrl + this.seasonService.selectedSeason.seasonId)
        .pipe(
        shareReplay(1),
        map((divisions) => new gameActions.LoadDivisionsSuccess(divisions)),
        catchError((err) => of(new gameActions.LoadDivisionsFail(err)))
      ),
    ),

  ));

  // tslint:disable-next-line:member-ordering

  changeDivision$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadDivisionGames),
    // tap((x) => (this.gameService.divisionId = x)),
    switchMap(() => [
      new gameActions.LoadFilteredGames(),
    ]),
    // switchMap(m => [
    //   new gameActions.LoadDivisionPlayoffGames(),
    // ]),

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
    mergeMap(() =>
      this.teamService.getTeams().pipe(
        map((teams) => new gameActions.LoadTeamsSuccess(teams)),
        // tap((response) => console.log(response)),
        catchError((err) => of(new gameActions.LoadDivisionsFail(err)))
      )
    )
  ));
  // tslint:disable-next-line:member-ordering

  // loadFilteredGames$: Observable<Action> = createEffect(() => this.actions$.pipe(
  //   ofType(gameActions.GameActionTypes.LoadFilteredGames),
  //   switchMap(() =>
  //     this.gameService.filterGamesByDivision().pipe(
  //       map((games) => new gameActions.LoadFilteredGamesSuccess(games)),
  //       // tap(response => console.log(response)),
  //       catchError((err) => of(new gameActions.LoadFilteredGamesFail(err)))
  //     )
  //   )
  // ));

  loadDivisionPlayoffGames$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(gameActions.GameActionTypes.LoadDivisionPlayoffGames),
    concatMap((action) =>
      of(action).pipe(
        withLatestFrom(this.store.pipe(select(getCurrentDivision)))
      )
    ),
    tap(([, t]) => {
      if (t) {
        // console.log(t);
        this.divisionId = t.divisionId;
      } else {
        this.divisionId = 0;
      }
    }),
    switchMap(() =>
      this.playoffGameService.getDivisionPlayoffGames(this.divisionId).pipe(
        map((games) => new gameActions.LoadDivisionPlayoffGamesSuccess(games)),
        // tap(response => console.log(response)),
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
        tap(([, t]) => {
          if (t) {
            this.divisionId = t.divisionId;
          } else {
            this.divisionId = 0;
          }
        })
      )
    ),
    switchMap(() =>
      this.gameService.getStandingsByDivision(this.divisionId).pipe(
        map((standings) => new gameActions.LoadStandingsSuccess(standings)),
        tap(() => 'got Standings'),
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
    tap(([, t]) => {
      if (t) {
        // console.log(t);
        this.divisionId = t.divisionId;
      } else {
        this.divisionId = 0;
      }
    }),
    switchMap(() =>
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
    tap(([, t]) => {
      if (t) {
        // console.log(t);
        this.team = t;
      } else {
        this.team = undefined;
      }
    }),
    switchMap(() =>
      this.gameService.filterGamesByTeam(this.team).pipe(
        map((games) => new gameActions.LoadFilteredGamesByTeamSuccess(games)),
        // tap(response => console.log(response)),
        catchError((err) => of(new gameActions.LoadFilteredGamesByTeamFail(err)))
      )
    )
  ));

}
