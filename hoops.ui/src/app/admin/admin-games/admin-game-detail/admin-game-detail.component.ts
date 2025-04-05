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
    provideNativeDateAdapter(), ],
})
export class AdminGameDetailComponent implements OnInit {
  selectedRecord = input.required<RegularGame>();
  private store = inject(Store<fromAdmin.State>);
  readonly #divisionService = inject(DivisionService);
  readonly #teamService = inject(TeamService);
  readonly locationService = inject(LocationService);
  readonly #router = inject(Router);
  fb = inject(UntypedFormBuilder);
  gameEditForm = this.fb.group({
    gameDate: new FormControl<Date | null>(null, { nonNullable: false }),
    gameTime: new FormControl<Date | null>(null, { nonNullable: true }),
    gameTime2: new FormControl<Date | null>(null, { nonNullable: true }),
    locationName: new FormControl('', { nonNullable: false }),
    visitorTeam: new FormControl('', { nonNullable: true }),
    homeTeam: new FormControl('', { nonNullable: true }),
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
  getTime(value: Date | undefined) {
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
  constructor() {
    effect(() => {
      console.log(this.divisionTeams);
    });
    effect(() => {
      //this.locations.set(this.locationService.locations());
      this.locations = this.locationService.locations();
    });
  }

  ngOnInit(): void {
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

    // this.getTeam(game?.visitingTeamId as number).subscribe((team) => {
    //   // console.log(team);
    //   this.visitorTeam = team;
    // });
    // console.log(this.visitorTeam);

    this.gameEditForm.patchValue({
      gameDate: this.selectedRecord()?.gameDate as Date,
      gameTime: this.selectedRecord()!.gameTime,
      locationName: this.selectedRecord()?.locationName,
      homeTeam: this.selectedRecord()?.homeTeamId!.toString() ?? '',
      visitorTeam: this.selectedRecord()?.visitingTeamId!.toString() ?? '',
    });
    // this.visitorComponent?.setValue(this.visitorTeam);
    // });
  }

  getTeam(teamId: number) {
    console.log(teamId);
    // return this.divisionTeams.pipe(
    //   map((t) => t.find((s) => s.teamId === teamId))
    // );
  }

  onSave () { }
  cancel () {
    console.log('cancel');
    this.#router('/admin/games/list');
    this.gameEditForm.reset();
  }
}
