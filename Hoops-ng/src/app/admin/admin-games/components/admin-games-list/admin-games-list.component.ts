import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { MediaObserver } from '@angular/flex-layout';
import { MatTableDataSource } from '@angular/material/table';
import { Game } from 'app/domain/game';
import * as fromGames from '../../../../games/state';
import * as gameActions from 'app/games/state/games.actions';
@Component({
  selector: 'csbc-admin-games-list',
  templateUrl: './admin-games-list.component.html',
  styleUrls: [
    './admin-games-list.component.scss',
    '../../../admin.component.scss'
  ]
})
export class AdminGamesListComponent implements OnInit {
  dataSource: MatTableDataSource<unknown>;
  games: Game[];
  displayedColumns: string[];
  flexMediaWatcher: any;
  currentScreenWidth: any;
  title = 'Game List - work in progress';
  constructor(
    private store: Store<fromGames.State>,
    public dialog: MatDialog,
    private media: MediaObserver
  ) {
    this.flexMediaWatcher = media.media$.subscribe(change => {
      if (change.mqAlias !== this.currentScreenWidth) {
        this.currentScreenWidth = change.mqAlias;
        this.setupTable();
      }
    });
    console.log(this.games);
    this.dataSource = new MatTableDataSource(this.games);
  }

  ngOnInit(): void {
    this.setupTable();
    this.store.select(fromGames.getCurrentSeason).subscribe(season => {
      this.store.dispatch(new gameActions.Load());
    });
  }
  setupTable() {
    this.displayedColumns = [
      'gameDate',
      'gameTime',
      'locationName',
      'homeTeamName',
      'visitingTeamName',
      'homeTeamScore',
      'visitingTeamScore'
    ];
    if (this.currentScreenWidth === 'xs') {
      // only display internalId on larger screens
      //this.displayedColumns.shift(); // remove 'internalId'
      this.displayedColumns = [
        'gameDate',
        'gameTime',
        'locationName',
        'homeTeamName',
        'visitingTeamName'
      ];
    }
  }
}
