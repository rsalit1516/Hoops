import { Component, OnInit, Input, inject, effect } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { LoggerService } from '@app/services/logger.service';
import { DivisionService } from '@app/services/division.service';
import { GameService } from '@app/services/game.service';

import { RegularGame } from '@app/domain/regularGame';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'csbc-scores',
  templateUrl: './scores.html',
  styleUrls: ['./scores.scss', '../../containers/games-shell/games-shell.scss'],
  imports: [MatTableModule, MatButtonModule, MatIconModule, DatePipe],
})
export class Scores implements OnInit {
  dialog = inject(MatDialog);
  private logger = inject(LoggerService);
  readonly authService = inject(AuthService);
  private divisionService = inject(DivisionService);
  private gameService = inject(GameService);

  dataSource!: MatTableDataSource<RegularGame>;
  groupedGames!: RegularGame[];
  _gamesByDate!: [Date, RegularGame[]];
  divisionId: number | undefined;
  flexMediaWatcher: any;
  currentScreenWidth: any;

  get games() { return this._games; }
  @Input()
  set games(games: RegularGame[]) {
    this._games = games;
    this.dataSource = new MatTableDataSource(games);
  }
  private _games!: RegularGame[];

  errorMessage!: string;
  public title: string;

  displayedColumns = [
    'gameDate',
    'visitingTeamName',
    'homeTeamName',
    'visitingTeamScore',
    'homeTeamScore',
  ];

  constructor() {
    this.title = 'Schedule!';
    effect(() => {
      this.divisionId = this.divisionService.selectedDivision()?.divisionId;
    });
    effect(() => {
      const games = this.gameService.divisionGames();
      this.games = games;
      if (this.dataSource) this.dataSource.data = games;
    });
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.games);
    if (this.authService.canEditGames()) {
      this.displayedColumns.push('actions');
    }
  }
}
