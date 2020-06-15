import { Component, OnInit, Input } from '@angular/core';
import { Game } from 'app/domain/game';
import { DataSource } from '@angular/cdk/table';
import { Store, select } from '@ngrx/store';
import { MediaObserver } from '@angular/flex-layout';
import { GameScoreDialogComponent } from '../game-score-dialog/game-score-dialog.component';

import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';
import * as gameActions from '../../state/games.actions';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.scss']
})
export class DailyScheduleComponent implements OnInit {
  @Input() games: Game[];
  @Input() data: MatTableDataSource<Game>;
  @Input() canEdit: boolean;
  displayedColumns = [
    'gameTime',
    'locationName',
    'homeTeamName',
    'visitingTeamName',
    'homeTeamScore',
    'visitingTeamScore',
    'actions'
  ];
  dataSource: MatTableDataSource<Game>;
  gameDate: Date;
  flexMediaWatcher: any;
  currentScreenWidth: string;
  constructor(
    private store: Store<fromGames.State>,
    private userStore: Store<fromUser.State>,
    public dialog: MatDialog,
    private media: MediaObserver
  ) {
    
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.games);
    this.gameDate = this.games[0].gameDate;
    this.dataSource.data = this.games;
    this.flexMediaWatcher = this.media.media$.subscribe(change => {
      if (change.mqAlias !== this.currentScreenWidth) {
        this.currentScreenWidth = change.mqAlias;
        // console.log(this.currentScreenWidth);
        this.setupTable();
        this.store.select(fromGames.getCanEdit).subscribe(canEdit => {
          this.canEdit = canEdit;
         //  console.log(this.canEdit);
          if (canEdit === true) {
            this.displayedColumns.push('actions');
            // this.displayedColumns = this.displayedColumns.concat(['actions']);
          }
        });
    
      }
    });
    
  }
  setupTable() {
    if (this.currentScreenWidth === 'xs') {
      // only display internalId on larger screens
      //this.displayedColumns.shift(); // remove 'internalId'
      this.displayedColumns = [
        'visitingTeamName',
        'homeTeamName',
        'gameTime',
        'locationName'
      ];
    } else {
      this.displayedColumns = [
        'visitingTeamName',
        'homeTeamName',
        'gameTime',
        'locationName',
        'visitingTeamScore',
        'homeTeamScore'
      ];
    }
  }
  editGame(game) {
    this.store.dispatch(new gameActions.SetCurrentGame(game));
    const dialogRef = this.dialog.open(GameScoreDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
