import { Component, OnInit, computed, inject, effect } from '@angular/core';
import { UntypedFormControl, ReactiveFormsModule, FormControl, FormsModule, FormBuilder } from '@angular/forms';
import { Team } from '@app/domain/team';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
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
    MatIconModule
  ],
  templateUrl: './admin-game-detail.component.html',
  styleUrls: [
    '../../../shared/scss/cards.scss',
    '../../../shared/scss/forms.scss',
    '../../admin.component.scss',
  ],
  providers: [
    provideNativeDateAdapter(),],
})
export class AdminGameDetailComponent implements OnInit {
  readonly #divisionService = inject(DivisionService);
  readonly #teamService = inject(TeamService);
  readonly locationService = inject(LocationService);
  readonly #router = inject(Router);
  readonly gameService = inject(GameService)
  selectedRecord = computed(() => this.gameService.selectedRecordSignal() as RegularGame | undefined);
  fb = inject(FormBuilder);
  gameEditForm = this.fb.group({
    gameDate: new FormControl<Date | null>(null, { nonNullable: false }),
    gameTime: new FormControl<Date | null>(null, { nonNullable: true }),
    location: new FormControl<GymLocation | undefined>(undefined, { nonNullable: false }),
    visitorTeam: new FormControl<Team | undefined>(undefined, { nonNullable: true }),
    homeTeam: new FormControl<Team | undefined>(undefined, { nonNullable: true }),
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
  getTime (value: Date | undefined) {
    // this.gameTime = time;new Date(this.selectedRecord()?.gameTime ?? ''));
    if (value === undefined) {
      return '';
    } else {
      return value.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }) ?? '';
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
  locations = this.locationService.locations();
  constructor () {
    effect(() => {
      console.log(this.gameService.selectedRecordSignal())
      this.scheduleGamesId = this.gameService.selectedRecordSignal()?.scheduleGamesId ?? 0;
    });
    effect(() => {
      console.log(this.divisionTeams());
    });
    effect(() => {
      //this.locations.set(this.locationService.locations());
      this.locations = this.locationService.locations();
    });
  }

  ngOnInit (): void {
    this.visitorComponent = this.gameEditForm.get(
      'visitorTeam'
    ) as FormControl;
    //   const gameTime = new Date(game?.gameTime ?? '');
    //   console.log(gameTime);
    //   const time =
    //     gameTime.toLocaleTimeString([], {
    //       hour: '2-digit',
    //       minute: '2-digit',
    //     }) ?? '';
    // console.log(time);
    // this.gameTime = time;

    // this.gameTime2 = this.gameTime;

    // this.gameTimeFormatted = game?.gameTime?.getHours + ':' + game?.gameTime?.getMinutes;
    // console.log(this.gameTimeFormatted);

    // this.getTeam(game?.homeTeamId as number).subscribe((team) => {
    // console.log(team);
    // this.homeTeam = team;
    // });
    console.log(this.homeTeam);
    console.log(this.selectedRecord());
    // this.getTeam(game?.visitingTeamId as number).subscribe((team) => {
    //   // console.log(team);
    //   this.visitorTeam = team;
    // });
    // console.log(this.visitorTeam);

    this.location = this.locationService.getLocationByName(this.selectedRecord()?.locationName as string ?? '') as GymLocation;
    this.visitingTeam = this.#teamService.getTeamByTeamId(this.selectedRecord()?.visitingTeamId! ?? 0);
    console.log(this.location);
    console.log(this.visitingTeam);
    this.homeTeam = this.#teamService.getTeamByTeamId(this.selectedRecord()?.homeTeamId! ?? 0)
    console.log(this.homeTeam);
    this.gameEditForm.patchValue({
      gameDate: this.selectedRecord()?.gameDate as Date,
      gameTime: this.selectedRecord()!.gameTime,
      location: this.location!,
      homeTeam: this.homeTeam,
      visitorTeam: this.visitingTeam,
    });
    // this.visitorComponent?.setValue(this.visitorTeam);
    // });
  }

  getTeam (teamId: number) {
    console.log(teamId);
    // return this.divisionTeams.pipe(
    //   map((t) => t.find((s) => s.teamId === teamId))
    // );
  }

  onSave () {
    console.log(this.gameEditForm.value);
    const saveObject = this.converttoSaveFormat(this.gameEditForm.value);
    if (this.scheduleGamesId === 0) {
      console.log('gameId is undefined');
      this.gameService.saveNewGame(saveObject);
    } else {
      this.gameService.saveExistingGame(saveObject);
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
  }
  converttoSaveFormat (gameEditForm: typeof this.gameEditForm.value): RegularGameSaveObject {
    let game = new RegularGameSaveObject();
    game.scheduleGamesId = this.scheduleGamesId;
    game.scheduleNumber = this.selectedRecord()?.scheduleNumber ?? 0;
    game.gameNumber = this.selectedRecord()?.gameNumber ?? 0;
    game.locationNumber = gameEditForm.location?.locationNumber ?? 0;
    game.gameDate = gameEditForm.gameDate ? new Date(gameEditForm.gameDate).toISOString() : "";
    game.gameTime = gameEditForm.gameTime ? new Date(gameEditForm.gameTime)?.toISOString() : "";
    game.visitingTeamNumber = gameEditForm.visitorTeam?.teamId ?? 0;
    game.homeTeamNumber = gameEditForm.homeTeam?.teamId ?? 0;
    game.visitingTeamScore = 0;
    game.homeTeamScore = 0;
    game.visitingForfeited = false;
    game.homeForfeited = false;
    game.seasonId = this.selectedRecord()?.seasonId ?? 0;
    game.divisionId = this.selectedRecord()?.divisionId ?? 0;

    return game;
  }
  cancel () {
    console.log('cancel');
    this.#router.navigate(['./admin/games/list']);
    // this.gameEditForm.reset();
  }
}
