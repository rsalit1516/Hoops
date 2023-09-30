import { Component, OnInit, Input, Output } from '@angular/core';
import { Game } from '../../../domain/game';
import { Store } from '@ngrx/store';
import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';
import * as gameActions from '../../state/games.actions';

import { GameScoreDialogComponent } from '../game-score-dialog/game-score-dialog.component';
import { MediaObserver } from '@angular/flex-layout';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GameService } from '@app/games/game.service';

@Component({
  selector: 'csbc-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  @Input() dailySchedule!: Array<Game[]>;
  groupedGames: Game[] | undefined;
  _gamesByDate: [Date, Game[]] | undefined;
  divisionId: number | undefined;
  flexMediaWatcher: any;
  currentScreenWidth: any;


  get games() {
    return this._games;
  }
  @Input()
  set games(games: Game[]) {
    this._games = games;
  }
  private _games!: Game[];
  @Output()
  canEdit!: boolean;

  errorMessage: string | undefined;
  public title: string;

  constructor(
    private store: Store<fromGames.State>,
    private userStore: Store<fromUser.State>,
    public dialog: MatDialog,
    private media: MediaObserver,
    private gameService: GameService
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
    // this.store.select(fromGames.getCurrentDivision).subscribe((division) => {
    //   this.store.select(fromGames.getFilteredGames).subscribe((games) => {
    //     this.games = games;
    //     this.dailySchedule = [];

    //     this.gameService.groupByDate(games).subscribe((dailyGames) => {
    //       this.dailySchedule.push(dailyGames);
    //     });
    //   });
    // });
  }

  editGame(game: Game) {
    this.store.dispatch(new gameActions.SetCurrentGame(game));
    const dialogRef = this.dialog.open(GameScoreDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
