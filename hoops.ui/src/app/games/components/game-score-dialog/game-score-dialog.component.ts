import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GameService } from '@app/games/game.service';

import * as fromGames from '../../state';
import { Store, select } from '@ngrx/store';
import { Game } from '@app/domain/game';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'game-score-dialog',
    templateUrl: './game-score-dialog.component.html',
    styleUrls: ['./game-score-dialog.component.scss'],
    standalone: true,
    imports: [MatDialogTitle, MatDialogContent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDialogActions, MatButtonModule, MatDialogClose]
})
export class GameScoreDialogComponent implements OnInit {
  gameScoreForm = this.fb.group({
    homeTeamName: new UntypedFormControl(''),
    homeTeamScore: new UntypedFormControl(''),
    visitorTeamName: new UntypedFormControl(''),
    visitorTeamScore: new UntypedFormControl('')
  });
  game$: any;
  game!: Game;

  constructor(
    public dialogRef: MatDialogRef<GameScoreDialogComponent>,
    private fb: UntypedFormBuilder,
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
