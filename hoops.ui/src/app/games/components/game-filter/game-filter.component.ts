import { Component, OnInit, input, output } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromGames from '../../state';
import * as gameActions from '../../state/games.actions';
import { Division } from '@app/domain/division';
import { Team } from '@app/domain/team';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { GameService } from '@app/games/game.service';
import { Season } from '@app/domain/season';
import { Constants } from '@app/shared/constants';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'csbc-game-filter',
    templateUrl: './game-filter.component.html',
    styleUrls: ['./game-filter.component.scss'],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        NgFor,
        MatOptionModule,
    ]
})
export class GameFilterComponent implements OnInit {
  readonly divisions = input.required<Division[]>();
  currentDivision!: Division;
  readonly teams = input.required<Team[] | null>();
  currentTeam!: Team;
  showAllTeams!: boolean;
  readonly selectedTeam = output<Team>();
  criteriaForm!: any;
  divisions$ = this.divisionService.divisions$.pipe(
    catchError((err) => {
      return EMPTY;
    })
  );
  selected!: Division;
  filteredTeams: Team[] | undefined;
  season: Season | undefined;
  teamComponent: FormControl | null | undefined;
  divisionComponent: FormControl | null | undefined;

  constructor(
    private fb: FormBuilder,
    private divisionService: GameService,
    private store: Store<fromGames.State>
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.showAllTeams = true;
    this.divisionComponent = this.criteriaForm.get('divisions') as FormControl;
    this.teamComponent = this.criteriaForm.get('teams') as FormControl;
    this.setStateSubscriptions();
    this.setControlSubscriptions();
    this.store.select(fromGames.getCurrentDivision).subscribe((division) => {
      this.currentDivision = division as Division;
      this.divisionComponent?.setValue(this.currentDivision);
      this.changeDivision(division as Division);
    });
  }

  createForm() {
    this.criteriaForm = this.fb.group({
      divisions: new FormControl(this.currentDivision),
      teams: this.teams(),
      allTeams: true,
      gameView: 'list',
    });
  }
  setControlSubscriptions() {
    this.divisionComponent?.valueChanges.subscribe((division) => {
      this.changeDivision(division);
    });
    this.teamComponent?.valueChanges.subscribe((val) => {
      console.log(val);
      if (val.teamName === Constants.ALLTEAMS) {
        this.changeDivision(this.currentDivision);
      } else {
      this.store.dispatch(new gameActions.SetCurrentTeam(val));
      }
      // let check = this.criteriaForm.get('allTeamCheckbox') as FormControl;
      // check.setValue(false);
    });
  }

  setStateSubscriptions() {}

  changeDivision(val: Division) {
    if (val !== undefined && val !== this.currentDivision) {
      this.currentDivision = val;
      this.store.dispatch(new gameActions.SetCurrentDivision(val));
      this.store.dispatch(new gameActions.LoadDivisionGames);
      this.store.dispatch(new gameActions.LoadDivisionPlayoffGames);
      this.store.dispatch(new gameActions.LoadStandings);
    }
  }

  changeTeam(val: Team) {
    if (val !== undefined && val !== this.currentTeam) {
      this.currentTeam = val;
      this.store.dispatch(new gameActions.SetCurrentTeam(val));
      // this.store.dispatch(new gameActions.LoadTeamGames);
    }
  }
  divisionSelected(division: Division): void {}

  teamSelected(team: Team): void {
    this.selectedTeam.emit(team);
  }
}
