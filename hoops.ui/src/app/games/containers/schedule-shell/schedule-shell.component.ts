import { Component, OnInit } from '@angular/core';
import { Observable, zip, of, from, EMPTY } from 'rxjs';
import { Season } from '@app/domain/season';
import { Division } from '@app/domain/division';
import { Team } from '@app/domain/team';
import { Store, select } from '@ngrx/store';

import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';

import { Game } from '@app/domain/game';
import { groupBy, mergeMap, toArray, tap, map, concatMap, catchError, take
} from 'rxjs/operators';
import * as moment from 'moment';
import { User } from '@app/domain/user';
import { DivisionService } from './../../../services/division.service';
import { GameService } from '@app/games/game.service';

@Component({
  selector: 'csbc-schedule-shell',
  templateUrl: './schedule-shell.component.html',
  styleUrls: ['./schedule-shell.component.scss']
})
export class ScheduleShellComponent implements OnInit {
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
  games$ = this.gameService.games$.pipe(
    catchError(err => {
      this.errorMessage$ = err;
      return EMPTY;
    })
  );

  constructor(
    private store: Store<fromGames.State>,
    private userStore: Store<fromUser.State>,
    private divisionService: DivisionService,
    private gameService: GameService
  ) {}

  ngOnInit() {

  }

  groupByDate(games: Game[]) {
    // console.log(games);
    games.forEach(element => {
      element.gameTime = element.gameDate;
      element.gameDate = moment(element.gameDate)
        .startOf('day')
        .toDate();
    });
    const source = from(games);

    const t1 = of(games).pipe(
      concatMap(res => res),
      groupBy(game => game.gameDate),
      mergeMap(group => zip(of(group.key), group.pipe(toArray())))
    );
    const test = from(games).pipe(
      // mergeMap(res => res),
      groupBy(
        game => game.gameDate,
        g => g
      ),
      // tap(data => console.log(data)),
      mergeMap(group => zip(of(group.key), group.pipe(toArray()))),
      tap(data => console.log(data))
    );
    console.log(test);
    console.log(t1);
    // console.log(this.gamesByDate);
    return t1;
  }
  getCanEdit(user: User | undefined, divisionId: number): boolean {
    console.log(divisionId);
    if (user !== undefined) {
      if (user.divisions !== undefined) {
        user.divisions.forEach(element => {
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
