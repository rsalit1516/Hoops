import { AfterViewInit, Component, OnChanges, OnInit, ViewChild, effect, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { RegularGame } from '@app/domain/regularGame';
import * as fromAdmin from '../../state';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdminGameService } from '../adminGame.service';
import { GameService } from '@app/services/game.service';
import { ShellTitleComponent } from '@app/shared/components/shell-title/shell-title.component';
import { AdminGamesFilterComponent } from '../admin-games-filter/admin-games-filter.component';
import { LoggerService } from '@app/services/logging.service';
import { Router } from '@angular/router';
@Component({
  selector: 'csbc-admin-games-list',
  imports: [CommonModule, MatIconModule, MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    ShellTitleComponent,
    AdminGamesFilterComponent],
  templateUrl: './admin-games-list.component.html',
  styleUrls: [
    '../../../shared/scss/tables.scss',
    './admin-games-list.component.scss',
    '../../admin.component.scss',
  ],
  providers: [MatSort, MatPaginator]
})
export class AdminGamesListComponent implements OnInit, OnChanges, AfterViewInit {
  adminGameService = inject(AdminGameService);
  gameService = inject(GameService);
  readonly #router = inject(Router);
  readonly #logger = inject(LoggerService);
  readonly showScores = input<boolean>(false);
  pageTitle = 'Admin Game List';
  dialog = inject(MatDialog);
  dataSource!: MatTableDataSource<RegularGame>;
  games!: RegularGame[];
  games$: Observable<RegularGame[]> | undefined;
  pageSizeOptions = [5, 10, 25]
  flexMediaWatcher: any;
  currentScreenWidth: any;
  title = 'Game List';
  canEdit: boolean = false;
  clickedRows = new Set<RegularGame>();
  showFirstLastButtons = true;
  pageSize = 10;

  @ViewChild('gamesPaginator') paginator: MatPaginator = inject(MatPaginator);
  @ViewChild(MatSort) sort: MatSort = inject(MatSort);
  filteredGames = this.gameService.divisionGames;
  displayedColumns = [
    'gameDate',
    'gameTime',
    'locationName',
    'homeTeamName',
    'visitingTeamName',
    'homeTeamScore',
    'visitingTeamScore',

  ];
  showPlayoffs = false;
  showRegularSeason = true;
  constructor (
  ) {
    this.setupTable();

    effect(() => {
      console.log("list component effect");
      this.dataSource = new MatTableDataSource(this.gameService.divisionGames()!);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator.pageSize = this.pageSize;
      this.paginator.page.subscribe(() => this.refreshData());

    })
    //  this.store.select(fromAdmin.getFilteredGames).subscribe((games) => {
    // this.dataSource = new MatTableDataSource(this.filteredGames());
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.pageSize = 10;
    // }
    // });
  }

  ngOnInit (): void {
    this.setupTable();
    // this.store.select(fromAdmin.getFilteredGames).subscribe((games) => {
    // console.log(games);
    // this.games = games;
    // this.dataSource = new MatTableDataSource<RegularGame>(this.gameService.divisionGames());
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.pageSize = 10;
    // }
    // });
  }
  ngAfterViewInit () {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges () {
    this.paginator.page.subscribe(() => this.refreshData());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  setupTable () {
    if (this.showScores()) {
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
  applyFilter (event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  editGame (game: RegularGame) {
    // TODO: implement this method
  }
  selectRow (row: RegularGame) {
    console.log(row);
    this.gameService.updateSelectedGame(row);
    this.#router.navigate(['./admin/games/detail-regular']);
  }
  dataExists (): boolean {
    return this.games.length > 0;
  }
  refreshData () {
    this.dataSource._updateChangeSubscription();
    this.dataSource.disconnect()
    this.dataSource.connect();
  }
  handlefilterUpdate ($event: any) {
    this.#logger.log($event.gametType);
    if ($event.gameType === 'Playoffs') {
      this.showPlayoffs = true;
      this.showRegularSeason = false;
    } else {
      this.showPlayoffs = false;
      this.showRegularSeason = true;

    }
  }
}
