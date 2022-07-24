import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
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

import * as adminActions from './admin.actions';
import * as fromAdmin from './';
import { Game } from 'app/domain/game';
import { HttpClient } from '@angular/common/http';
import { TeamService } from '../admin-shared/services/team.service';
import { DataService } from 'app/services/data.service';
import { Division } from 'app/domain/division';
import { Season } from '@app/domain/season';
import { Team } from '@app/domain/team';
import { GameService } from '../services/game.service';
import { PlayoffGame } from '@app/domain/playoffGame';

@Injectable()
export class AdminEffects {
  seasonId!: number;
  gameUrl = this.dataService.seasonGamesUrl;
  seasonDivisionsUrl = this.dataService.seasonDivisionsUrl;
  private playoffGameUrl = this.dataService.playoffGameUrl;
  divisionId!: number;
  division!: Division;

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

  loadSeasons$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(adminActions.AdminActionTypes.LoadSeasons),
    mergeMap(action =>
      this.seasonService.seasons$.pipe(
        map(seasons => new adminActions.LoadSeasonsSuccess(seasons)),
        catchError(err => of(new adminActions.LoadSeasonsFail(err)))
      )
    )
  ));

    // tslint:disable-next-line:member-ordering

    loadDivisions$: Observable<Action> = createEffect(() => this.actions$.pipe(
      ofType(adminActions.AdminActionTypes.LoadDivisions),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.pipe(select(fromAdmin.getSelectedSeason))),
          // tap(season => console.log(season))
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
        this.http.get<Division[]>(this.seasonDivisionsUrl + this.seasonId).pipe(
          // tap(data => console.log('All games: ' + JSON.stringify(data))),
          shareReplay(1),
          map(divisions => new adminActions.LoadDivisionsSuccess(divisions)),
          // tap(divisions => console.log(divisions)),
          catchError(err => of(new adminActions.LoadDivisionsFail(err)))
        )
      )
    ));

  // tslint:disable-next-line:member-ordering

  loadGames$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(adminActions.AdminActionTypes.LoadGames),
    concatMap(action =>
      of(action).pipe(
        withLatestFrom(this.store.pipe(select(fromAdmin.getSelectedSeason))),
        // tap(divisions => console.log(divisions))
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
      this.http.get<Game[]>(this.gameUrl + '?seasonId=' + this.seasonId).pipe(
        // tap(data => console.log('All admin games: ' + JSON.stringify(data))),
        shareReplay(1),
        map(games => new adminActions.LoadGamesSuccess(games)),
        // tap(games => console.log(games)),
        catchError(err => of(new adminActions.LoadGamesFail(err)))
      )
    )
  ));
    // tslint:disable-next-line:member-ordering
    setCurrentSeason$: Observable<Action> = createEffect(() => this.actions$.pipe(
      ofType(adminActions.AdminActionTypes.LoadCurrentSeason),
      mergeMap(action =>
        this.seasonService.currentSeason$.pipe(
          map(season => new adminActions.SetSelectedSeason(season as Season)),
          // tap(data => console.log(data)),
          catchError(err => of(new adminActions.LoadDivisionsFail(err)))
        )
      )
    ));

    loadFilteredGames$: Observable<Action> = createEffect(() => this.actions$.pipe(
      ofType(adminActions.AdminActionTypes.LoadFilteredGames),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store.pipe(select(fromAdmin.getSelectedDivision)))
        )
      ),
      tap(([action, t]) => {
        if (t) {
          this.divisionId = t.divisionId;
        } else {
          this.divisionId = 0;
        }
      }),
      switchMap((action) =>
        this.gameService.filterGamesByDivision(this.divisionId).pipe(
          map((games) => new adminActions.LoadFilteredGamesSuccess(games)),
          // tap(response => console.log(response)),
          catchError((err) => of(new adminActions.LoadFilteredGamesFail(err)))
        )
      )
    ));
    loadSeasonTeam$: Observable<Action> = createEffect(() => this.actions$.pipe(
      ofType(adminActions.AdminActionTypes.LoadSeasonTeams),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.pipe(select(fromAdmin.getSelectedSeason))),
          // tap(divisions => console.log(divisions))
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
        this.http.get<Team[]>(this.dataService.getSeasonTeamsUrl + this.seasonId).pipe(
          // tap(data => console.log('All admin teams:' + JSON.stringify(data))),
          shareReplay(1),
          map(teams => new adminActions.LoadSeasonTeamsSuccess(teams)),
          // tap(teams => console.log(teams)),
          catchError(err => of(new adminActions.LoadSeasonTeamsFail(err)))
        )
      )
    ));
    loadDivisionTeams$: Observable<Action> = createEffect(() => this.actions$.pipe(
      ofType(adminActions.AdminActionTypes.LoadDivisionTeams),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store.pipe(select(fromAdmin.getSelectedDivision)))
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
          map((teams) => new adminActions.LoadDivisionTeamsSuccess(teams)),
          // tap(response => console.log(response)),
          catchError((err) => of(new adminActions.LoadFilteredGamesFail(err)))
        )
      )
    ));
    loadPlayoffGames$: Observable<Action> = createEffect(() => this.actions$.pipe(
      ofType(adminActions.AdminActionTypes.LoadPlayoffGames),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store.pipe(select(fromAdmin.getSelectedSeason))),
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
        this.http
          .get<PlayoffGame[]>(this.playoffGameUrl + '?seasonId=' + this.seasonId)
          .pipe(
            // tap(data => console.log('All playoff games: ' +this.playoffGameUrl + ' '+ JSON.stringify(data))),
            shareReplay(1),
            map((games) => new adminActions.LoadPlayoffGamesSuccess(games)),
            tap(games => console.log(games)),
            catchError((err) => of(new adminActions.LoadPlayoffGamesFail(err)))
          )
      )
    ));

}
