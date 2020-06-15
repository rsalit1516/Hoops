import { Component, OnInit } from '@angular/core';
import { Observable, zip, of, from, EMPTY } from 'rxjs';
import { Season } from 'app/domain/season';
import { Division } from 'app/domain/division';
import { Team } from 'app/domain/team';
import { Store, select } from '@ngrx/store';

import * as fromGames from '../../state';
import * as gameActions from '../../state/games.actions';
import * as fromUser from '../../../user/state';

import { Game } from 'app/domain/game';
import { Standing } from 'app/domain/standing';
import { ConditionalExpr } from '@angular/compiler';
import {
  groupBy,
  mergeMap,
  toArray,
  tap,
  map,
  concatMap,
  catchError,
  take
} from 'rxjs/operators';
import * as moment from 'moment';
import { User } from 'app/domain/user';
import { DivisionService } from './../../../services/division.service';
import { GameService } from 'app/games/game.service';

@Component({
  selector: 'csbc-schedule-shell',
  templateUrl: './schedule-shell.component.html',
  styleUrls: ['./schedule-shell.component.scss']
})
export class ScheduleShellComponent implements OnInit {
  filteredGames$: Observable<Game[]>;
  // standings$:  Observable<Standing[]>;
  currentSeason$: Observable<Season>;
  divisions$: Observable<Division[]>;
  selectedDivisionId$: Observable<number>;
  teams$: Observable<Team[]>;
  selectedTeam$: Observable<Team>;
  errorMessage$: Observable<string>;
  selectedDivision$: Observable<any>;
  canEdit = false;
  gamesByDate$: Observable<[Date, Game[]]>;
  user$: Observable<User>;
  division$: Observable<Division>;
  division: Division;
  user: User;
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
    // this.groupByDate(this.games);

    // this.setStateSubscriptions();

  }

  setStateSubscriptions() {
    this.gameService.getGames().subscribe(games => {
      console.log(games);
      this.filteredGames$ = this.store.pipe(select(fromGames.getFilteredGames));
      //this.filteredGames$.subscribe(g => {
      this.groupByDate(games);

      games.sort((val1, val2) => {
        return <any>new Date(val1.gameDate) - <any>new Date(val2.gameDate);
      });
      //});
    });
    this.userStore.pipe(select(fromUser.getCurrentUser)).subscribe(user => {
      this.user = user;
      console.log(this.user);
    });
  }
  divisionSelected(division: Division): void {
    console.log(division);
    this.canEdit = this.getCanEdit(this.user, division.divisionID);
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
      tap(data => console.log(data)),
      mergeMap(group => zip(of(group.key), group.pipe(toArray()))),
      tap(data => console.log(data))
    );
    console.log(test);
    console.log(t1);
    // console.log(this.gamesByDate);
    return t1;
  }
  getCanEdit(user: User, divisionId: number): boolean {
    console.log(divisionId);
    if (user) {
      user.divisions.forEach(element => {
        if (divisionId === element.divisionID) {
          return true;
          console.log('found ' + divisionId);
        }
      });
    }
    return false;
  }
}
