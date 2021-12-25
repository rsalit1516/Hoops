import { Component, OnInit, Input, Output } from '@angular/core';
import { GameActions } from './../../state/games.actions';
import { FormBuilder } from '@angular/forms';
import { Game } from '../../../domain/game';
import { Store, select } from '@ngrx/store';
import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';
import * as gameActions from '../../state/games.actions';

import { groupBy, mergeMap, toArray, map, switchMap } from 'rxjs/operators';
import { from, zip, of } from 'rxjs';
import * as moment from 'moment';
import { User } from 'app/domain/user';
import { GameScoreDialogComponent } from '../game-score-dialog/game-score-dialog.component';
import { MediaObserver } from '@angular/flex-layout';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'csbc-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  groupedGames: Game[] | undefined;
  _gamesByDate: [Date, Game[]] | undefined;
  divisionId: number | undefined;
  flexMediaWatcher: any;
  currentScreenWidth: any;

  dailySchedule!: Array<Game[]>;
  get games() {
    return this._games;
  }
  @Input()
  set games(games: Game[]) {
    this._games = games;
  }
  private _games!: Game[];
  @Output()
  canEdit!: boolean;

  errorMessage: string | undefined;
  public title: string;

  constructor(
    private store: Store<fromGames.State>,
    private userStore: Store<fromUser.State>,
    public dialog: MatDialog,
    private media: MediaObserver
  ) {
    this.title = 'Schedule!';
    this.flexMediaWatcher = media.media$.subscribe((change) => {
      if (change.mqAlias !== this.currentScreenWidth) {
        this.currentScreenWidth = change.mqAlias;
      }
    });
    // this.dailySchedule = new Array<Game[]>();
  }

  ngOnInit() {
    this.store.select(fromGames.getFilteredGames).subscribe((games) => {
      this.games = games;
      this.dailySchedule = [];
      // console.log(games);

      this.groupByDate(games).subscribe(dailyGames => {
        // console.log(dailyGames);
        this.dailySchedule.push(dailyGames);
      });
      // console.log(this.dailySchedule);
    });
  }

  groupByDate(games: Game[]) {
    const source = from(games);
    const gDate = source.pipe(
      map(s => (s.gameDate = moment(s.gameDate).toDate()))
    );

    const gamesByDate = source.pipe(
      // map(s => s.gameDate = moment(s.gameDate).toDate()),
      groupBy(game =>
        moment(game.gameDate).format(moment.HTML5_FMT.DATE)
        // .toDate()
        // .fo
        // .toD
        ),

      mergeMap(group => group.pipe(toArray()))
    );
    return gamesByDate;

  }
  // groupByDate2(games: Game[]) {
  //   let dailySchedule = {};
  //   games.forEach((val) => {
  //     var date = moment(val.gameDate).toDate();
  //   });
  // }

  editGame(game: Game) {
    this.store.dispatch(new gameActions.SetCurrentGame(game));
    const dialogRef = this.dialog.open(GameScoreDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
