import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

import { SeasonService } from '@app/services/season.service';
import { LocationService } from '@app/services/location.service';
import { GameService } from '@app/services/game.service';
import { Constants } from '@app/shared/constants';
import { Division } from '@app/domain/division';
import { Season } from '@app/domain/season';
import {
  AvailableTimeSlot,
  ScheduleBlackoutDate,
  ScheduleGamePreviewItem,
  ScheduleGeneratorRequest,
} from '@app/domain/schedule-generator.model';

interface TimeSlotRow {
  dayOfWeek: number;
  startTime: string;
  locationId: number | null;
}

interface BlackoutDateRow {
  date: string;
  locationId: number | null;
}

const DEFAULT_TIME_SLOTS: TimeSlotRow[] = [
  { dayOfWeek: 1, startTime: '18:00', locationId: null },
  { dayOfWeek: 1, startTime: '18:50', locationId: null },
  { dayOfWeek: 1, startTime: '19:40', locationId: null },
  { dayOfWeek: 1, startTime: '20:30', locationId: null },
  { dayOfWeek: 2, startTime: '18:00', locationId: null },
  { dayOfWeek: 2, startTime: '18:50', locationId: null },
  { dayOfWeek: 2, startTime: '19:40', locationId: null },
  { dayOfWeek: 2, startTime: '20:30', locationId: null },
  { dayOfWeek: 3, startTime: '18:00', locationId: null },
  { dayOfWeek: 3, startTime: '18:50', locationId: null },
  { dayOfWeek: 3, startTime: '19:40', locationId: null },
  { dayOfWeek: 3, startTime: '20:30', locationId: null },
  { dayOfWeek: 4, startTime: '18:00', locationId: null },
  { dayOfWeek: 4, startTime: '18:50', locationId: null },
  { dayOfWeek: 4, startTime: '19:40', locationId: null },
  { dayOfWeek: 4, startTime: '20:30', locationId: null },
  { dayOfWeek: 6, startTime: '09:00', locationId: null },
  { dayOfWeek: 6, startTime: '09:50', locationId: null },
  { dayOfWeek: 6, startTime: '10:40', locationId: null },
  { dayOfWeek: 6, startTime: '11:30', locationId: null },
  { dayOfWeek: 0, startTime: '09:00', locationId: null },
  { dayOfWeek: 0, startTime: '09:50', locationId: null },
  { dayOfWeek: 0, startTime: '10:40', locationId: null },
  { dayOfWeek: 0, startTime: '11:30', locationId: null },
];

@Component({
  selector: 'app-admin-schedule-generator',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin-schedule-generator.html',
  styleUrls: [
    '../../shared/scss/forms.scss',
    '../../shared/scss/cards.scss',
    '../admin.scss',
  ],
})
export class AdminScheduleGenerator implements OnInit {
  private http = inject(HttpClient);
  private seasonService = inject(SeasonService);
  private locationService = inject(LocationService);
  private gameService = inject(GameService);
  private snackBar = inject(MatSnackBar);

  // ----- season / parameter state -----
  seasons = computed(() => this.seasonService.seasons);
  selectedSeasonId = signal<number | null>(null);
  startDate = signal<Date | null>(null);
  endDate = signal<Date | null>(null);
  gamesPerTeam = signal<number>(10);
  maxGamesPerWeek = signal<number>(2);
  gameDurationMinutes = signal<number>(50);
  enforceCoachConflicts = signal<boolean>(true);

  // ----- divisions -----
  divisionsForSeason = signal<Division[]>([]);
  selectedDivisionIds = signal<number[]>([]);
  isLoadingDivisions = signal<boolean>(false);

  // ----- time slots -----
  timeSlots = signal<TimeSlotRow[]>([...DEFAULT_TIME_SLOTS]);

  // ----- blackout dates -----
  blackoutDates = signal<BlackoutDateRow[]>([]);

