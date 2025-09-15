import { Component, OnInit, Input, input, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AuthService } from '@app/services/auth.service';

import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';

import { RegularGame } from '@app/domain/regularGame';
import { User } from '@app/domain/user';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'csbc-scores',
  templateUrl: './scores.html',
  styleUrls: ['./scores.scss', '../../containers/games-shell/games-shell.scss'],
  imports: [
    CommonModule,
    //
    MatTableModule,
    // NgIf,
    MatButtonModule,
    MatIconModule,
    // DatePipe
  ],
})
export class Scores implements OnInit {
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
  private user!: User;

  displayedColumns = [
    'gameDate',
    'visitingTeamName',
    'homeTeamName',
    'visitingTeamScore',
    'homeTeamScore',
  ];
  constructor(
    @Inject(Store) private store: Store<fromGames.State>,
    private userStore: Store<fromUser.State>,
    public dialog: MatDialog // private media: MediaObserver
  ) {
    this.title = 'Schedule!';
  }

  ngOnInit() {
    this.userStore.pipe(select(fromUser.getCurrentUser)).subscribe((user) => {
      this.user = user;
      console.log(this.user);
    });
    this.store
      .pipe(select(fromGames.getCurrentDivision))
      .subscribe((division) => {
        if (division !== null && fromGames.getCurrentDivisionId !== undefined) {
          this.divisionId = division?.divisionId;
        }
      });
    this.store.pipe(select(fromGames.getFilteredGames)).subscribe((games) => {
      this.games = games;
      this.dataSource.data = games;
    });
    this.dataSource = new MatTableDataSource(this.games);
    // Dynamically add actions column if user can edit
    if (this.authService.canEditGames()) {
      this.displayedColumns.push('actions');
    }
  }
}
