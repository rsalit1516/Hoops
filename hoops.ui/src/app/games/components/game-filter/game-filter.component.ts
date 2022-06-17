import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  FormControlDirective,
} from '@angular/forms';
import { Store, select } from '@ngrx/store';

import * as fromGames from '../../state';
import * as gameActions from '../../state/games.actions';
import { Division } from 'app/domain/division';
import { Team } from 'app/domain/team';
import { DivisionService } from 'app/services/division.service';
import { catchError, tap, map } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { GameService } from 'app/games/game.service';
import { Season } from 'app/domain/season';
import { Constants } from '@app/shared/constants';

@Component({
  selector: 'csbc-game-filter',
  templateUrl: './game-filter.component.html',
  styleUrls: ['./game-filter.component.scss'],
})
export class GameFilterComponent implements OnInit {
  @Input() divisions!: Division[];
  currentDivision!: Division;
  @Input() teams!: Team[] | null;
  @Input() currentTeam!: Team;
  @Input() showAllTeams!: boolean;
  @Output() selectedTeam = new EventEmitter<Team>();
  criteriaForm!: UntypedFormGroup;
  divisions$ = this.divisionService.divisions$.pipe(
    catchError((err) => {
      return EMPTY;
    })
  );
  selected!: Division;
  filteredTeams: Team[] | undefined;
  season: Season | undefined;
  teamComponent: UntypedFormControl | null | undefined;
  divisionComponent: UntypedFormControl | null | undefined;

  constructor(
    private fb: UntypedFormBuilder,
    private divisionService: GameService,
    private store: Store<fromGames.State>
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.showAllTeams = true;
    this.divisionComponent = this.criteriaForm.get('divisions') as UntypedFormControl;
    this.teamComponent = this.criteriaForm.get('teams') as UntypedFormControl;
    this.setStateSubscriptions();
    this.setControlSubscriptions();
    this.store.select(fromGames.getCurrentDivision).subscribe((division) => {
      this.currentDivision = division as Division;
      this.divisionComponent?.setValue(this.currentDivision);
      this.changeDivision(division as Division);
      // this.criteriaForm.controls['divisions'].setValue(division);
    });
  }

  createForm() {
    this.criteriaForm = this.fb.group({
      divisions: new UntypedFormControl(this.currentDivision),
      teams: this.teams,
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
    const changedDivision = this.criteriaForm.controls['divisions'].value;

    // if (this.currentDivision !== undefined &&
    //   changedDivision !== this.currentDivision
    // ) {
      this.currentDivision = changedDivision;
      this.store.dispatch(
        new gameActions.SetCurrentDivision(this.currentDivision)
      );
      // this.store.dispatch(new gameActions.LoadFilteredTeams());
      // this.store.dispatch(new gameActions.LoadStandings());
    // }
  }

  divisionSelected(division: Division): void {}

  teamSelected(team: Team): void {
    this.selectedTeam.emit(team);
  }
}