  // ----- preview / commit -----
  isGenerating = signal<boolean>(false);
  previewGames = signal<ScheduleGamePreviewItem[]>([]);
  previewError = signal<string | null>(null);
  isCommitting = signal<boolean>(false);
  commitGamesCreated = signal<number | null>(null);
  commitErrors = signal<string[]>([]);

  // ----- derived -----
  locations = computed(() => this.locationService.locations());
  previewByDivision = computed(() => {
    const games = this.previewGames();
    const map = new Map<string, ScheduleGamePreviewItem[]>();
    for (const g of games) {
      const key = g.divisionName;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(g);
    }
    return Array.from(map.entries()).map(([name, items]) => ({ name, items }));
  });
  warningCount = computed(() =>
    this.previewGames().reduce((n, g) => n + g.warnings.length, 0),
  );

  readonly dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  readonly dayOptions = [0, 1, 2, 3, 4, 5, 6];
  readonly previewColumns = ['gameDate', 'gameTime', 'location', 'home', 'visiting', 'warnings'];

  ngOnInit() {
    if (!this.locationService.locations().length) {
      this.locationService.fetchLocations();
    }
    this.loadSeasons();
  }

  private loadSeasons() {
    if (this.seasonService.seasons.length === 0) {
      this.seasonService.seasons$.subscribe((seasons) => {
        this.seasonService.updateSeasons(seasons);
      });
    }
  }

  onSeasonChange(seasonId: number) {
    this.selectedSeasonId.set(seasonId);
    const season = this.seasons().find((s) => s.seasonId === seasonId);
    if (season) {
      this.startDate.set(season.fromDate ? new Date(season.fromDate) : null);
      this.endDate.set(season.toDate ? new Date(season.toDate) : null);
    }
    this.loadDivisionsForSeason(seasonId);
    this.selectedDivisionIds.set([]);
  }

  private loadDivisionsForSeason(seasonId: number) {
    this.isLoadingDivisions.set(true);
    this.divisionsForSeason.set([]);
    this.http
      .get<Division[]>(`${Constants.SEASON_DIVISIONS_URL}${seasonId}`, { withCredentials: true })
      .subscribe({
        next: (divs) => {
          this.divisionsForSeason.set(divs);
          this.isLoadingDivisions.set(false);
        },
        error: () => {
          this.isLoadingDivisions.set(false);
          this.snackBar.open('Failed to load divisions.', 'Close', { duration: 4000 });
        },
      });
  }

  toggleDivision(divisionId: number) {
    this.selectedDivisionIds.update((ids) =>
      ids.includes(divisionId) ? ids.filter((id) => id !== divisionId) : [...ids, divisionId],
    );
  }

  isDivisionSelected(divisionId: number) {
    return this.selectedDivisionIds().includes(divisionId);
  }

  // ----- time slot management -----
  addTimeSlot() {
    this.timeSlots.update((rows) => [
      ...rows,
      { dayOfWeek: 1, startTime: '18:00', locationId: null },
    ]);
  }

  removeTimeSlot(index: number) {
    this.timeSlots.update((rows) => rows.filter((_, i) => i !== index));
  }

  updateTimeSlotDay(index: number, day: number) {
    this.timeSlots.update((rows) => {
      const copy = [...rows];
      copy[index] = { ...copy[index], dayOfWeek: day };
      return copy;
    });
  }

  updateTimeSlotTime(index: number, time: string) {
    this.timeSlots.update((rows) => {
      const copy = [...rows];
      copy[index] = { ...copy[index], startTime: time };
      return copy;
    });
  }

  updateTimeSlotLocation(index: number, locationId: number | null) {
    this.timeSlots.update((rows) => {
      const copy = [...rows];
      copy[index] = { ...copy[index], locationId };
      return copy;
    });
  }

  resetToDefaultSlots() {
    this.timeSlots.set([...DEFAULT_TIME_SLOTS]);
  }

  // ----- blackout date management -----
  addBlackoutDate() {
    this.blackoutDates.update((rows) => [
      ...rows,
      { date: '', locationId: null },
    ]);
  }

  removeBlackoutDate(index: number) {
    this.blackoutDates.update((rows) => rows.filter((_, i) => i !== index));
  }

