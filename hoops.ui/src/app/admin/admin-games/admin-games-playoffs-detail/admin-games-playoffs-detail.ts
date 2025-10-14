import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PlayoffGame } from '@app/domain/playoffGame';
import { DivisionService } from '@app/services/division.service';
import { PlayoffGameService } from '@app/services/playoff-game.service';
import { LocationService } from '@app/services/location.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Location as GymLocation } from '@app/domain/location';

@Component({
  selector: 'csbc-admin-games-playoffs-detail',
  templateUrl: './admin-games-playoffs-detail.html',
  styleUrls: [
    './admin-games-playoffs-detail.scss',
    '../../../shared/scss/forms.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatNativeDateModule,
    RouterModule,
    MatSnackBarModule,
  ],
})
export class AdminGamesPlayoffsDetail implements OnInit {
  readonly fb = inject(FormBuilder);
  readonly divisionService = inject(DivisionService);
  readonly playoffService = inject(PlayoffGameService);
  readonly locationService = inject(LocationService);
  readonly snack = inject(MatSnackBar);
  readonly router = inject(Router);

  form!: FormGroup;
  locationsSig = this.locationService.locations;
  isEditing = false;
  private selected = this.playoffService.selectedRecordSignal;
  isSaving = false;

  ngOnInit(): void {
    // Ensure locations are loaded
    this.locationService.fetchLocations();

    const divisionId = this.divisionService.selectedDivision()?.divisionId ?? 0;
    this.form = this.fb.group({
      divisionId: [divisionId, [Validators.required]],
      locationNumber: [null, [Validators.required]],
      gameDate: [null as Date | null, [Validators.required]],
      gameTime: [null as Date | null, [Validators.required]],
      descr: [''],
      homeTeam: ['', [Validators.required]],
      visitingTeam: ['', [Validators.required]],
      homeTeamScore: [null, [Validators.min(0)]],
      visitingTeamScore: [null, [Validators.min(0)]],
    });

    // Pre-populate only for editing existing records
    const rec = this.selected();
    const hasPk = (rec as any)?.schedulePlayoffId;
    const hasExistingGameNo = rec?.gameNumber && rec.gameNumber > 0;
    this.isEditing = !!(rec && (hasPk || hasExistingGameNo));
    if (this.isEditing && rec) {
      this.form.patchValue({
        divisionId: rec.divisionId ?? divisionId,
        locationNumber: rec.locationNumber ?? null,
        gameDate: rec.gameDate ? new Date(rec.gameDate) : null,
        gameTime: rec.gameTime ? new Date(rec.gameTime) : null,
        descr: rec.descr ?? '',
        homeTeam: rec.homeTeam ?? '',
        visitingTeam: rec.visitingTeam ?? '',
        homeTeamScore: rec.homeTeamScore ?? null,
        visitingTeamScore: rec.visitingTeamScore ?? null,
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.isSaving) return;
    this.isSaving = true;
    const value = this.form.value as {
      divisionId: number;
      locationNumber: number;
      gameDate: Date | null;
      gameTime: Date | null;
      descr?: string | null;
      homeTeam: string;
      visitingTeam: string;
      homeTeamScore?: number | null;
      visitingTeamScore?: number | null;
    };

    // Combine date and time as required by acceptance criteria
    // Both GameDate and GameTime fields should concatenate the date and time
    let combinedDateTime: Date | undefined;
    if (value.gameDate && value.gameTime) {
      // Create a new date using the date from gameDate and time from gameTime
      const dateOnly = new Date(value.gameDate);
      const timeOnly = new Date(value.gameTime);
      combinedDateTime = new Date(
        dateOnly.getFullYear(),
        dateOnly.getMonth(),
        dateOnly.getDate(),
        timeOnly.getHours(),
        timeOnly.getMinutes(),
        timeOnly.getSeconds()
      );
    } else if (value.gameDate) {
      combinedDateTime = new Date(value.gameDate);
    }

    const selected = this.selected();
    const payload: PlayoffGame & { schedulePlayoffId?: number } = {
      scheduleNumber: selected?.scheduleNumber ?? 0,
      gameNumber: selected?.gameNumber ?? 0,
      schedulePlayoffId: (selected as any)?.schedulePlayoffId,
      descr: value.descr ?? selected?.descr ?? '',
      divisionId: value.divisionId,
      gameId: 0,
      locationNumber: value.locationNumber,
      gameDate: combinedDateTime ?? new Date(),
      gameTime: combinedDateTime,
      homeTeam: value.homeTeam,
      visitingTeam: value.visitingTeam,
      homeTeamScore: value.homeTeamScore ?? 0,
      visitingTeamScore: value.visitingTeamScore ?? 0,
      locationName: this.locationService.getLocationById(value.locationNumber)
        ?.locationName,
    };
    const isUpdate = this.isEditing;
    if (isUpdate) {
      const id = (payload as any).schedulePlayoffId as number | undefined;
      if (!id) {
        console.error(
          'Update requested but primary key (schedulePlayoffId) is missing.',
          payload
        );
        this.snack.open('Cannot update: missing primary key.', 'Dismiss', {
          duration: 4000,
        });
        this.isSaving = false;
        return;
      }
      this.playoffService.update(payload).subscribe({
        next: () => {
          this.playoffService.fetchSeasonPlayoffGames();
          this.snack.open('Playoff game updated', undefined, {
            duration: 2500,
          });
          this.isSaving = false;
          // Reset form to clear dirty state
          this.form.markAsPristine();
          this.router.navigate(['./admin/games/list-playoff']);
        },
        error: (err: unknown) => {
          console.error('Failed to update playoff game', err);
          this.snack.open('Failed to update playoff game', 'Dismiss', {
            duration: 4000,
          });
          this.isSaving = false;
        },
      });
    } else {
      // Create: require a valid schedule number; GameNumber 0 allows server to assign next
      if (!payload.scheduleNumber || payload.scheduleNumber === 0) {
        this.snack.open('Cannot create: missing schedule number.', 'Dismiss', {
          duration: 3500,
        });
        this.isSaving = false;
        return;
      }
      this.playoffService.create(payload).subscribe({
        next: () => {
          this.playoffService.fetchSeasonPlayoffGames();
          this.snack.open('Playoff game created', undefined, {
            duration: 2500,
          });
          this.isSaving = false;
          // Reset form to clear dirty state
          this.form.markAsPristine();
          this.router.navigate(['./admin/games/list-playoff']);
        },
        error: (err: unknown) => {
          console.error('Failed to create playoff game', err);
          this.snack.open('Failed to create playoff game', 'Dismiss', {
            duration: 4000,
          });
          this.isSaving = false;
        },
      });
    }
  }

  // For PendingChangesGuard
  isFormDirty(): boolean {
    return this.form?.dirty ?? false;
  }
}
