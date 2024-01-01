import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MediaObserver } from '@angular/flex-layout';
import { Game } from '@app/domain/game';
import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
@Component({
  selector: 'admin-games-list',
  standalone: true,
  imports: [ CommonModule, MatIconModule, MatTableModule, MatPaginatorModule,
  MatIconModule],
  templateUrl: './admin-games-list.component.html',
  styleUrls: [
    '../../../shared/scss/tables.scss',
    './admin-games-list.component.scss',
    '../../admin.component.scss',
  ],
})
export class AdminGamesListComponent implements OnInit {
  @Input() showScores: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dialog = inject(MatDialog);
  dataSource!: MatTableDataSource<Game>;
  games!: Game[];
  games$: Observable<Game[]> | undefined;
  pageSizeOptions = [5, 10, 25]

  displayedColumns!: string[];
  flexMediaWatcher: any;
  currentScreenWidth: any;
  title = 'Game List';
  canEdit: boolean = false;
  clickedRows = new Set<Game>();

  constructor(
    private store: Store<fromAdmin.State>,
//    public dialog: MatDialog,
    private media: MediaObserver
  ) {
    // this.flexMediaWatcher = media.media$.subscribe((change) => {
    //   if (change.mqAlias !== this.currentScreenWidth) {
    //     this.currentScreenWidth = change.mqAlias;
        this.setupTable();
    //   }
    // });
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
      // if (this.dataSource.paginator) {
      //   this.dataSource.paginator.pageSize = 10;
      // }
    });
  }

  ngOnInit(): void {
    this.setupTable();
    this.store.select(fromAdmin.getFilteredGames).subscribe((games) => {
      // console.log(games);
      this.games = games;
      // this.dataSource = new MatTableDataSource<Game>(games);
      // if (this.dataSource.paginator) {
      //   this.dataSource.paginator.pageSize = 10;
      // }
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
