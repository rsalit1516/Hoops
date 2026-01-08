import {
  Component,
  computed,
  inject,
  effect,
  signal,
  untracked,
} from '@angular/core';
import { Field, form, max, min } from '@angular/forms/signals';

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
  gameDate: Date | null;
  gameTime: Date | null;
  location: GymLocation | null;
  visitorTeam: ScheduleTeam | null;
  homeTeam: ScheduleTeam | null;
  homeTeamScore: number;
  visitingTeamScore: number;
}

@Component({
  selector: 'admin-game-detail',
  imports: [
    Field,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './admin-game-detail.html',
  styleUrls: [
    '../../../shared/scss/cards.scss',
    '../../../shared/scss/forms.scss',
    '../../admin.scss',
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
    () => this.gameService.selectedRecordSignal() as RegularGame | undefined
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
    min(schema.visitingTeamScore, 0);
    max(schema.visitingTeamScore, 150);
    min(schema.homeTeamScore, 0);
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

    const initialDate = initial.gameDate?.toISOString() ?? null;
    const currentDate = current.gameDate?.toISOString() ?? null;

    const initialTime = initial.gameTime?.toISOString() ?? null;
    const currentTime = current.gameTime?.toISOString() ?? null;

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

  constructor() {
    effect(() => {
      this.#logger.debug(
        'Selected record signal',
        this.gameService.selectedRecordSignal()
      );
      this.scheduleGamesId =
        this.gameService.selectedRecordSignal()?.scheduleGamesId ?? 0;
    });
    effect(() => {
      this.#logger.debug('Division teams updated', this.divisionTeams());
    });
    // Load schedule-specific teams when selected record changes
    effect(() => {
      const selectedRecord = this.selectedRecord();
      const seasonId = selectedRecord?.seasonId ?? 0;
      const scheduleNumber =
        selectedRecord?.scheduleNumber ??
        untracked(() => this.gameService.divisionGames())?.[0]?.scheduleNumber ??
        0;
      if (scheduleNumber && seasonId) {
        this.loadScheduleTeams(scheduleNumber, seasonId);
      }
    });

    // Once scheduleTeams are loaded, patch the selected visitor/home values
    effect(() => {
      const teams = this.scheduleTeams();
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
        if (needVisitor || needHome) {
          this.gameForm.visitorTeam().value.set(visiting ?? null);
          this.gameForm.homeTeam().value.set(home ?? null);
          // Programmatic patch: reset dirty baseline
          this.initialSnapshot.set({ ...this.model() });
        }
      });
    });

    effect(() => {
      const record = this.selectedRecord();
      if (!record) return;

      const location = this.locationService.getLocationByName(
        (record.locationName as string) ?? ''
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
      }
    );
  }

  private findScheduleTeamByTeamNumber(
    teamNumber: number
  ): ScheduleTeam | undefined {
    return this.scheduleTeams().find((st) => st.teamNumber === teamNumber);
  }

  private getCurrentVisitingScheduleTeam(): ScheduleTeam | undefined {
    const currentGame = this.selectedRecord();
    if (!currentGame?.visitingTeamNumber) return undefined;
    // Schema: ScheduleGames.VisitingTeamNumber stores ScheduleDivTeams.TeamNumber
    // Match by teamNumber, not scheduleTeamNumber
    return this.scheduleTeams().find(
      (st) => st.teamNumber === currentGame.visitingTeamNumber
    );
  }

  private getCurrentHomeScheduleTeam(): ScheduleTeam | undefined {
    const currentGame = this.selectedRecord();
    if (!currentGame?.homeTeamNumber) return undefined;
    // Schema: ScheduleGames.HomeTeamNumber stores ScheduleDivTeams.TeamNumber
    // Match by teamNumber, not scheduleTeamNumber
    return this.scheduleTeams().find(
      (st) => st.teamNumber === currentGame.homeTeamNumber
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
    b: ScheduleTeam | null | undefined
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

  onSave() {
    const formValue = this.model();
    this.#logger.debug('Game edit form value', formValue);

    // Get team selections from form - now using ScheduleTeam
    const selectedVisitingTeam = formValue.visitorTeam;
    const selectedHomeTeam = formValue.homeTeam;

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

    if (this.scheduleGamesId === 0) {
      this.#logger.info('Creating new game');
      this.gameService.saveNewGame(saveObject);
    } else {
      this.#logger.info('Updating existing game');
      this.gameService.saveExistingGame(saveObject);
    }

    // Reset dirty baseline and navigate back
    this.initialSnapshot.set({ ...formValue });
    this.#router.navigate(['./admin/games/list']);
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
    teamNumbers?: { visitingTeamNumber: number; homeTeamNumber: number }
  ): RegularGameSaveObject {
    let game = new RegularGameSaveObject();
    game.scheduleGamesId = this.scheduleGamesId;
    game.scheduleNumber =
      this.selectedRecord()?.scheduleNumber ??
      this.gameService.divisionGames()?.[0]?.scheduleNumber ??
      0;
    game.gameNumber = this.selectedRecord()?.gameNumber ?? 0;
    game.locationNumber = gameEditForm.location?.locationNumber ?? 0;

    // Combine date and time into gameDate for future consolidation
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
        gameTime.getSeconds()
      );

      game.gameDate = combinedDateTime.toISOString();
    } else {
      game.gameDate = gameEditForm.gameDate
        ? new Date(gameEditForm.gameDate).toISOString()
        : '';
    }

    // Use full datetime format for gameTime to include both date and time
    // Format: '1899-12-30 HH:mm:ss' - backend expects this format
    if (gameEditForm.gameTime) {
      const gameTime =
        gameEditForm.gameTime instanceof Date
          ? gameEditForm.gameTime
          : new Date(gameEditForm.gameTime);

      game.gameTime = `1899-12-30 ${gameTime
        .getHours()
        .toString()
        .padStart(2, '0')}:${gameTime
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${gameTime
        .getSeconds()
        .toString()
        .padStart(2, '0')}`;
    } else {
      game.gameTime = '';
    }

    // Use properly mapped team numbers from ScheduleDivTeams lookup
    if (teamNumbers) {
      this.#logger.debug(
        'Using mapped team numbers from ScheduleDivTeams',
        teamNumbers
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
