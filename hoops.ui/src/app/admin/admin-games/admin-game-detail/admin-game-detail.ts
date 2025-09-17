import {
  Component,
  OnInit,
  computed,
  inject,
  effect,
  signal,
} from '@angular/core';
import {
  UntypedFormControl,
  ReactiveFormsModule,
  FormControl,
  FormsModule,
  FormBuilder,
} from '@angular/forms';
import { Team } from '@app/domain/team';
import { CommonModule } from '@angular/common';
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
import { forkJoin, of } from 'rxjs';
import { LoggerService } from '@app/services/logger.service';

// Type for schedule-specific teams from the API
export interface ScheduleTeam {
  scheduleTeamNumber: number;
  teamNumber: number;
  displayName: string;
}

@Component({
  selector: 'admin-game-detail',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
export class AdminGameDetail implements OnInit {
  readonly #divisionService = inject(DivisionService);
  readonly #teamService = inject(TeamService);
  readonly locationService = inject(LocationService);
  readonly #router = inject(Router);
  readonly gameService = inject(GameService);
  readonly #logger = inject(LoggerService);
  selectedRecord = computed(
    () => this.gameService.selectedRecordSignal() as RegularGame | undefined
  );
  fb = inject(FormBuilder);
  gameEditForm = this.fb.group({
    gameDate: new FormControl<Date | null>(null, { nonNullable: false }),
    gameTime: new FormControl<Date | null>(null, { nonNullable: true }),
    location: new FormControl<GymLocation | undefined>(undefined, {
      nonNullable: false,
    }),
    visitorTeam: new FormControl<ScheduleTeam | undefined>(undefined, {
      nonNullable: true,
    }),
    homeTeam: new FormControl<ScheduleTeam | undefined>(undefined, {
      nonNullable: true,
    }),
    homeTeamScore: new FormControl<number>(0, { nonNullable: true }),
    visitingTeamScore: new FormControl<number>(0, { nonNullable: true }),
    //    scheduleGamesId: new FormControl<number | undefined>(undefined, { nonNullable: true }),
  });

  visitorTeam!: Team | undefined;
  homeTeam: Team | undefined;
  // divisionTeams$: Observable<Team[]>;
  // locations$!: Observable<Location[]>;
  visitorComponent: UntypedFormControl | null | undefined;
  gameTimeFormatted: string | undefined;
  // gameTime: string | undefined;
  gameTime2: Date = new Date();
  pickerA: any;
  location: GymLocation | undefined;
  visitingTeam: Team | undefined;
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

  // console.log(time);
  // this.gameTime = time;new Date(this.selectedRecord()?.gameTime ?? ''));
  //     gameTime.toLocaleTimeString([], {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //     }) ?? '';
  // console.log(time);
  // this.gameTime = time;

  divisionTeams = this.#teamService.divisionTeams;
  scheduleTeams = signal<ScheduleTeam[]>([]);
  locations = this.locationService.locations();
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
    effect(() => {
      //this.locations.set(this.locationService.locations());
      this.locations = this.locationService.locations();
    });
    // Load schedule-specific teams when selected record changes
    effect(() => {
      const selectedRecord = this.selectedRecord();
      if (selectedRecord?.scheduleNumber && selectedRecord?.seasonId) {
        this.loadScheduleTeams(
          selectedRecord.scheduleNumber,
          selectedRecord.seasonId
        );
      }
    });

    // Once scheduleTeams are loaded, patch the selected visitor/home values
    effect(() => {
      const teams = this.scheduleTeams();
      if (!teams || teams.length === 0) return;
      const visiting = this.getCurrentVisitingScheduleTeam();
      const home = this.getCurrentHomeScheduleTeam();
      // Only set if the control isn't already set to a matching value
      const currentVisitor = this.gameEditForm.controls.visitorTeam.value;
      const currentHome = this.gameEditForm.controls.homeTeam.value;
      const needVisitor =
        !currentVisitor ||
        !teams.some((t) => this.scheduleTeamCompare(t, currentVisitor));
      const needHome =
        !currentHome ||
        !teams.some((t) => this.scheduleTeamCompare(t, currentHome));
      if (needVisitor || needHome) {
        this.gameEditForm.patchValue({
          visitorTeam: visiting,
          homeTeam: home,
        });
        // Mark pristine so Save button reflects actual user edits only
        this.gameEditForm.markAsPristine();
      }
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

  ngOnInit(): void {
    this.visitorComponent = this.gameEditForm.get('visitorTeam') as FormControl;

    this.location = this.locationService.getLocationByName(
      (this.selectedRecord()?.locationName as string) ?? ''
    ) as GymLocation;

    // Initialize non-team fields immediately
    this.gameEditForm.patchValue({
      gameDate: this.selectedRecord()?.gameDate as Date,
      gameTime: this.selectedRecord()!.gameTime,
      location: this.location!,
      homeTeamScore: this.selectedRecord()?.homeTeamScore ?? 0,
      visitingTeamScore: this.selectedRecord()?.visitingTeamScore ?? 0,
    });
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
    if (!this.gameEditForm.valid) {
      this.#logger.error('Form is invalid');
      return;
    }

    this.#logger.debug('Game edit form value', this.gameEditForm.value);

    // Get team selections from form - now using ScheduleTeam
    const selectedVisitingTeam = this.gameEditForm.value
      .visitorTeam as ScheduleTeam;
    const selectedHomeTeam = this.gameEditForm.value.homeTeam as ScheduleTeam;
    const scheduleNumber = this.selectedRecord()?.scheduleNumber ?? 0;
    const seasonId = this.selectedRecord()?.seasonId ?? 0;

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
    const saveObject = this.converttoSaveFormat(this.gameEditForm.value, {
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

    // Reset form state and navigate back
    this.gameEditForm.markAsPristine();
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
    gameEditForm: typeof this.gameEditForm.value,
    teamNumbers?: { visitingTeamNumber: number; homeTeamNumber: number }
  ): RegularGameSaveObject {
    let game = new RegularGameSaveObject();
    game.scheduleGamesId = this.scheduleGamesId;
    game.scheduleNumber = this.selectedRecord()?.scheduleNumber ?? 0;
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
    return this.gameEditForm?.dirty ?? false;
  }
}
