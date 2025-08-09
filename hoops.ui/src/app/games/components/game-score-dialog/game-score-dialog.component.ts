import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  EffectRef,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { GameService } from '@app/services/game.service';

// import * as fromGames from '../../state';
// import { Store, select } from '@ngrx/store';
import { RegularGame } from '@app/domain/regularGame';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'game-score-dialog',
  templateUrl: './game-score-dialog.component.html',
  styleUrls: ['./game-score-dialog.component.scss'],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
  ],
})
export class GameScoreDialogComponent implements OnInit, OnDestroy {
  gameScoreForm = this.fb.group({
    homeTeamName: new UntypedFormControl(''),
    homeTeamScore: new UntypedFormControl(''),
    visitorTeamName: new UntypedFormControl(''),
    visitorTeamScore: new UntypedFormControl(''),
  });
  private gameService = inject(GameService);
  game = computed(() => this.gameService.selectedGameSignal());
  private effectRefs: EffectRef[] = [];

  constructor(
    public dialogRef: MatDialogRef<GameScoreDialogComponent>,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit() {
    // Reactive effect to sync form when selected game changes
    const ref = effect(() => {
      const g = this.game();
      if (!g) {
        return;
      }
      if (g.homeTeamScore !== null && g.homeTeamScore !== undefined) {
        this.gameScoreForm.controls['homeTeamScore'].setValue(g.homeTeamScore);
      }
      if (g.visitingTeamScore !== null && g.visitingTeamScore !== undefined) {
        this.gameScoreForm.controls['visitorTeamScore'].setValue(
          g.visitingTeamScore
        );
      }
    });
    this.effectRefs.push(ref);
  }
  ngOnDestroy() {
    this.effectRefs.forEach((r) => r.destroy());
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
      this.gameService.saveGame({
        game: this.game()!,
        homeTeamScore: this.gameScoreForm.controls['homeTeamScore'].value,
        visitingTeamScore:
          this.gameScoreForm.controls['visitorTeamScore'].value,
      });
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
