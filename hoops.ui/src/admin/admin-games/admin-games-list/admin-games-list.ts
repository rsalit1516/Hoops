import {
  Component,
  OnChanges,
  OnInit,
  TemplateRef,
  ViewChild,
  effect,
  inject,
  input,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { RegularGame } from '@app/domain/regularGame';
import * as fromAdmin from '../../state';
import { Observable } from 'rxjs';
import { DatePipe, NgIf } from '@angular/common';
import { TeamDisplayPipe } from '@app/shared/pipes/team-display.pipe';
// import { ReactiveFormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { PaginationPreferencesService } from '@app/services/pagination-preferences.service';
import { AdminGameService } from '../adminGame.service';
import { GameService } from '@app/services/game.service';

import { LoggerService } from '@app/services/logger.service';
import { Router } from '@angular/router';
import {
  GenericMatTableComponent,
  TableColumn,
} from '../../shared/generic-mat-table/generic-mat-table';
@Component({
  selector: 'csbc-admin-games-list',
  imports: [
    MatIconModule,
    MatIconModule,
    DatePipe,
    TeamDisplayPipe,
    GenericMatTableComponent,
  ],
  templateUrl: './admin-games-list.html',
  styleUrls: [
    '../../../shared/scss/tables.scss',
    './admin-games-list.scss',
    '../../admin.scss',
  ],
})
export class AdminGamesList implements OnInit, OnChanges {
  adminGameService = inject(AdminGameService);
  gameService = inject(GameService);
  readonly router = inject(Router);
  readonly logger = inject(LoggerService);
  private readonly prefs = inject(PaginationPreferencesService);
  readonly showScores = input<boolean>(false);
  pageTitle = 'Admin Game List';
  dialog = inject(MatDialog);
  dataSource!: MatTableDataSource<RegularGame>;
  games!: RegularGame[];
  games$: Observable<RegularGame[]> | undefined;
  flexMediaWatcher: any;
  currentScreenWidth: any;
  title = 'Game List';
  canEdit: boolean = false;
  clickedRows = new Set<RegularGame>();
  pageSize = this.prefs.getPageSize(10);

  @ViewChild('gameDateTemplate', { static: true })
  gameDateTemplate!: TemplateRef<unknown>;

  @ViewChild('gameTimeTemplate', { static: true })
  gameTimeTemplate!: TemplateRef<unknown>;

  @ViewChild('homeTeamTemplate', { static: true })
  homeTeamTemplate!: TemplateRef<unknown>;

  @ViewChild('visitingTeamTemplate', { static: true })
  visitingTeamTemplate!: TemplateRef<unknown>;

  @ViewChild('actionsTemplate', { static: true })
  actionsTemplate!: TemplateRef<unknown>;

  filteredGames = this.gameService.divisionGames;
  columns: TableColumn<RegularGame>[] = [];
  showPlayoffs = false;
  showRegularSeason = true;
  private listEffectCounter = 0;

  constructor() {
    this.updateColumns();

    effect(() => {
      this.listEffectCounter++;
      this.logger.debug(
        `[LIST-EFFECT] Admin games list effect run #${this.listEffectCounter}`,
      );
      const games = this.gameService.divisionGames();
      this.logger.debug(
        `[LIST-EFFECT] divisionGames count: ${games?.length ?? 0}`,
      );
      this.dataSource = new MatTableDataSource(games!);
      this.updateColumns();
      // Note: Don't subscribe to paginator.page here - it's already handled in ngOnChanges
      // Creating multiple subscriptions causes memory leaks and can trigger unwanted refreshes
    });
    //  this.store.select(fromAdmin.getFilteredGames).subscribe((games) => {
    // this.dataSource = new MatTableDataSource(this.filteredGames());
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.pageSize = 10;
    // }
    // });
  }

  ngOnInit(): void {
    this.updateColumns();
    // this.store.select(fromAdmin.getFilteredGames).subscribe((games) => {
    // console.log(games);
    // this.games = games;
    // this.dataSource = new MatTableDataSource<RegularGame>(this.gameService.divisionGames());
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.pageSize = 10;
    // }
    // });
  }
  ngOnChanges() {
    this.updateColumns();
  }

  updateColumns() {
    const nextColumns: TableColumn<RegularGame>[] = [
      { key: 'gameDate', header: 'Date', template: this.gameDateTemplate },
      { key: 'gameTime', header: 'Time', template: this.gameTimeTemplate },
      { key: 'locationName', header: 'Location', field: 'locationName' },
      { key: 'homeTeamName', header: 'Home', template: this.homeTeamTemplate },
      {
        key: 'visitingTeamName',
        header: 'Visitor',
        template: this.visitingTeamTemplate,
      },
    ];

    if (this.showScores()) {
      nextColumns.push(
        { key: 'homeTeamScore', header: 'Home Score', field: 'homeTeamScore' },
        {
          key: 'visitingTeamScore',
          header: 'Visitor Score',
          field: 'visitingTeamScore',
        },
      );
    }

    if (this.canEdit) {
      nextColumns.push({
        key: 'actions',
        header: 'Actions',
        template: this.actionsTemplate,
      });
    }

    this.columns = nextColumns;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  editGame(game: RegularGame) {
    // TODO: implement this method
  }
  selectRow(row: RegularGame) {
    this.logger.debug('Row selected', row);
    this.gameService.updateSelectedGame(row);
    this.router.navigate(['./admin/games/detail-regular']);
  }
  dataExists(): boolean {
    return this.games.length > 0;
  }
  handlefilterUpdate($event: any) {
    this.logger.info($event.gametType);
    if ($event.gameType === 'Playoffs') {
      this.showPlayoffs = true;
      this.showRegularSeason = false;
    } else {
      this.showPlayoffs = false;
      this.showRegularSeason = true;
    }
  }
}
