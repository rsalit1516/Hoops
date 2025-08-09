import {
  Component,
  OnInit,
  ViewChild,
  Input,
  input,
  inject,
  computed,
  effect,
  signal,
} from '@angular/core';
import { RegularGame } from '@app/domain/regularGame';
import { Store, select } from '@ngrx/store';
import { GameScoreDialogComponent } from '../game-score-dialog/game-score-dialog.component';

import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';
import * as gameActions from '../../state/games.actions';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'csbc-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: [
    './daily-schedule.component.scss',
    './../../../shared/scss/tables.scss',
  ],
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
})
export class DailyScheduleComponent implements OnInit {
  readonly games = input.required<RegularGame[]>();
  // @Input() canEdit!: boolean;
  canEdit = signal<boolean>(false);
  private authService = inject(AuthService);
  displayedColumns = [
    'gameTime',
    'locationName',
    'homeTeam',
    'visitingTeam',
    'homeTeamScore',
    'visitingTeamScore',
    // 'actions',
  ];
  data: RegularGame[] = []; // = this.games;
  gameDate!: Date;
  flexMediaWatcher: any;
  currentScreenWidth: string | undefined;
  // canEdit = this.authService.canEditGames();

  constructor(
    private store: Store<fromGames.State>,
    public dialog: MatDialog // private media: MediaObserver
  ) {
    effect(() => {
      this.canEdit.set(this.authService.canEditGames());
      if (this.canEdit() === true) {
        this.displayedColumns.push('actions');
      }
    });
  }

  ngOnInit() {
    this.data = this.games();
    // console.log(this.games());
    // this.flexMediaWatcher = this.media.media$.subscribe((change) => {
    // if (change.mqAlias !== this.currentScreenWidth) {
    //   this.currentScreenWidth = change.mqAlias;
    this.setupTable();
    // this.canEdit.set(this.authService.canEditGames());
    // if (this.canEdit()) {
    //   this.displayedColumns.push('actions');
    // }
    // }
    // });
    this.gameDate! = this.data[0].gameDate as Date;
  }
  setupTable() {
    if (this.currentScreenWidth === 'xs') {
      // only display internalId on larger screens
      //this.displayedColumns.shift(); // remove 'internalId'
      this.displayedColumns = [
        'gameTime',
        'visitingTeam',
        'homeTeam',
        'locationName',
      ];
    }
    // } else {
    //   this.displayedColumns = [
    //     'gameTime',
    //     'visitingTeam',
    //     'homeTeam',
    //     'locationName',
    //     'visitingTeamScore',
    //     'homeTeamScore',
    //   ];
    // }
  }
  editGame(game: RegularGame) {
    this.store.dispatch(new gameActions.SetCurrentGame(game));
    const dialogRef = this.dialog.open(GameScoreDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
