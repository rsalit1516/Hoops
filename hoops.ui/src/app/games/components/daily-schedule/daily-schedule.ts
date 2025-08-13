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
import { GameScoreDialog } from '../game-score-dialog/game-score-dialog';

import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';
// import * as gameActions from '../../state/games.actions';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '@app/services/auth.service';
import { GameService } from '@app/services/game.service';

@Component({
  selector: 'csbc-daily-schedule',
  templateUrl: './daily-schedule.html',
  styleUrls: ['./daily-schedule.scss', './../../../shared/scss/tables.scss'],
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
})
export class DailySchedule implements OnInit {
  readonly games = input.required<RegularGame[]>();
  // @Input() canEdit!: boolean;
  canEdit = signal<boolean>(false);
  private authService = inject(AuthService);
  private gameService = inject(GameService);
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
    this.gameService.updateSelectedGame(game);
    const dialogRef = this.dialog.open(GameScoreDialog, {
      width: '500px',
      data: { game },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
