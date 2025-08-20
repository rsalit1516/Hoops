import { Component, effect, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PlayoffGame } from '@app/domain/playoffGame';
import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayoffGameService } from '@app/services/playoff-game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'csbc-admin-games-playoffs-list',
  templateUrl: './admin-games-playoffs-list.html',
  styleUrls: [
    './admin-games-playoffs-list.scss',
    '../../admin.scss',
    '../../../shared/scss/tables.scss',
  ],
  imports: [
    FormsModule,
    NgIf,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
  ],
})
export class AdminGamesPlayoffsList implements OnInit {
  gameService = inject(PlayoffGameService);
  readonly router = inject(Router);
  title = 'Playoff Games';
  dataSource!: MatTableDataSource<PlayoffGame>;
  clickedRows = new Set<PlayoffGame>();
  currentScreenWidth: any;
  games!: PlayoffGame[];
  canEdit = false;

  // Make isNaN available in template
  isNaN = isNaN;

  displayedColumns!: string[];
  flexMediaWatcher: any;
  constructor(private store: Store<fromAdmin.State>, public dialog: MatDialog) {
    effect(() => {
      console.log(this.gameService.divisionPlayoffGames());
      this.dataSource = new MatTableDataSource(
        this.gameService.divisionPlayoffGames()!
      );
      console.log(this.dataSource);
    });
    this.setupTable();
  }

  ngOnInit(): void {}
  setupTable() {
    this.displayedColumns = [
      'gameDate',
      'gameTime',
      'locationName',
      'homeTeam',
      'visitingTeam',
      'homeTeamScore',
      'visitingTeamScore',
    ];
    if (this.canEdit) {
      this.displayedColumns = [...this.displayedColumns, 'actions'];
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
    this.dataSource = new MatTableDataSource(this.games);
  }
  editGame(game: PlayoffGame) {
    this.gameService.updateSelectedRecord(game);
    this.router.navigate(['./admin/games/detail-playoff']);
  }
  newGame() {
    // Seed a new, blank record with defaults
    const divisionId = this.gameService.selectedDivision()?.divisionId;
    const divGames = this.gameService.divisionPlayoffGames();
    const scheduleNumber =
      divGames && divGames.length > 0 ? divGames[0].scheduleNumber : 1;
    const now = new Date();
    const blank: PlayoffGame & { schedulePlayoffId?: number } = {
      scheduleNumber,
      gameNumber: 0,
      divisionId: divisionId ?? 0,
      descr: '',
      gameId: 0,
      locationNumber: undefined,
      gameDate: new Date(now.toISOString().slice(0, 10)),
      gameTime: undefined,
      homeTeam: '',
      visitingTeam: '',
      homeTeamScore: 0,
      visitingTeamScore: 0,
      locationName: undefined,
    };
    this.gameService.updateSelectedRecord(blank);
    this.router.navigate(['./admin/games/detail-playoff']);
  }
  selectRow(row: any) {
    console.log(row);
    // Ensure record is normalized for keys and time parsing
    const record: PlayoffGame = {
      scheduleNumber: (row.scheduleNumber ?? row.ScheduleNumber) as number,
      gameNumber: (row.gameNumber ?? row.GameNumber) as number,
      // carry PK for by-id updates
      ...(row.schedulePlayoffId || row.SchedulePlayoffId
        ? {
            schedulePlayoffId: (row.schedulePlayoffId ??
              row.SchedulePlayoffId) as number,
          }
        : {}),
      descr: row.descr ?? row.Descr,
      divisionId: (row.divisionId ?? row.DivisionId) as number,
      gameId: (row.gameId ?? row.GameId) as number,
      locationNumber: (row.locationNumber ?? row.LocationNumber) as number,
      gameDate: new Date(row.gameDate ?? row.GameDate),
      gameTime: row.gameTime
        ? new Date(row.gameTime)
        : row.GameTime
        ? new Date(row.GameTime)
        : undefined,
      homeTeam: row.homeTeam ?? row.HomeTeam,
      visitingTeam: row.visitingTeam ?? row.VisitingTeam,
      homeTeamScore: row.homeTeamScore ?? row.HomeTeamScore,
      visitingTeamScore: row.visitingTeamScore ?? row.VisitingTeamScore,
      locationName: row.locationName ?? row.LocationName,
    } as PlayoffGame;
    this.gameService.updateSelectedRecord(record);
    this.router.navigate(['./admin/games/detail-playoff']);
  }
}
