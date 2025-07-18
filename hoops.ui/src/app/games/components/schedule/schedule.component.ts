import { Component, OnInit, Input, Output, input, computed, inject } from '@angular/core';
import { RegularGame } from '../../../domain/regularGame';
import { Store } from '@ngrx/store';
import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';
import * as gameActions from '../../state/games.actions';

import { GameScoreDialogComponent } from '../game-score-dialog/game-score-dialog.component';
import { GameService } from '@app/services/game.service';
import { MatDialog } from '@angular/material/dialog';
import { DailyScheduleComponent } from '../daily-schedule/daily-schedule.component';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'csbc-schedule',
  template: `
    <div *ngFor="let data of dailySchedule()">
    <csbc-daily-schedule [games]="data" [canEdit]="canEdit" />
  </div>
  `,
  styleUrls: ['./schedule.component.scss'],
  imports: [CommonModule, DailyScheduleComponent]
})
export class ScheduleComponent implements OnInit {
  readonly #gameService = inject(GameService);
  readonly dailySchedule = computed(() => this.#gameService.dailySchedule());
  groupedGames: RegularGame[] | undefined;
  _gamesByDate: [Date, RegularGame[]] | undefined;
  divisionId: number | undefined;
  flexMediaWatcher: any;
  currentScreenWidth: any;


  get games () {
    return this._games;
  }
  @Input()
  set games (games: RegularGame[]) {
    this._games = games;
  }
  private _games!: RegularGame[];
  @Output()
  canEdit!: boolean;

  errorMessage: string | undefined;
  public title: string;

  constructor (
    private store: Store<fromGames.State>,
    public dialog: MatDialog,
    // private media: MediaObserver,
  ) {
    this.title = 'Schedule!';
    // this.flexMediaWatcher = media.media$.subscribe((change) => {
    //   if (change.mqAlias !== this.currentScreenWidth) {
    //     this.currentScreenWidth = change.mqAlias;
    //   }
    // });
    // this.dailySchedule = new Array<Game[]>();
  }

  ngOnInit () {
  }

  editGame (game: RegularGame) {
    this.store.dispatch(new gameActions.SetCurrentGame(game));
    const dialogRef = this.dialog.open(GameScoreDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
