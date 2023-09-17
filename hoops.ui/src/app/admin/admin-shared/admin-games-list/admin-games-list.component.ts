import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MediaObserver } from '@angular/flex-layout';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Game } from '@app/domain/game';
import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/core/material/material.module';
@Component({
  selector: 'admin-games-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './admin-games-list.component.html',
  styleUrls: [
    './admin-games-list.component.scss',
    '../../admin.component.scss',
  ],
})
export class AdminGamesListComponent implements OnInit {
  @Input() showScores: boolean = false;
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
    this.store.select(fromAdmin.getFilteredGames).subscribe((games) => {
      this.dataSource = new MatTableDataSource(games);
    });
  }

  ngOnInit(): void {
    this.setupTable();
    this.store.select(fromAdmin.getFilteredGames).subscribe((games) => {
      // console.log(games);
      this.games = games;
      this.dataSource = new MatTableDataSource<Game>(games);
    });
  }

  setupTable() {
    if (this.showScores) {
      this.displayedColumns = [
        'gameDate',
        'gameTime',
        'locationName',
        'homeTeamName',
        'visitingTeamName',
        'homeTeamScore',
        'visitingTeamScore',
      ];
    } else {
      this.displayedColumns = [
        'gameDate',
        'gameTime',
        'locationName',
        'homeTeamName',
        'visitingTeamName',
      ];
    }
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
  }
  editGame(game: Game) {
    // TODO: implement this method
  }
  selectRow(row: any) {
    console.log(row);
    this.store.dispatch(new adminActions.SetSelectedGame(row));
  }
  dataExists(): boolean {
    return this.games.length > 0;
  }
}
