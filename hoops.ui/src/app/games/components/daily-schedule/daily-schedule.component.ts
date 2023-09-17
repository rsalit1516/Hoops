import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Game } from '@app/domain/game';
// import { DataSource } from "@angular/cdk/table";
import { Store, select } from '@ngrx/store';
import { MediaObserver } from '@angular/flex-layout';
import { GameScoreDialogComponent } from '../game-score-dialog/game-score-dialog.component';

import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';
import * as gameActions from '../../state/games.actions';
import { MatLegacyTable as MatTable, MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

@Component({
  selector: 'daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.scss'],
})
export class DailyScheduleComponent implements OnInit {
  @Input() games!: Game[];
  @Input() canEdit!: boolean;
  displayedColumns = [
    'gameTime',
    'locationName',
    'homeTeam',
    'visitingTeam',
    'homeTeamScore',
    'visitingTeamScore',
    'actions',
  ];
  data: Game[] = []; // = this.games;
  gameDate!: Date;
  flexMediaWatcher: any;
  currentScreenWidth: string | undefined;
  constructor(
    private store: Store<fromGames.State>,
    private userStore: Store<fromUser.State>,
    public dialog: MatDialog,
    private media: MediaObserver
  ) {}

  ngOnInit() {
    this.data = this.games;
    this.flexMediaWatcher = this.media.media$.subscribe((change) => {
      if (change.mqAlias !== this.currentScreenWidth) {
        this.currentScreenWidth = change.mqAlias;
        this.setupTable();
        this.store.select(fromGames.getCanEdit).subscribe((canEdit) => {
          this.canEdit = canEdit;
          if (canEdit === true) {
            this.displayedColumns.push('actions');
          }
        });
      }
    });
    this.gameDate! = this.data[0].gameDate as Date;
  }
  setupTable() {
    if (this.currentScreenWidth === 'xs') {
      // only display internalId on larger screens
      //this.displayedColumns.shift(); // remove 'internalId'
      this.displayedColumns = [
        'gameTime',
        'visitingTeam',
        'homeTeam',
        'locationName',
      ];
    } else {
      this.displayedColumns = [
        'gameTime',
        'visitingTeam',
        'homeTeam',
        'locationName',
        'visitingTeamScore',
        'homeTeamScore',
      ];
    }
  }
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
