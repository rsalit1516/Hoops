import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Color } from '@app/domain/color';
import { Division } from '@app/domain/division';
import { Team } from '@app/domain/team';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';

import * as fromUser from '../../../user/state';

import { User } from '@app/domain/user';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '@app/services/auth.service';
import { DivisionService } from '@app/services/division.service';
import { SeasonService } from '@app/services/season.service';
import { TeamService } from '@app/services/team.service';
import { ColorService } from '../services/color.service';
import { LocationService } from '../services/location.service';
@Component({
  selector: 'app-admin-team-detail',
  templateUrl: './admin-team-detail.component.html',
  styleUrls: [
    './../../../shared/scss/forms.scss',
    './../../../shared/scss/cards.scss',
    './admin-team-detail.component.scss',
    '../../admin.component.scss',
  ],
  imports: [
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    MatButtonModule,
    AsyncPipe,
  ]
})
export class AdminTeamDetailComponent implements OnInit {
  readonly #authService = inject(AuthService);
  readonly #teamService = inject(TeamService);
  readonly #divisionService = inject(DivisionService);
  readonly #seasonService = inject(SeasonService);
  readonly colorService = inject(ColorService);
  readonly locationService = inject(LocationService);
  private store = inject(Store<fromAdmin.State>);
  private fb = inject(UntypedFormBuilder);

  user = computed(() => this.#authService.currentUser());
  editTeamForm = this.fb.group({
    teamNo: [''],
    color: [''],
    teamName: [''],
    // coachName: [''],
    // sponsor: [''],
  });
  // colors$: Observable<Color[]>;
  _team = signal<Team | undefined>(undefined);
  get team () {
    return this._team();
  }
  updateTeam (val: Team) {
    this._team.set(val);
  }
  // selectedDivision$ = this.store.select(fromAdmin.getSelectedDivision);
  // selectedSeason$ = this.store.select(fromAdmin.getSelectedSeason);
  selectedSeason = computed(() => this.#seasonService.selectedSeason);
  selectedDivision = computed(() => this.#divisionService.selectedDivision);

  title = 'Team';

  constructor () {
    // this.colors$ = this.store.select(fromAdmin.getColors);
    effect(() => {
      // this.updateTeam(this.#teamService.selectedTeam!);
      this.patchTeamForm(this.#teamService.selectedTeam!);//
    });
  }

  ngOnInit (): void {
    // this.selectedDivision$.subscribe(
    //   (division) => (this.selectedDivision = division)
    // );
    // this.store.select(fromAdmin.getSelectedTeam).subscribe((team) => {
    // const team = this.#teamService.selectedTeam; // this.store.select(fromAdmin.getSelectedTeam);
    // console.log(team);
    // this.team = team as Team;

    // });
  }
  patchTeamForm (team: Team) {
    console.log(team);
    if (team) {
      this.editTeamForm.patchValue({
        teamNo: team.teamNumber,
        color: team.teamColorId,
        teamName: team.teamName,
        //  coach: team.coach.object
      });
    }
  }
  newTeam () {
    this.editTeamForm = this.fb.group({
      teamName: [''],
      teamNo: [''],
      color: [''],
    });
    let newTeam = new Team();

    newTeam.teamId = 0;
    newTeam.teamName = '';
    // this.store.dispatch(new adminActions.SetSelectedTeam(newTeam));
    this.#teamService.updateSelectedTeam(newTeam);
  }
  save () {
    let team: Team;
    console.log(this.team)
      ; team = {
        teamId: this.#teamService.selectedTeam?.teamId as number,
        name: '',
        divisionId: this.selectedDivision()?.divisionId as number,
        teamNumber: this.editTeamForm.value.teamNo,
        teamColorId: this.editTeamForm.value.color,
        teamName: this.editTeamForm.value.teamName,
        // To Do: add these back
        createdUser: 'rsalit', //this.user()!.userName,
        createdDate: new Date()
      };
    this.#teamService.saveTeam(team);
    this.#teamService.getSeasonTeams();
    this.newTeam();
  }
  cancel () { }
}
