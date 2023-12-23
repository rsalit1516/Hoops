import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PlayoffGame } from '@app/domain/playoffGame';
import * as fromAdmin from '../../../state';
import * as adminActions from '../../../state/admin.actions';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-games-playoffs-list',
  templateUrl: './admin-games-playoffs-list.component.html',
  styleUrls: ['./admin-games-playoffs-list.component.scss', ]
})
export class AdminGamesPlayoffsListComponent implements OnInit {
title = 'Playoff Games';
dataSource!: MatTableDataSource<PlayoffGame>;
clickedRows = new Set<PlayoffGame>();
currentScreenWidth: any;
games!: PlayoffGame[];
canEdit = false;

displayedColumns!: string[];
  flexMediaWatcher: any;
  constructor(  private store: Store<fromAdmin.State>,
    public dialog: MatDialog,
    private media: MediaObserver
) {
  // this.flexMediaWatcher = media.media$.subscribe((change) => {
  //   if (change.mqAlias !== this.currentScreenWidth) {
      // this.currentScreenWidth = change.mqAlias;
      this.setupTable();
  //   }
  // });

 }

  ngOnInit(): void {

  }
  setupTable() {
    this.displayedColumns = [
      'gameDate',
      'gameTime',
      'locationName',
      'homeTeamName',
      'visitingTeamName',
      'homeTeamScore',
      'visitingTeamScore',
    ];
    if (this.currentScreenWidth === 'xs') {
      // only display internalId on larger screens
      //this.displayedColumns.shift(); // remove 'internalId'
      this.displayedColumns = [
        'gameDate',
        'gameTime',
        'locationName',
        'homeTeamName',
        'visitingTeamName',
      ];
    }
    this.dataSource = new MatTableDataSource(this.games);
  }
  editGame(game: PlayoffGame) {
    // TODO: implement this method
  }
  selectRow(row: any) {
    console.log(row);
    this.store.dispatch(new adminActions.SetSelectedGame(row));
  }
}
