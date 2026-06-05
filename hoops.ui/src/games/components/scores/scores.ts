import { Component, OnInit, Input, inject } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { LoggerService } from '@app/services/logger.service';
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
  imports: [
    //
    MatTableModule,
    // NgIf,
    MatButtonModule,
    MatIconModule,
    DatePipe
],
})
export class Scores implements OnInit {
  dialog = inject(MatDialog);
  private logger = inject(LoggerService);

  readonly authService = inject(AuthService);
  dataSource!: MatTableDataSource<RegularGame>;
  groupedGames!: RegularGame[];
  _gamesByDate!: [Date, RegularGame[]];
  divisionId: number | undefined;
  flexMediaWatcher: any;
  currentScreenWidth: any;
  get games() {
    return this._games;
  }
  @Input()
  set games(games: RegularGame[]) {
    this._games = games;
    //    console.log(games);
    this.dataSource = new MatTableDataSource(games);
    //this.groupByDate(games).subscribe(grouped => {
    // this.groupedGames = grouped;
    //console.log(grouped);
    //});
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

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {
    this.title = 'Schedule!';
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.games);
    if (this.authService.canEditGames()) {
      this.displayedColumns.push('actions');
    }
  }
}
