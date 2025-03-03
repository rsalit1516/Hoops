import { Component, inject, Input, OnInit } from '@angular/core';
import { Observable, zip, of, from, EMPTY } from 'rxjs';
import { Season } from '@domain/season';
import { Division } from '@app/domain/division';
import { Team } from '@app/domain/team';
import { Store, select } from '@ngrx/store';

import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';
import * as gameActions from '../../state/games.actions';

import { Game } from '@app/domain/game';
import { PlayoffGame } from '@app/domain/playoffGame';
import {
  groupBy,
  mergeMap,
  toArray,
  tap,
  map,
  concatMap,
  catchError,
  take,
} from 'rxjs/operators';
import { User } from '@app/domain/user';
import { DivisionService } from './../../../services/division.service';
import { GameService } from '@app/games/game.service';
import { SchedulePlayoffsComponent } from '@app/games/components/schedule-playoffs/schedule-playoffs.component';
import { ScheduleComponent } from '../../components/schedule/schedule.component';
import { DateTime } from 'luxon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'csbc-schedule-shell',
  template: `
  <div class="container mx-auto">
    <h1>{{ title }}</h1>
    <div class="row">
    <csbc-schedule [dailySchedule]="dailySchedule"></csbc-schedule>
    </div>
  </div>
  `,
  styleUrls: ['./schedule-shell.component.scss'],
  imports: [
    CommonModule,
    ScheduleComponent
  ]
})
export class ScheduleShellComponent implements OnInit {
  private gameService = inject(GameService);
  games: Game[] | undefined | null;
  playoffGames!: PlayoffGame[];
  title = 'Regular Season Schedule';
  filteredGames$: Observable<Game[]> | undefined;
  currentSeason$: Observable<Season> | undefined;
  divisions$: Observable<Division[]> | undefined;
  selectedDivisionId$: Observable<number> | undefined;
  teams$: Observable<Team[]> | undefined;
  selectedTeam$: Observable<Team> | undefined;
  errorMessage$: Observable<string> | undefined;
  selectedDivision$: Observable<any> | undefined;
  canEdit = false;
  gamesByDate$: Observable<[Date, Game[]]> | undefined;
  user$: Observable<User> | undefined;
  division$: Observable<Division> | undefined;
  division: Division | undefined;
  user: User | undefined;
  games$ = this.gameService.seasonGames$.pipe(
    catchError((err) => {
      this.errorMessage$ = err;
      return EMPTY;
    })
  );
  divisionId: number | undefined;
  hasPlayoffs = false;
  dailySchedule!: Array<Game[]>;

  constructor (
    private store: Store<fromGames.State>,

  ) { }

  ngOnInit () {
    this.store.select(fromGames.getCurrentDivision).subscribe((division) => {
      this.store.select(fromGames.getFilteredGames).subscribe((games) => {
        this.games = games;
        this.dailySchedule = [];
        this.dailySchedule = this.gameService.groupByDate(games);
      });
      this.store.dispatch(new gameActions.LoadDivisionPlayoffGames());
    });
  }

  getCanEdit (user: User | undefined, divisionId: number): boolean {
    console.log(divisionId);
    if (user !== undefined) {
      if (user.divisions !== undefined) {
        user.divisions.forEach((element) => {
          if (divisionId === element.divisionId) {
            return true;
            console.log('found ' + divisionId);
          }
          return false;
        });
      }
    }
    return false;
  }
}
