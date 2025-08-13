import {
  Component,
  OnDestroy,
  effect,
  inject,
  EffectRef,
  Signal,
  Inject,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
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
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'game-score-dialog',
  templateUrl: './game-score-dialog.html',
  styleUrls: ['./game-score-dialog.scss', './../../../shared/scss/forms.scss'],
  imports: [
    CommonModule,
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
export class GameScoreDialog implements OnDestroy {
  // Typed, non-nullable form for editable score fields only
  private static integerValidator(
    ctrl: AbstractControl
  ): ValidationErrors | null {
    const v = ctrl.value;
    if (v === null || v === undefined || v === '') return null; // required handled separately
    const n = typeof v === 'string' ? Number(v) : v;
    if (!Number.isFinite(n)) return { integer: true };
    return Number.isInteger(n) ? null : { integer: true };
  }
  gameScoreForm = this.fb.nonNullable.group({
    homeTeamScore: [
      0,
      [
        Validators.required,
        Validators.min(0),
        Validators.max(150),
        GameScoreDialog.integerValidator,
      ],
    ],
    visitorTeamScore: [
      0,
      [
        Validators.required,
        Validators.min(0),
        Validators.max(150),
        GameScoreDialog.integerValidator,
      ],
    ],
  });
  gameService = inject(GameService);
  // Keep a reference to the readonly signal; call game() to access value
  readonly game: Signal<RegularGame | null> =
    this.gameService.selectedGameSignal;
  private effectRef?: EffectRef; // (may be removed if no live updates)
  saving = false;

  constructor(
    public dialogRef: MatDialogRef<GameScoreDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { game?: RegularGame }
  ) {
    const initial = data?.game ?? this.game();
    console.log('GameScoreDialog initial game:', initial);
    if (initial) {
      // Sync the service-selected game so template signal updates between dialog openings
      this.gameService.updateSelectedGame(initial);
      this.patchForm(initial, true);
    }
    // If you expect external score updates while dialog is open, re-enable effect below
    // this.effectRef = effect(() => {
    //   const g = this.game();
    //   if (!g) return;
    //   this.patchForm(g, false);
    // });
  }
  ngOnDestroy() {
    if (this.effectRef) {
      this.effectRef.destroy();
    }
  }
  onCancelClick() {
    this.dialogRef.close();
  }
  onSubmitClick() {
    console.log('Submitting game score:', this.gameScoreForm.value);
    const selectedGame = this.game();
    if (!selectedGame) return;
    if (this.gameScoreForm.invalid) return;
    const { homeTeamScore, visitorTeamScore } =
      this.gameScoreForm.getRawValue();
    const h = Number(homeTeamScore);
    const v = Number(visitorTeamScore);
    // Additional explicit validation (integer + range) safeguard
    if (!this.validate(h, v)) return;
    this.saving = true;
    this.gameService
      .saveGame({
        game: selectedGame,
        homeTeamScore: h,
        visitingTeamScore: v,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.dialogRef.close();
        },
        error: (err) => {
          console.error('Failed to save scores', err);
          this.saving = false;
        },
      });
  }

  private patchForm(g: RegularGame, forceAll: boolean) {
    console.log('Patching form with game:', g);
    const { homeTeamScore = 0, visitingTeamScore = 0 } = g;
    const homeCtrl = this.gameScoreForm.controls.homeTeamScore;
    const visitCtrl = this.gameScoreForm.controls.visitorTeamScore;
    if (forceAll || homeCtrl.pristine) {
      homeCtrl.setValue(this.clampScore(homeTeamScore));
    }
    if (forceAll || visitCtrl.pristine) {
      visitCtrl.setValue(this.clampScore(visitingTeamScore));
    }
  }
  private clampScore(v: number): number {
    if (isNaN(v as any)) return 0;
    return Math.min(150, Math.max(0, Math.round(v)));
  }
  validate(homeTeamScore: number, visitorTeamScore: number) {
    return this.gameService.validateScores(homeTeamScore, visitorTeamScore);
  }

  // Convenience getters for template
  get homeTeamScoreCtrl() {
    return this.gameScoreForm.controls.homeTeamScore;
  }
  get visitorTeamScoreCtrl() {
    return this.gameScoreForm.controls.visitorTeamScore;
  }
  get canSubmit() {
    return this.gameScoreForm.valid;
  }
}
