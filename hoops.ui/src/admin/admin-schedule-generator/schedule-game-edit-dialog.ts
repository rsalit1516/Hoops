import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import {
  GameEditDialogData,
  GameEditDialogResult,
} from '@app/domain/schedule-generator.model';

interface GameEditModel {
  gameDate: Date | null;
  gameTime: string;
  locationNumber: number | null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-schedule-game-edit-dialog',
  standalone: true,
  imports: [
    FormField,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './schedule-game-edit-dialog.html',
  styleUrls: [
    '../../shared/scss/forms.scss',
    '../../shared/scss/cards.scss',
  ],
})
export class ScheduleGameEditDialogComponent {
  private dialogRef = inject<MatDialogRef<ScheduleGameEditDialogComponent>>(MatDialogRef);
  readonly data = inject<GameEditDialogData>(MAT_DIALOG_DATA);

  private readonly model = signal<GameEditModel>({
    gameDate: null,
    gameTime: '',
    locationNumber: null,
  });

  readonly gameForm = form(this.model);

  readonly canSave = computed(() => {
    const m = this.model();
    return m.gameDate != null && m.gameTime !== '' && m.locationNumber != null;
  });

  constructor() {
    const g = this.data.game;
    const d = new Date(g.gameDate);
    this.model.set({
      gameDate: d,
      gameTime: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
      locationNumber: g.locationNumber,
    });
  }

  save() {
    const m = this.model();
    if (!m.gameDate || !m.gameTime || m.locationNumber == null) return;
    const d = new Date(m.gameDate);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    this.dialogRef.close({ gameDate: dateStr, gameTime: m.gameTime, locationNumber: m.locationNumber } as GameEditDialogResult);
  }

  cancel() {
    this.dialogRef.close();
  }
}
