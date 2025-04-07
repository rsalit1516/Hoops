import { Component, OnInit, computed, inject, input, effect } from '@angular/core';
import { UntypedFormControl, ReactiveFormsModule, FormControl, FormsModule, FormBuilder } from '@angular/forms';
import { Team } from '@app/domain/team';
import { Store } from '@ngrx/store';
import * as fromAdmin from '../../state';
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
import { MatTimepickerModule, MatTimepickerOption } from '@angular/material/timepicker';
import { Router } from '@angular/router';
import { GameService } from '@app/services/game.service';
import { Location as GymLocation } from '@app/domain/location';

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
  private store = inject(Store<fromAdmin.State>);
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
    gameTime2: new FormControl<Date | null>(null, { nonNullable: true }),
    location: new FormControl<GymLocation | undefined>(undefined, { nonNullable: false }),
    visitorTeam: new FormControl<Team | undefined>(undefined, { nonNullable: true }),
    homeTeam: new FormControl<Team | undefined>(undefined, { nonNullable: true }),
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
    // console.log(time);
    // this.gameTime = time;
  }
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
  }
  cancel () {
    console.log('cancel');
    this.#router.navigate(['./admin/games/list']);
    // this.gameEditForm.reset();
  }
}
