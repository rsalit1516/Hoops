import { Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { GameService } from 'app/games/game.service';

import * as fromGames from '../../state';
import { Store, select } from '@ngrx/store';
import { Game } from 'app/domain/game';

@Component({
  selector: 'game-score-dialog',
  templateUrl: './game-score-dialog.component.html',
  styleUrls: ['./game-score-dialog.component.scss']
})
export class GameScoreDialogComponent implements OnInit {
  gameScoreForm = this.fb.group({
    homeTeamName: new FormControl(''),
    homeTeamScore: new FormControl(''),
    visitorTeamName: new FormControl(''),
    visitorTeamScore: new FormControl('')
  });
  game$: any;
  game: Game;

  constructor(
    public dialogRef: MatDialogRef<GameScoreDialogComponent>,
    private fb: FormBuilder,
    private gameService: GameService,
    private store: Store<fromGames.State>
  ) {}

  ngOnInit() {
    this.game$ = this.store
      .pipe(select(fromGames.getCurrentGame))
      .subscribe(game => {
        this.game = game;
        console.log(game);
        console.log(this.gameScoreForm.controls['homeTeamName']);
       // this.gameScoreForm.controls['homeTeamName'].setValue(game.homeTeamName);
       // this.gameScoreForm.controls['visitorTeamName'].setValue(game.visitingTeamName);
        if (game.homeTeamScore !== null) {
           this.gameScoreForm.controls['homeTeamScore'].setValue(game.homeTeamScore);
         }
         if (game.visitingTeamScore !== null) {
           this.gameScoreForm.controls['visitorTeamScore'].setValue(game.visitingTeamScore);
         }
      });
  }
  onCancelClick() {
    this.dialogRef.close();
  }
  onSubmitClick() {
    console.log(this.gameScoreForm);
    if (
      this.validate(
        this.gameScoreForm.controls['homeTeamScore'].value,
        this.gameScoreForm.controls['visitorTeamScore'].value
      )
    ) {
      console.log(this.gameScoreForm.controls['homeTeamScore'].value);
      this.gameService.saveGame({ game: this.game, homeTeamScore: this.gameScoreForm.controls['homeTeamScore'].value, visitingTeamScore: this.gameScoreForm.controls['visitorTeamScore'].value });
      this.dialogRef.close();
    }
  }
  validate(homeTeamScore: string, visitorTeamScore: string) {
    const valid = this.gameService.validateScores(
      homeTeamScore,
      visitorTeamScore
    );
    console.log(valid);
    return true;
  }
}