  updateBlackoutDate(index: number, date: Date | null) {
    if (!date) return;
    const iso = date.toISOString().split('T')[0];
    this.blackoutDates.update((rows) => {
      const copy = [...rows];
      copy[index] = { ...copy[index], date: iso };
      return copy;
    });
  }

  updateBlackoutLocation(index: number, locationId: number | null) {
    this.blackoutDates.update((rows) => {
      const copy = [...rows];
      copy[index] = { ...copy[index], locationId };
      return copy;
    });
  }

  // ----- validation helpers -----
  step1Valid() {
    return (
      this.selectedSeasonId() != null &&
      this.startDate() != null &&
      this.endDate() != null &&
      this.gamesPerTeam() > 0 &&
      this.maxGamesPerWeek() > 0 &&
      this.gameDurationMinutes() > 0
    );
  }

  step2Valid() {
    return this.selectedDivisionIds().length > 0;
  }

  step3Valid() {
    return this.timeSlots().length > 0;
  }

  // ----- generate preview -----
  generatePreview() {
    if (!this.step1Valid() || !this.step2Valid()) return;

    this.isGenerating.set(true);
    this.previewGames.set([]);
    this.previewError.set(null);
    this.commitGamesCreated.set(null);
    this.commitErrors.set([]);

    const request: ScheduleGeneratorRequest = {
      seasonId: this.selectedSeasonId()!,
      startDate: this.startDate()?.toISOString() ?? null,
      endDate: this.endDate()?.toISOString() ?? null,
      divisionIds: this.selectedDivisionIds(),
      gamesPerTeam: this.gamesPerTeam(),
      maxGamesPerWeekPerTeam: this.maxGamesPerWeek(),
      gameDurationMinutes: this.gameDurationMinutes(),
      timeSlots: this.timeSlots().map(
        (r): AvailableTimeSlot => ({
          dayOfWeek: r.dayOfWeek,
          startTime: this.parseTimeToSpan(r.startTime),
          locationId: r.locationId,
        }),
      ),
      blackoutDates: this.blackoutDates()
        .filter((r) => !!r.date)
        .map(
          (r): ScheduleBlackoutDate => ({
            date: r.date,
            locationId: r.locationId,
          }),
        ),
      enforceCoachConflicts: this.enforceCoachConflicts(),
    };

    this.gameService.previewSchedule(request).subscribe({
      next: (result) => {
        this.isGenerating.set(false);
        if (result.success) {
          this.previewGames.set(result.games);
        } else {
          this.previewError.set(result.errorMessage ?? 'Preview failed.');
        }
      },
      error: () => {
        this.isGenerating.set(false);
        this.previewError.set('Failed to generate preview. Check console for details.');
      },
    });
  }

  // ----- commit -----
  commitSchedule() {
    const games = this.previewGames();
    if (games.length === 0) return;

    this.isCommitting.set(true);
    this.commitGamesCreated.set(null);
    this.commitErrors.set([]);

    this.gameService.commitSchedule({ seasonId: this.selectedSeasonId()!, games }).subscribe({
      next: (result) => {
        this.isCommitting.set(false);
        this.commitGamesCreated.set(result.gamesCreated);
        this.commitErrors.set(result.errors ?? []);
        if (result.gamesCreated > 0) {
          this.snackBar.open(
            `${result.gamesCreated} games saved successfully.`,
            'Close',
            { duration: 5000 },
          );
        }
      },
      error: () => {
        this.isCommitting.set(false);
        this.commitErrors.set(['Commit request failed.']);
      },
    });
  }

  private parseTimeToSpan(time: string): string {
    const [h, m] = time.split(':').map(Number);
    return `${String(h).padStart(2, '0')}:${String(m ?? 0).padStart(2, '0')}:00`;
  }

  formatGameDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  formatGameTime(timeStr: string): string {
    const parts = timeStr.split(' ');
    if (parts.length === 2) return timeStr;
    const d = new Date(`1899-12-30T${timeStr.substring(0, 8)}`);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
}
