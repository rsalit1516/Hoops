import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  FormControlDirective,
} from '@angular/forms';
import { Store, select } from '@ngrx/store';

import * as fromGames from '../../state';
import * as gameActions from '../../state/games.actions';
import { Division } from 'app/domain/division';
import { Team } from 'app/domain/team';
import { DivisionService } from 'app/services/division.service';
import { catchError, tap, map } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { GameService } from 'app/games/game.service';
import { Season } from 'app/domain/season';

@Component({
  selector: 'csbc-game-filter',
  templateUrl: './game-filter.component.html',
  styleUrls: ['./game-filter.component.scss'],
})
export class GameFilterComponent implements OnInit {
  @Input()
  divisions!: Division[];
  @Input()
  currentDivision!: Division;
  @Input() teams!: Team[] | null;
  @Input() currentTeam!: Team;
  @Input() showAllTeams!: boolean;
  // @Output() selectedDivision = new EventEmitter<Division>();
  @Output() selectedTeam = new EventEmitter<Team>();
  criteriaForm!: FormGroup;
  divisions$ = this.divisionService.divisions$.pipe(
    catchError((err) => {
      return EMPTY;
    })
  );
  selected!: Division;
  filteredTeams: Team[] | undefined;
  season: Season | undefined;

  constructor(
    private fb: FormBuilder,
    private divisionService: GameService,
    private store: Store<fromGames.State>
  ) {}

  ngOnInit() {
    this.showAllTeams = true;
    this.createForm();
    this.setStateSubscriptions();
    this.setControlSubscriptions();
    this.store.select(fromGames.getCurrentSeason).subscribe((currentSeason) => {
      this.season = currentSeason;
      this.store.select(fromGames.getDivisions).subscribe((divisions) => {
        this.store
          .select(fromGames.getCurrentDivision)
          .subscribe((division) => {
            if (division?.divisionId === 0) {
              console.log(division);
              this.criteriaForm.get('divisions').setValue(divisions[0]);
            }
          });
      });
    });
    // this.criteriaForm.get('divisions').setValue();
  }

  createForm() {
    this.criteriaForm = this.fb.group({
      divisions: new FormControl(''), // this.divisions$,
      teams: new FormControl(''),
      allTeams: true,
      gameView: 'list',
    });
  }
  setControlSubscriptions() {
    this.criteriaForm.get('divisions').valueChanges.subscribe((val) => {
      console.log(val);
      this.changeDivision(val);
    });
    this.criteriaForm.get('teams').valueChanges.subscribe((val) => {
      console.log(val);
      this.store.dispatch(new gameActions.SetCurrentTeam(val));
    });
  }

  setStateSubscriptions() {}

  changeDivision(val: Division) {
    const division = this.criteriaForm.controls['divisions'].value;
    const divisionId = division.divisionId;
    console.log(division);
    if (division !== undefined) {
      this.store.dispatch(new gameActions.SetCurrentDivision(division));
      this.store.dispatch(new gameActions.SetCurrentDivisionId(divisionId));
      this.store.dispatch(new gameActions.LoadFilteredTeams());
    }
  }

  divisionSelected(division: Division): void {}

  teamSelected(team: Team): void {
    this.selectedTeam.emit(team);
  }
}
