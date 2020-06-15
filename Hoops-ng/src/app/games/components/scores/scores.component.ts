import { Component, OnInit, Input } from '@angular/core';
import { Game } from 'app/domain/game';
import { FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';

import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';
import * as gameActions from '../../state/games.actions';

import { User } from 'app/domain/user';
import { MediaObserver } from '@angular/flex-layout';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'csbc-scores',
  templateUrl: './scores.component.html',
  styleUrls: [
    './scores.component.scss',
    '../../containers/games-shell/games-shell.component.scss'
  ]
})
export class ScoresComponent implements OnInit {
  dataSource: MatTableDataSource<Game>;
  groupedGames: Game[];
  _gamesByDate: [Date, Game[]];
  divisionId: number;
  flexMediaWatcher: any;
  currentScreenWidth: any;
  get games() {
    return this._games;
  }
  @Input()
  set games(games: Game[]) {
    this._games = games;
    //    console.log(games);
    this.dataSource = new MatTableDataSource(games);
    //this.groupByDate(games).subscribe(grouped => {
    // this.groupedGames = grouped;
    //console.log(grouped);
    //});
  }
  private _games: Game[];
  @Input() canEdit: boolean;

  errorMessage: string;
  public title: string;
  private user: User;

  displayedColumns = [
    'gameDate',
    'visitingTeamName',
    'homeTeamName',
    'visitingTeamScore',
    'homeTeamScore'
  ];
  constructor(
    private store: Store<fromGames.State>,
    private userStore: Store<fromUser.State>,
    public dialog: MatDialog,
    private media: MediaObserver
  ) {
    this.title = 'Schedule!';
  }

  ngOnInit() {
    if (this.canEdit === true) {
      this.displayedColumns.push('actions');
    }
    this.userStore.pipe(select(fromUser.getCurrentUser)).subscribe(user => {
      this.user = user;
      console.log(this.user);
    });
    this.store
      .pipe(select(fromGames.getCurrentDivision))
      .subscribe(division => {
        console.log(division);
        if (division !== null && division !== undefined) {
          this.divisionId = division.divisionID;
          console.log(this.divisionId);
          this.canEdit = false;
          if (this.user !== null && this.user !== undefined) {
            if (this.user.userType === 3) {
              this.canEdit = true;
            } else {
              for (let i = 0; i < this.user.divisions.length; i++) {
                if (this.user.divisions[i].divisionID === this.divisionId) {
                  this.canEdit = true;
                  console.log('Found division');
                  break;
                }
              }
            }
          }
        }
      });
    // this.dataSource = new MatTableDataSource(this.games);
    this.store.pipe(select(fromGames.getFilteredGames)).subscribe(games => {
      this.games = games;
      this.dataSource.data = games;
    });
    this.store.pipe(select(fromGames.getCanEdit)).subscribe(canEdit => {
      this.canEdit = canEdit;
      if (canEdit) {
        this.displayedColumns.push('actions');
      }
    });

    this.dataSource = new MatTableDataSource(this.games);
    this.store.pipe(select(fromGames.getFilteredGames)).subscribe(games => {
      this.games = games;
      this.dataSource.data = games;
    });
  }
}
