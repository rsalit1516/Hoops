import {
  Component,
  computed,
  inject,
  effect,
  signal,
  untracked,
} from '@angular/core';
import { form, FormField, max, min } from '@angular/forms/signals';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { LocationService } from '@app/services/location.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegularGame } from '@app/domain/regularGame';
import { DivisionService } from '@app/services/division.service';
import { TeamService } from '@app/services/team.service';
import { MatTimepickerModule } from '@angular/material/timepicker';

import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { GameService } from '@app/services/game.service';
import { Location as GymLocation } from '@app/domain/location';
import { RegularGameSaveObject } from '@app/domain/RegularGameSaveObject';
import { LoggerService } from '@app/services/logger.service';

// Type for schedule-specific teams from the API
export interface ScheduleTeam {
  scheduleTeamNumber: number;
  teamNumber: number;
  displayName: string;
}

interface AdminGameEditModel {
  gameDate: Date | string | null;
  gameTime: Date | string | null;
  location: GymLocation | null;
  visitorTeam: ScheduleTeam | null;
  homeTeam: ScheduleTeam | null;
  homeTeamScore: number;
  visitingTeamScore: number;
}

@Component({
  selector: 'admin-game-detail',
  standalone: true,
  imports: [
    FormField,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './admin-game-detail.html',
  styleUrls: [
    '../../admin.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ],
  providers: [provideNativeDateAdapter()],
})
export class AdminGameDetail {
  readonly #divisionService = inject(DivisionService);
  readonly #teamService = inject(TeamService);
  readonly locationService = inject(LocationService);
  readonly #router = inject(Router);
  readonly gameService = inject(GameService);
  readonly #logger = inject(LoggerService);
  selectedRecord = computed(
    () => this.gameService.selectedRecordSignal() as RegularGame | undefined,
  );

  readonly model = signal<AdminGameEditModel>({
    gameDate: null,
    gameTime: null,
    location: null,
    visitorTeam: null,
    homeTeam: null,
    homeTeamScore: 0,
    visitingTeamScore: 0,
  });
  readonly gameForm = form(this.model, (schema) => {
    min(schema.visitingTeamScore, -1);
    max(schema.visitingTeamScore, 150);
    min(schema.homeTeamScore, -1);
    max(schema.homeTeamScore, 150);
  });
  private readonly initialSnapshot = signal<AdminGameEditModel | null>(null);

  gameTimeFormatted: string | undefined;
  // gameTime: string | undefined;
  gameTime2: Date = new Date();
  pickerA: any;
  location: GymLocation | undefined;
  getTime(value: Date | undefined) {
    // this.gameTime = time;new Date(this.selectedRecord()?.gameTime ?? ''));
    if (value === undefined) {
      return '';
    } else {
      return (
        value.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }) ?? ''
      );
    }
  }
  scheduleGamesId = this.selectedRecord()?.scheduleGamesId ?? 0;
  gameTime = computed(() => this.getTime(this.selectedRecord()?.gameTime));
  divisionTeams = this.#teamService.divisionTeams;
  scheduleTeams = signal<ScheduleTeam[]>([]);
  locations = this.locationService.locations;

  readonly isDirty = computed(() => {
    const initial = this.initialSnapshot();
    if (!initial) return false;
    const current = this.model();

    const toISO = (val: Date | string | null | undefined): string | null =>
      val ? new Date(val).toISOString() : null;

    const initialDate = toISO(initial.gameDate);
    const currentDate = toISO(current.gameDate);

    const initialTime = toISO(initial.gameTime);
    const currentTime = toISO(current.gameTime);

    const initialLocationNumber = initial.location?.locationNumber ?? null;
    const currentLocationNumber = current.location?.locationNumber ?? null;

    const initialVisitorTeamNumber = initial.visitorTeam?.teamNumber ?? null;
    const currentVisitorTeamNumber = current.visitorTeam?.teamNumber ?? null;

    const initialHomeTeamNumber = initial.homeTeam?.teamNumber ?? null;
    const currentHomeTeamNumber = current.homeTeam?.teamNumber ?? null;

    return (
      initialDate !== currentDate ||
      initialTime !== currentTime ||
      initialLocationNumber !== currentLocationNumber ||
      initialVisitorTeamNumber !== currentVisitorTeamNumber ||
      initialHomeTeamNumber !== currentHomeTeamNumber ||
      initial.homeTeamScore !== current.homeTeamScore ||
      initial.visitingTeamScore !== current.visitingTeamScore
    );
  });

  readonly isValid = computed(() => {
    // Scoped to validators we’ve defined in the signal form schema.
    return (
      this.gameForm.visitingTeamScore().valid() &&
      this.gameForm.homeTeamScore().valid()
    );
  });

  readonly canSave = computed(() => this.isDirty() && this.isValid());

  private detailEffectCounter = {
    selectedRecord: 0,
    divisionTeams: 0,
    scheduleTeams: 0,
    recordData: 0,
  };

  // Compare function for location mat-select to handle object identity across fetches
  locationCompare = (
    a: GymLocation | null | undefined,
    b: GymLocation | null | undefined,
  ) => {
    if (!a || !b) return a === b;
    return a.locationNumber === b.locationNumber;
  };

  constructor() {
    effect(() => {
      this.detailEffectCounter.selectedRecord++;
      this.#logger.debug(
        `[DETAIL-EFFECT-1] selectedRecord effect run #${this.detailEffectCounter.selectedRecord}`,
        this.gameService.selectedRecordSignal(),
      );
      this.scheduleGamesId =
        this.gameService.selectedRecordSignal()?.scheduleGamesId ?? 0;
    });
    effect(() => {
      this.detailEffectCounter.divisionTeams++;
      this.#logger.debug(
        `[DETAIL-EFFECT-2] divisionTeams effect run #${this.detailEffectCounter.divisionTeams}`,
        this.divisionTeams(),
      );
    });
    // Load schedule-specific teams when selected record changes
    effect(() => {
      this.detailEffectCounter.scheduleTeams++;
      this.#logger.debug(
        `[DETAIL-EFFECT-3] Load scheduleTeams effect run #${this.detailEffectCounter.scheduleTeams}`,
      );
      const selectedRecord = this.selectedRecord();
      const seasonId = selectedRecord?.seasonId ?? 0;
      const scheduleNumber =
        selectedRecord?.scheduleNumber ??
        untracked(() => this.gameService.divisionGames())?.[0]
          ?.scheduleNumber ??
        0;
      this.#logger.debug(
        `[DETAIL-EFFECT-3] scheduleNumber: ${scheduleNumber}, seasonId: ${seasonId}`,
      );
      if (scheduleNumber && seasonId) {
        this.loadScheduleTeams(scheduleNumber, seasonId);
      }
    });

    // Once scheduleTeams are loaded, patch the selected visitor/home values
    effect(() => {
      this.#logger.debug(`[DETAIL-EFFECT-4] Patch teams effect triggered`);
      const teams = this.scheduleTeams();
      this.#logger.debug(
        `[DETAIL-EFFECT-4] scheduleTeams count: ${teams?.length ?? 0}`,
      );
      if (!teams || teams.length === 0) return;

      // IMPORTANT: Use untracked to read form values and other data
      // to prevent tracking them and creating an infinite loop
      untracked(() => {
        const visiting = this.getCurrentVisitingScheduleTeam();
        const home = this.getCurrentHomeScheduleTeam();
        // Only set if the control isn't already set to a matching value
        const currentVisitor = this.gameForm.visitorTeam().value();
        const currentHome = this.gameForm.homeTeam().value();
        const needVisitor =
          !currentVisitor ||
          !teams.some((t) => this.scheduleTeamCompare(t, currentVisitor));
        const needHome =
          !currentHome ||
          !teams.some((t) => this.scheduleTeamCompare(t, currentHome));
        this.#logger.debug(
          `[DETAIL-EFFECT-4] needVisitor: ${needVisitor}, needHome: ${needHome}`,
        );
        if (needVisitor || needHome) {
          this.gameForm.visitorTeam().value.set(visiting ?? null);
          this.gameForm.homeTeam().value.set(home ?? null);
          // Programmatic patch: update only team fields in the snapshot so that
          // any edits the user already made to other fields (e.g. gameDate) are
          // not absorbed into the baseline. This fixes the prod race condition
          // where the HTTP response arrives after the user starts editing.
          const snap = this.initialSnapshot();
          if (snap) {
            this.initialSnapshot.set({
              ...snap,
              visitorTeam: visiting ?? null,
              homeTeam: home ?? null,
            });
          } else {
            this.initialSnapshot.set({ ...this.model() });
          }
        }
      });
    });

    effect(() => {
      this.detailEffectCounter.recordData++;
      this.#logger.debug(
        `[DETAIL-EFFECT-5] Populate form effect run #${this.detailEffectCounter.recordData}`,
      );
      const record = this.selectedRecord();
      if (!record) {
        this.#logger.debug('[DETAIL-EFFECT-5] No record, skipping');
        return;
      }

      // CRITICAL: Use untracked to prevent tracking form signals and initialSnapshot
      // Otherwise updating form values and calling captureInitialSnapshot creates an infinite loop
      untracked(() => {
        this.#logger.debug(
          '[DETAIL-EFFECT-5] Populating form with record data',
        );
        const location = this.locationService.getLocationByName(
          (record.locationName as string) ?? '',
        ) as GymLocation;

        this.gameForm.gameDate().value.set((record.gameDate as Date) ?? null);
        this.gameForm.gameTime().value.set((record.gameTime as Date) ?? null);
        this.gameForm.location().value.set(location ?? null);
        this.gameForm.homeTeamScore().value.set(record.homeTeamScore ?? 0);
        this.gameForm
          .visitingTeamScore()
          .value.set(record.visitingTeamScore ?? 0);

        this.captureInitialSnapshot();
      });
    });

    // Resolve location once locations are loaded.
    // Handles the race condition where locations hadn't arrived when DETAIL-EFFECT-5 first ran.
    // Guards against overriding a location the user has already chosen.
    effect(() => {
      const locations = this.locations(); // Tracked: re-runs when locations signal changes
      if (!locations?.length) return;

      untracked(() => {
        const currentLocation = this.gameForm.location().value();
        if (currentLocation !== null) return; // Already set — do not override

        const record = this.selectedRecord();
        if (!record?.locationName) return;

        const location = (this.locationService.getLocationByName(
          (record.locationName as string) ?? '',
        ) ?? null) as GymLocation | null;

        if (location) {
          this.#logger.debug(
            '[DETAIL-EFFECT-6] Late-resolving location after locations loaded',
            location,
          );
          this.gameForm.location().value.set(location);
          // Re-capture snapshot so the resolved location is the clean baseline
          const snap = this.initialSnapshot();
          if (snap?.location === null) {
            this.initialSnapshot.set({ ...this.model() });
          }
        }
      });
    });
  }

  private loadScheduleTeams(scheduleNumber: number, seasonId: number): void {
    this.#teamService.getValidScheduleTeams(scheduleNumber, seasonId).subscribe(
      (teams) => {
        this.scheduleTeams.set(teams);
        this.#logger.info('Loaded schedule teams', teams);
      },
      (error) => {
        this.#logger.error('Error loading schedule teams', error);
        this.scheduleTeams.set([]);
      },
    );
  }

  private findScheduleTeamByTeamNumber(
    teamNumber: number,
  ): ScheduleTeam | undefined {
    return this.scheduleTeams().find((st) => st.teamNumber === teamNumber);
  }

  private getCurrentVisitingScheduleTeam(): ScheduleTeam | undefined {
    const currentGame = this.selectedRecord();
    if (!currentGame?.visitingTeamNumber) return undefined;
    // Schema: ScheduleGames.VisitingTeamNumber stores ScheduleDivTeams.TeamNumber
    // Match by teamNumber, not scheduleTeamNumber
    return this.scheduleTeams().find(
      (st) => st.teamNumber === currentGame.visitingTeamNumber,
    );
  }

  private getCurrentHomeScheduleTeam(): ScheduleTeam | undefined {
    const currentGame = this.selectedRecord();
    if (!currentGame?.homeTeamNumber) return undefined;
    // Schema: ScheduleGames.HomeTeamNumber stores ScheduleDivTeams.TeamNumber
    // Match by teamNumber, not scheduleTeamNumber
    return this.scheduleTeams().find(
      (st) => st.teamNumber === currentGame.homeTeamNumber,
    );
  }

  private captureInitialSnapshot(): void {
    if (this.initialSnapshot()) return;
    // Capture only once per component instance; navigation recreates the component.
    this.initialSnapshot.set(untracked(() => ({ ...this.model() })));
  }

  // Compare function to make mat-select selection resilient across object instances
  scheduleTeamCompare = (
    a: ScheduleTeam | null | undefined,
    b: ScheduleTeam | null | undefined,
  ) => {
    if (!a || !b) return a === b;
    // Prefer comparison by teamNumber (the stored key in ScheduleGames)
    return a.teamNumber === b.teamNumber;
  };

  // trackBy for schedule teams to reduce churn
  trackScheduleTeamBy = (index: number, st: ScheduleTeam) =>
    st.scheduleTeamNumber;

  getTeam(teamId: number) {
    this.#logger.debug('Get team', teamId);
    // return this.divisionTeams.pipe(
    //   map((t) => t.find((s) => s.teamId === teamId))
    // );
  }

  // Helper to format a Date as local ISO string (without Z suffix)
  private formatLocalDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  onSave() {
    this.#logger.info('=== SAVE BUTTON CLICKED ===');
    const formValue = this.model();
    this.#logger.debug('Game edit form value', formValue);
    this.#logger.info('scheduleGamesId:', this.scheduleGamesId);

    // Get team selections from form - now using ScheduleTeam
    const selectedVisitingTeam = formValue.visitorTeam;
    const selectedHomeTeam = formValue.homeTeam;

    this.#logger.debug('Selected teams:', {
      visiting: selectedVisitingTeam,
      home: selectedHomeTeam,
    });

    // Per schema, ScheduleGames stores ScheduleDivTeams.TeamNumber
    // Use the selected ScheduleTeam.teamNumber when saving
    const visitingTeamNumber =
      selectedVisitingTeam?.teamNumber ??
      this.selectedRecord()?.visitingTeamNumber ??
      0;
    const homeTeamNumber =
      selectedHomeTeam?.teamNumber ??
      this.selectedRecord()?.homeTeamNumber ??
      0;

    this.#logger.info('Saving team numbers', {
      visitingTeamNumber,
      homeTeamNumber,
    });

    // Create save object with schedule team numbers
    const saveObject = this.converttoSaveFormat(formValue, {
      visitingTeamNumber,
      homeTeamNumber,
    });

    this.#logger.info('Save object created:', saveObject);

    // Subscribe to the save observable and navigate on success
    const save$ =
      this.scheduleGamesId === 0
        ? this.gameService.saveNewGame(saveObject)
        : this.gameService.saveExistingGame(saveObject);

    this.#logger.info('Subscribing to save observable...');

    save$.subscribe({
      next: (response) => {
        this.#logger.info('✅ Save SUCCESS - Response:', response);
        // Reset dirty baseline and navigate back
        this.initialSnapshot.set({ ...formValue });
        this.#logger.info('About to navigate to /admin/games/list');
        // Use absolute path to navigate correctly
        this.#router.navigate(['/admin/games/list']).then(
          (success) => this.#logger.info('Navigation result:', success),
          (error) => this.#logger.error('Navigation error:', error),
        );
      },
      error: (error) => {
        this.#logger.error('❌ Save ERROR:', error);
        this.#logger.error('Error details:', {
          message: error?.message,
          status: error?.status,
          statusText: error?.statusText,
          error: error?.error,
        });
      },
      complete: () => {
        this.#logger.info('Save observable completed');
      },
    });
  }

  /*

    gameDate = gameDate
    gameTime = gameTime

    homeTeam
    location
    visitorteam

    {
  "scheduleGamesId": 0,
  "scheduleNumber": 0,
  "gameNumber": 0,
  "locationNumber": 0,
  "gameDate": "2025-04-08T11:23:50.782Z",
  "gameTime": "string",
  "visitingTeamNumber": 0,
  "homeTeamNumber": 0,
  "visitingTeamScore": 0,
  "homeTeamScore": 0,
  "visitingForfeited": true,
  "homeForfeited": true,
  "seasonId": 0,
  "divisionId": 0
}

companyId: null
divisionDescription:"HS BOYS"
divisionId:4247
gameDate:"2025-04-15T20:30:00"
gameDescription:null
gameNumber:49
gameTime:"1899-12-30T20:30:00"
gameTimeString:"1899-12-30 20:30:00"
gameType:0
homeTeamId:8697
homeTeamName:"PINK (03)"
homeTeamNumber:51
homeTeamScore:0
homeTeamSeasonNumber:3
locationName:"Gym Middle"
scheduleNumber:17
seasonId:2218
visitingTeamId:8710
visitingTeamName:"KELLY GREEN (17)"
visitingTeamNumber:131
visitingTeamScore:0
visitingTeamSeasonNumber:17

    */
  converttoSaveFormat(
    gameEditForm: AdminGameEditModel,
    teamNumbers?: { visitingTeamNumber: number; homeTeamNumber: number },
  ): RegularGameSaveObject {
    let game = new RegularGameSaveObject();
    game.scheduleGamesId = this.scheduleGamesId;
    game.scheduleNumber =
      this.selectedRecord()?.scheduleNumber ??
      this.gameService.divisionGames()?.[0]?.scheduleNumber ??
      0;
    game.gameNumber = this.selectedRecord()?.gameNumber ?? 0;
    game.locationNumber = gameEditForm.location?.locationNumber ?? 0;

    // Combine date and time into gameDate - store as local time (not UTC)
    if (gameEditForm.gameDate && gameEditForm.gameTime) {
      const gameDate =
        gameEditForm.gameDate instanceof Date
          ? gameEditForm.gameDate
          : new Date(gameEditForm.gameDate);
      const gameTime =
        gameEditForm.gameTime instanceof Date
          ? gameEditForm.gameTime
          : new Date(gameEditForm.gameTime);

      // Combine date from gameDate with time from gameTime
      const combinedDateTime = new Date(
        gameDate.getFullYear(),
        gameDate.getMonth(),
        gameDate.getDate(),
        gameTime.getHours(),
        gameTime.getMinutes(),
        gameTime.getSeconds(),
      );

      // Format as local time ISO string (without Z suffix to avoid UTC conversion)
      const year = combinedDateTime.getFullYear();
      const month = (combinedDateTime.getMonth() + 1)
        .toString()
        .padStart(2, '0');
      const day = combinedDateTime.getDate().toString().padStart(2, '0');
      const hours = combinedDateTime.getHours().toString().padStart(2, '0');
      const minutes = combinedDateTime.getMinutes().toString().padStart(2, '0');
      const seconds = combinedDateTime.getSeconds().toString().padStart(2, '0');

      game.gameDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    } else {
      game.gameDate = gameEditForm.gameDate
        ? this.formatLocalDateTime(new Date(gameEditForm.gameDate))
        : '';
    }

    // Sync gameTime with gameDate to keep both fields in sync
    // Both fields should store the same date+time in local time (not UTC)
    // Format: 'YYYY-MM-DD HH:mm:ss' using local time components
    if (gameEditForm.gameDate && gameEditForm.gameTime) {
      const gameDate =
        gameEditForm.gameDate instanceof Date
          ? gameEditForm.gameDate
          : new Date(gameEditForm.gameDate);
      const gameTime =
        gameEditForm.gameTime instanceof Date
          ? gameEditForm.gameTime
          : new Date(gameEditForm.gameTime);

      // Combine date from gameDate with time from gameTime
      const combinedDateTime = new Date(
        gameDate.getFullYear(),
        gameDate.getMonth(),
        gameDate.getDate(),
        gameTime.getHours(),
        gameTime.getMinutes(),
        gameTime.getSeconds(),
      );

      // Format as "YYYY-MM-DD HH:mm:ss" using local time components
      const year = combinedDateTime.getFullYear();
      const month = (combinedDateTime.getMonth() + 1)
        .toString()
        .padStart(2, '0');
      const day = combinedDateTime.getDate().toString().padStart(2, '0');
      const hours = combinedDateTime.getHours().toString().padStart(2, '0');
      const minutes = combinedDateTime.getMinutes().toString().padStart(2, '0');
      const seconds = combinedDateTime.getSeconds().toString().padStart(2, '0');

      game.gameTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } else {
      game.gameTime = '';
    }

    // Use properly mapped team numbers from ScheduleDivTeams lookup
    if (teamNumbers) {
      this.#logger.debug(
        'Using mapped team numbers from ScheduleDivTeams',
        teamNumbers,
      );
      game.visitingTeamNumber = teamNumbers.visitingTeamNumber;
      game.homeTeamNumber = teamNumbers.homeTeamNumber;
    } else {
      // Fallback to original team numbers if mapping failed
      this.#logger.warn('Fallback: Using original team numbers');
      game.visitingTeamNumber = this.selectedRecord()?.visitingTeamNumber ?? 0;
      game.homeTeamNumber = this.selectedRecord()?.homeTeamNumber ?? 0;
    }
    game.visitingTeamScore = gameEditForm.visitingTeamScore ?? 0;
    game.homeTeamScore = gameEditForm.homeTeamScore ?? 0;
    game.visitingForfeited = false;
    game.homeForfeited = false;
    game.seasonId = this.selectedRecord()?.seasonId ?? 0;
    game.divisionId = this.selectedRecord()?.divisionId ?? 0;

    return game;
  }
  cancel() {
    this.#logger.info('Cancel edit');
    this.#router.navigate(['./admin/games/list']);
    // this.gameEditForm.reset();
  }

  // For PendingChangesGuard
  isFormDirty(): boolean {
    return this.isDirty();
  }
}
