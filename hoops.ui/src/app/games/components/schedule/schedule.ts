import {
  Component,
  OnInit,
  Input,
  Output,
  input,
  computed,
  inject,
} from '@angular/core';
import { RegularGame } from '../../../domain/regularGame';
import { Store } from '@ngrx/store';
import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';
import * as gameActions from '../../state/games.actions';

import { GameScoreDialog } from '../game-score-dialog/game-score-dialog';
import { GameService } from '@app/services/game.service';
import { MatDialog } from '@angular/material/dialog';
import { DailySchedule } from '../daily-schedule/daily-schedule';
import { CommonModule, NgFor } from '@angular/common';
import { AuthService } from '@app/services/auth.service';
import { DivisionService } from '@app/services/division.service';

@Component({
  selector: 'csbc-schedule',
  template: `
    <div *ngFor="let data of dailySchedule()">
      <csbc-daily-schedule [games]="data" />
    </div>
  `,
  styleUrls: ['./schedule.scss'],
  imports: [CommonModule, DailySchedule],
})
export class Schedule implements OnInit {
  private gameService = inject(GameService);
  private divisionService = inject(DivisionService);
  private authService = inject(AuthService);
  // Depend on the signal's VALUE so changes propagate to the view
  readonly dailySchedule = computed(() => this.gameService.dailySchedule());

  groupedGames: RegularGame[] | undefined;
  _gamesByDate: [Date, RegularGame[]] | undefined;
  divisionId: number | undefined;
  flexMediaWatcher: any;
  currentScreenWidth: any;

  get games() {
    return this._games;
  }
  @Input()
  set games(games: RegularGame[]) {
    this._games = games;
  }
  private _games!: RegularGame[];

  // Access canEdit from AuthService computed signal
  get canEdit(): boolean {
    return this.authService.canEditGames();
  }

  errorMessage: string | undefined;
  public title: string;

  constructor(
    private store: Store<fromGames.State>,
    public dialog: MatDialog // private media: MediaObserver,
  ) {
    this.title = 'Schedule!';
    // this.flexMediaWatcher = media.media$.subscribe((change) => {
    //   if (change.mqAlias !== this.currentScreenWidth) {
    //     this.currentScreenWidth = change.mqAlias;
    //   }
    // });
    // this.dailySchedule = new Array<Game[]>();
  }

  ngOnInit() {
    // No longer needed - canEditGames is now a computed signal that automatically
    // updates when the selected division or current user changes
  }

  editGame(game: RegularGame) {
    this.store.dispatch(new gameActions.SetCurrentGame(game));
    const dialogRef = this.dialog.open(GameScoreDialog, {
      width: '500px',
      data: { game },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
