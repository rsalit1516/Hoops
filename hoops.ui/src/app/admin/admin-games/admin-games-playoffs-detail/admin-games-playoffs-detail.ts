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
      gameDate: [null, [Validators.required]],
      gameTime: [null, [Validators.required]],
      descr: [''],
      homeTeam: ['', [Validators.required]],
      visitingTeam: ['', [Validators.required]],
      homeTeamScore: [null, [Validators.min(0)]],
      visitingTeamScore: [null, [Validators.min(0)]],
    });

    // Pre-populate if a record is selected
    const rec = this.selected();
    if (rec) {
      this.isEditing = true;
      this.form.patchValue({
        divisionId: rec.divisionId ?? divisionId,
        locationNumber: rec.locationNumber ?? null,
        gameDate: rec.gameDate
          ? new Date(rec.gameDate).toISOString().slice(0, 10)
          : null,
        gameTime: rec.gameTime
          ? new Date(rec.gameTime).toTimeString().slice(0, 5) /* HH:mm */
          : null,
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
      gameDate: string; // yyyy-MM-dd
      gameTime: string; // HH:mm
      descr?: string | null;
      homeTeam: string;
      visitingTeam: string;
      homeTeamScore?: number | null;
      visitingTeamScore?: number | null;
    };

    // Normalize date/time
    const gameDate = value.gameDate ? new Date(value.gameDate) : new Date();
    const gameTime = value.gameTime
      ? new Date(`${value.gameDate}T${value.gameTime}`)
      : undefined;
    const selected = this.selected();
    const payload: PlayoffGame & { schedulePlayoffId?: number } = {
      scheduleNumber: selected?.scheduleNumber ?? 0,
      gameNumber: selected?.gameNumber ?? 0,
      schedulePlayoffId: (selected as any)?.schedulePlayoffId,
      descr: value.descr ?? selected?.descr ?? '',
      divisionId: value.divisionId,
      gameId: 0,
      locationNumber: value.locationNumber,
      gameDate,
      gameTime,
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
      this.playoffService.create(payload).subscribe({
        next: () => {
          this.playoffService.fetchSeasonPlayoffGames();
          this.snack.open('Playoff game created', undefined, {
            duration: 2500,
          });
          this.isSaving = false;
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
}
