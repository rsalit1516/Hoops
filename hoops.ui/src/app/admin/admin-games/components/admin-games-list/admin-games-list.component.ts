import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { MediaObserver } from '@angular/flex-layout';
import { MatTableDataSource } from '@angular/material/table';
import { Game } from 'app/domain/game';
import * as fromAdmin from '../../../state';
import * as adminActions from '../../../state/admin.actions';
import { Observable } from 'rxjs';
@Component({
  selector: 'admin-games-list',
  templateUrl: './admin-games-list.component.html',
  styleUrls: [
    './admin-games-list.component.scss',
    '../../../admin.component.scss',
  ],
})
export class AdminGamesListComponent implements OnInit {
  dataSource!: MatTableDataSource<Game>;
  games!: Game[];
  games$: Observable<Game[]> | undefined;

  displayedColumns!: string[];
  flexMediaWatcher: any;
  currentScreenWidth: any;
  title = 'Game List';
  canEdit: boolean = false;
  clickedRows = new Set<Game>();

  constructor(
    private store: Store<fromAdmin.State>,
    public dialog: MatDialog,
    private media: MediaObserver
  ) {
    this.flexMediaWatcher = media.media$.subscribe((change) => {
      if (change.mqAlias !== this.currentScreenWidth) {
        this.currentScreenWidth = change.mqAlias;
        this.setupTable();
      }
    });
    this.displayedColumns = [
      'gameDate',
      'gameTime',
      'locationName',
      'homeTeamName',
      'visitingTeamName',
      'homeTeamScore',
      'visitingTeamScore',
    ];
    console.log(this.games);
    this.store.select(fromAdmin.getFilteredGames).subscribe((games) => {
      this.dataSource = new MatTableDataSource(games);
    });
  }

  ngOnInit(): void {
    this.setupTable();
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
  editGame(game: Game) {
    // TODO: implement this method
  }
  selectRow(row: any) {
    console.log(row);
    this.store.dispatch(new adminActions.SetSelectedGame(row));
  }
}
