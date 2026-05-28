import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';

import { SeasonService } from '@app/services/season.service';
import { LocationService } from '@app/services/location.service';
import { GameService } from '@app/services/game.service';
import { Constants } from '@app/shared/constants';
import { Division } from '@app/domain/division';
import {
  AvailableTimeSlot,
  GameEditDialogData,
  GameEditDialogResult,
  ScheduleBlackoutDate,
  ScheduleDraft,
  ScheduleGamePreviewItem,
  ScheduleGeneratorRequest,
} from '@app/domain/schedule-generator.model';
import { ScheduleGameEditDialogComponent } from './schedule-game-edit-dialog';

interface TimePeriodRow {
  id: number;
  divisionId: number;
  dayOfWeek: number;      // 0–6
  beginTime: string;      // "HH:MM" (HTML time input format)
  endTime: string;        // "HH:MM"
  locationIds: number[];  // locationNumber values
}

interface BlackoutDateRow {
  id: number;
  startDate: string;
  endDate: string;
  locationId: number | null;
}

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
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonToggleModule,
  ],
  templateUrl: './admin-schedule-generator.html',
  styleUrls: [
    '../../shared/scss/forms.scss',
    '../../shared/scss/cards.scss',
    '../admin.scss',
    './admin-schedule-generator.scss',
  ],
})
export class AdminScheduleGenerator implements OnInit {
  private http = inject(HttpClient);
  private seasonService = inject(SeasonService);
  private locationService = inject(LocationService);
  private gameService = inject(GameService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  private readonly sortRef = viewChild(MatSort);
  private readonly paginatorRef = viewChild<MatPaginator>('paginator');

  private nextSlotId = 1;
  private nextBlackoutId = 1;

  private static readonly STORAGE_KEY = 'schedule-generator-settings';
  private static readonly DRAFTS_KEY = 'schedule-generator-drafts';

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

  // ----- time periods (keyed by id, grouped by division in template) -----
  timePeriods = signal<TimePeriodRow[]>([]);
  copySourceIds = signal<Record<number, number | null>>({});

  // ----- blackout dates -----
  blackoutDates = signal<BlackoutDateRow[]>([]);

  // ----- preview / commit -----
  isGenerating = signal<boolean>(false);
  previewGames = signal<ScheduleGamePreviewItem[]>([]);
  previewError = signal<string | null>(null);
  isCommitting = signal<boolean>(false);
  commitGamesCreated = signal<number | null>(null);
  commitErrors = signal<string[]>([]);
  selectedPreviewDivisionName = signal<string>('');
  selectedPreviewTeamName = signal<string>('');

  // ----- draft save / restore -----
  savedDrafts = signal<ScheduleDraft[]>([]);
  previewDataSource = new MatTableDataSource<ScheduleGamePreviewItem>([]);

  // ----- derived -----
  locations = computed(() => this.locationService.locations());
  selectedDivisions = computed(() => {
    const ids = this.selectedDivisionIds();
    return this.divisionsForSeason().filter(d => ids.includes(d.divisionId));
  });
  previewDivisionNames = computed(() => {
    const names = new Set(this.previewGames().map(g => g.divisionName));
    return Array.from(names).sort();
  });
  previewTeamNames = computed(() => {
    const div = this.selectedPreviewDivisionName();
    const games = this.previewGames();
    const scoped = div ? games.filter(g => g.divisionName === div) : games;
    const names = new Set<string>();
    scoped.forEach(g => { names.add(g.homeTeamName); names.add(g.visitingTeamName); });
    return Array.from(names).sort();
  });
  warningCount = computed(() =>
    this.previewGames().reduce((n, g) => n + g.warnings.length, 0),
  );

  readonly dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  readonly dayOptions = [0, 1, 2, 3, 4, 5, 6];
  readonly previewColumns = ['gameDate', 'division', 'location', 'home', 'visiting', 'warnings', 'edit'];

  constructor() {
    effect(() => this.saveToStorage());
    effect(() => {
      const sort = this.sortRef();
      if (sort) {
        this.previewDataSource.sort = sort;
        this.previewDataSource.sortingDataAccessor = (item, col) => {
          if (col === 'gameDate') return item.gameDate;
          if (col === 'division') return item.divisionName;
          if (col === 'location') return item.locationName;
          if (col === 'home') return item.homeTeamName;
          if (col === 'visiting') return item.visitingTeamName;
          return '';
        };
      }
    });
    effect(() => {
      this.previewDataSource.paginator = this.paginatorRef() ?? null;
    });
    effect(() => {
      const div = this.selectedPreviewDivisionName();
      const team = this.selectedPreviewTeamName();
      let data = this.previewGames();
      if (div) data = data.filter(g => g.divisionName === div);
      if (team) data = data.filter(g => g.homeTeamName === team || g.visitingTeamName === team);
      this.previewDataSource.data = data;
    });
  }

  ngOnInit() {
    if (!this.locationService.locations().length) {
      this.locationService.fetchLocations();
    }
    this.loadSeasons();
    this.restoreFromStorage();
    try {
      const raw = localStorage.getItem(AdminScheduleGenerator.DRAFTS_KEY);
      if (raw) this.savedDrafts.set(JSON.parse(raw));
    } catch { /* ignore corrupt storage */ }
  }

  private saveToStorage() {
    const state = {
      selectedSeasonId: this.selectedSeasonId(),
      startDate: this.startDate()?.toISOString() ?? null,
      endDate: this.endDate()?.toISOString() ?? null,
      gamesPerTeam: this.gamesPerTeam(),
      maxGamesPerWeek: this.maxGamesPerWeek(),
      gameDurationMinutes: this.gameDurationMinutes(),
      enforceCoachConflicts: this.enforceCoachConflicts(),
      selectedDivisionIds: this.selectedDivisionIds(),
      timePeriods: this.timePeriods(),
      blackoutDates: this.blackoutDates(),
    };
    try {
      localStorage.setItem(AdminScheduleGenerator.STORAGE_KEY, JSON.stringify(state));
    } catch { /* ignore quota errors */ }
  }

  private restoreFromStorage() {
    try {
      const raw = localStorage.getItem(AdminScheduleGenerator.STORAGE_KEY);
      if (!raw) return;
      const state = JSON.parse(raw);
      if (state.selectedSeasonId != null) {
        this.selectedSeasonId.set(state.selectedSeasonId);
        this.loadDivisionsForSeason(state.selectedSeasonId);
      }
      if (state.startDate) this.startDate.set(new Date(state.startDate));
      if (state.endDate) this.endDate.set(new Date(state.endDate));
      if (state.gamesPerTeam != null) this.gamesPerTeam.set(state.gamesPerTeam);
      if (state.maxGamesPerWeek != null) this.maxGamesPerWeek.set(state.maxGamesPerWeek);
      if (state.gameDurationMinutes != null) this.gameDurationMinutes.set(state.gameDurationMinutes);
      if (state.enforceCoachConflicts != null) this.enforceCoachConflicts.set(state.enforceCoachConflicts);
      if (Array.isArray(state.selectedDivisionIds)) this.selectedDivisionIds.set(state.selectedDivisionIds);
      if (Array.isArray(state.timePeriods) && state.timePeriods.length > 0) {
        this.timePeriods.set(state.timePeriods);
        this.nextSlotId = Math.max(...state.timePeriods.map((p: TimePeriodRow) => p.id)) + 1;
      }
      if (Array.isArray(state.blackoutDates) && state.blackoutDates.length > 0) {
        this.blackoutDates.set(state.blackoutDates);
        this.nextBlackoutId = Math.max(...state.blackoutDates.map((b: BlackoutDateRow) => b.id)) + 1;
      }
    } catch { /* ignore corrupt storage */ }
  }

  clearSavedSettings() {
    localStorage.removeItem(AdminScheduleGenerator.STORAGE_KEY);
    this.selectedSeasonId.set(null);
    this.startDate.set(null);
    this.endDate.set(null);
    this.gamesPerTeam.set(10);
    this.maxGamesPerWeek.set(2);
    this.gameDurationMinutes.set(50);
    this.enforceCoachConflicts.set(true);
    this.selectedDivisionIds.set([]);
    this.divisionsForSeason.set([]);
    this.timePeriods.set([]);
    this.blackoutDates.set([]);
    this.previewGames.set([]);
    this.previewError.set(null);
    this.selectedPreviewDivisionName.set('');
    this.selectedPreviewTeamName.set('');
  }

  onDivisionFilterChange(val: string) {
    this.selectedPreviewDivisionName.set(val);
    this.selectedPreviewTeamName.set('');
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
    this.timePeriods.set([]);
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
    // drop periods for divisions that are no longer selected
    const selected = this.selectedDivisionIds();
    this.timePeriods.update(rows => rows.filter(p => selected.includes(p.divisionId)));
  }

  isDivisionSelected(divisionId: number) {
    return this.selectedDivisionIds().includes(divisionId);
  }

  // ----- time period management -----
  periodsForDivision(divisionId: number): TimePeriodRow[] {
    return this.timePeriods().filter(p => p.divisionId === divisionId);
  }

  addTimePeriodForDivision(divisionId: number) {
    this.timePeriods.update(rows => [...rows, {
      id: this.nextSlotId++, divisionId,
      dayOfWeek: 6, beginTime: '09:00', endTime: '13:00', locationIds: [],
    }]);
  }

  removeTimePeriod(id: number) {
    this.timePeriods.update(rows => rows.filter(p => p.id !== id));
  }

  updatePeriodDay(id: number, day: number) {
    this.timePeriods.update(rows => rows.map(p => p.id === id ? { ...p, dayOfWeek: day } : p));
  }

  updatePeriodBeginTime(id: number, time: string) {
    this.timePeriods.update(rows => rows.map(p => p.id === id ? { ...p, beginTime: time } : p));
  }

  updatePeriodEndTime(id: number, time: string) {
    this.timePeriods.update(rows => rows.map(p => p.id === id ? { ...p, endTime: time } : p));
  }

  updatePeriodLocations(id: number, locationIds: number[]) {
    this.timePeriods.update(rows => rows.map(p => p.id === id ? { ...p, locationIds } : p));
  }

  divisionsWithPeriods(excludeId: number): Division[] {
    const configured = new Set(this.timePeriods().map(p => p.divisionId));
    return this.selectedDivisions().filter(
      d => d.divisionId !== excludeId && configured.has(d.divisionId)
    );
  }

  copyFromDivision(sourceDivisionId: number, targetDivisionId: number) {
    if (sourceDivisionId === targetDivisionId) return;
    this.timePeriods.update(rows => rows.filter(p => p.divisionId !== targetDivisionId));
    const cloned = this.timePeriods()
      .filter(p => p.divisionId === sourceDivisionId)
      .map(p => ({ ...p, id: this.nextSlotId++, divisionId: targetDivisionId }));
    this.timePeriods.update(rows => [...rows, ...cloned]);
    this.copySourceIds.update(m => ({ ...m, [targetDivisionId]: null }));
  }

  periodWindowTooShort(period: TimePeriodRow): boolean {
    if (!period.beginTime || !period.endTime) return false;
    return (this.timeToMinutes(period.endTime) - this.timeToMinutes(period.beginTime))
      < this.gameDurationMinutes();
  }

  slotSummaryForPeriod(period: TimePeriodRow): string[] {
    if (!period.beginTime || !period.endTime || period.locationIds.length === 0) return [];
    const slots: string[] = [];
    const duration = this.gameDurationMinutes();
    let t = this.timeToMinutes(period.beginTime);
    const end = this.timeToMinutes(period.endTime);
    while (t + duration <= end) {
      const d = new Date(1970, 0, 1, Math.floor(t / 60), t % 60);
      slots.push(d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
      t += duration;
    }
    return slots;
  }

  // ----- blackout date management -----
  addBlackoutDate() {
    this.blackoutDates.update(rows => [
      ...rows,
      { id: this.nextBlackoutId++, startDate: '', endDate: '', locationId: null },
    ]);
  }

  removeBlackoutDate(id: number) {
    this.blackoutDates.update(rows => rows.filter(b => b.id !== id));
  }

  updateBlackoutStartDate(id: number, date: Date | null) {
    if (!date) return;
    const iso = new Date(date).toISOString().split('T')[0];
    this.blackoutDates.update(rows => rows.map(b => b.id === id ? { ...b, startDate: iso } : b));
  }

  updateBlackoutEndDate(id: number, date: Date | null) {
    if (!date) return;
    const iso = new Date(date).toISOString().split('T')[0];
    this.blackoutDates.update(rows => rows.map(b => b.id === id ? { ...b, endDate: iso } : b));
  }

  updateBlackoutLocation(id: number, locationId: number | null) {
    this.blackoutDates.update(rows => rows.map(b => b.id === id ? { ...b, locationId } : b));
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
    const ids = this.selectedDivisionIds();
    if (ids.length === 0) return false;
    return ids.every(id =>
      this.periodsForDivision(id).some(p =>
        p.locationIds.length > 0 && !this.periodWindowTooShort(p)
      )
    );
  }

  // ----- generate preview -----
  generatePreview() {
    if (!this.step1Valid() || !this.step2Valid()) return;

    this.isGenerating.set(true);
    this.previewGames.set([]);
    this.previewError.set(null);
    this.commitGamesCreated.set(null);
    this.commitErrors.set([]);
    this.selectedPreviewDivisionName.set('');
    this.selectedPreviewTeamName.set('');

    const request: ScheduleGeneratorRequest = {
      seasonId: this.selectedSeasonId()!,
      startDate: this.startDate() ? this.formatLocalDate(this.startDate()!) : null,
      endDate: this.endDate() ? this.formatLocalDate(this.endDate()!) : null,
      divisionIds: this.selectedDivisionIds(),
      gamesPerTeam: this.gamesPerTeam(),
      maxGamesPerWeekPerTeam: this.maxGamesPerWeek(),
      gameDurationMinutes: this.gameDurationMinutes(),
      timeSlots: this.timePeriods().flatMap((period): AvailableTimeSlot[] => {
        const slots: AvailableTimeSlot[] = [];
        const duration = this.gameDurationMinutes();
        let t = this.timeToMinutes(period.beginTime);
        const end = this.timeToMinutes(period.endTime);
        while (t + duration <= end) {
          for (const locId of period.locationIds) {
            slots.push({
              divisionId: period.divisionId,
              dayOfWeek: period.dayOfWeek,
              startTime: this.minutesToSpan(t),
              locationId: locId,
            });
          }
          t += duration;
        }
        return slots;
      }),
      blackoutDates: this.blackoutDates()
        .filter(r => !!r.startDate && !!r.endDate)
        .map((r): ScheduleBlackoutDate => ({
          startDate: r.startDate,
          endDate: r.endDate,
          locationId: r.locationId,
        })),
      enforceCoachConflicts: this.enforceCoachConflicts(),
    };

    this.gameService.previewSchedule(request).subscribe({
      next: (result) => {
        this.isGenerating.set(false);
        if (result.success) {
          this.previewGames.set(result.games);
          if (result.games.length > 0) {
            this.calendarMonth.set(new Date(result.games[0].gameDate));
            this.selectedCalendarDate.set(null);
          }
        } else {
          this.previewError.set(result.errorMessage ?? 'Preview failed.');
        }
      },
      error: (err) => {
        this.isGenerating.set(false);
        const msg = err?.error?.errorMessage ?? err?.message ?? 'Failed to generate preview.';
        this.previewError.set(msg);
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

  private formatLocalDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dy}`;
  }

  private timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + (m ?? 0);
  }

  private minutesToSpan(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
  }

  // ----- preview game editing -----
  private gameKey(g: ScheduleGamePreviewItem): string {
    return `${g.divisionId}_${g.gameNumber}`;
  }

  openEditDialog(g: ScheduleGamePreviewItem) {
    const ref = this.dialog.open(ScheduleGameEditDialogComponent, {
      data: {
        game: g,
        locations: this.locations().map(l => ({ locationNumber: l.locationNumber, locationName: l.locationName })),
      } as GameEditDialogData,
      width: '480px',
    });
    ref.afterClosed().subscribe((result: GameEditDialogResult | undefined) => {
      if (!result) return;
      const newGameDate = `${result.gameDate}T${result.gameTime}:00`;
      const newGameTime = `1899-12-30 ${result.gameTime}:00`;
      this.previewGames.update(games =>
        games.map(game => this.gameKey(game) === this.gameKey(g)
          ? { ...game, gameDate: newGameDate, gameTime: newGameTime, locationNumber: result.locationNumber }
          : game,
        ),
      );
    });
  }

  formatGameDate(dateStr: string): string {
    const d = new Date(dateStr);
    const date = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `${date} ${time}`;
  }

  formatGameTime(timeStr: string): string {
    // Legacy format: "1899-12-30 09:00:00" — extract just the time portion
    const timePart = timeStr.includes('T') ? timeStr.split('T')[1] : timeStr.split(' ')[1];
    if (!timePart) return timeStr;
    const d = new Date(`1970-01-01T${timePart.substring(0, 8)}`);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  // ----- draft management -----
  saveDraft() {
    const name = window.prompt('Draft name:')?.trim();
    if (!name) return;
    const draft: ScheduleDraft = {
      id: Date.now().toString(),
      name,
      savedAt: new Date().toISOString(),
      seasonId: this.selectedSeasonId()!,
      games: this.previewGames(),
    };
    this.savedDrafts.update(list => [...list, draft]);
    try {
      localStorage.setItem(AdminScheduleGenerator.DRAFTS_KEY, JSON.stringify(this.savedDrafts()));
    } catch { /* ignore quota errors */ }
    this.snackBar.open(`Draft "${name}" saved.`, 'Close', { duration: 3000 });
  }

  loadDraft(draft: ScheduleDraft) {
    this.previewGames.set(draft.games);
    if (draft.games.length > 0) {
      this.calendarMonth.set(new Date(draft.games[0].gameDate));
      this.selectedCalendarDate.set(null);
    }
    this.snackBar.open(`Loaded draft "${draft.name}".`, 'Close', { duration: 3000 });
  }

  deleteDraft(id: string) {
    this.savedDrafts.update(list => list.filter(d => d.id !== id));
    try {
      localStorage.setItem(AdminScheduleGenerator.DRAFTS_KEY, JSON.stringify(this.savedDrafts()));
    } catch { /* ignore quota errors */ }
  }

  // ----- calendar view -----
  previewViewMode = signal<'table' | 'calendar'>('table');
  calendarMonth = signal<Date>(new Date());
  selectedCalendarDate = signal<string | null>(null);

  gamesByDate = computed(() => {
    const map = new Map<string, ScheduleGamePreviewItem[]>();
    for (const g of this.previewGames()) {
      const key = g.gameDate.substring(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(g);
    }
    return map;
  });

  calendarDays = computed(() => {
    const m = this.calendarMonth();
    const year = m.getFullYear();
    const month = m.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: ({ d: number; dateKey: string } | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ d, dateKey });
    }
    return cells;
  });

  selectedDateGames = computed(() => {
    const key = this.selectedCalendarDate();
    return key ? (this.gamesByDate().get(key) ?? []) : [];
  });

  calendarMonthLabel = computed(() =>
    this.calendarMonth().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  );

  prevMonth() {
    this.calendarMonth.update(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth() {
    this.calendarMonth.update(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  selectCalendarDate(key: string) {
    this.selectedCalendarDate.set(this.selectedCalendarDate() === key ? null : key);
  }
}
