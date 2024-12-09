import { Component, OnInit, inject, input, output } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromGames from '../../state';
import * as gameActions from '../../state/games.actions';
import { Division } from '@app/domain/division';
import { Team } from '@app/domain/team';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { GameService } from '@app/games/game.service';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'csbc-game-filter',
  templateUrl: './game-filter.component.html',
  styleUrls: ['./game-filter.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
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
  divisionService = inject(GameService);
  currentTeam!: Team;
  showAllTeams!: boolean;
  readonly selectedTeam = output<Team>();
  criteriaForm!: any;
  divisions$ = this.divisionService.divisions$.pipe(
    catchError((err) => {
      return EMPTY;
    })
  );
  // selected!: Division;
  filteredTeams: Team[] | undefined;
  // season: Season | undefined;
  //  teamComponent: FormControl | null | undefined;
  //  divisionComponent: FormControl | null | undefined;

  constructor (
    // private fb: FormBuilder,
    // private divisionService: GameService,
    private store: Store<fromGames.State>
  ) {
    // this.createForm();
  }

  ngOnInit () {
    this.showAllTeams = true;
    // this.setStateSubscriptions();
    // this.setControlSubscriptions();
    this.store.select(fromGames.getCurrentDivision).subscribe((division) => {
      this.currentDivision = division as Division;
      console.log(division);
      this.store.dispatch(new gameActions.LoadFilteredGames);
      this.store.dispatch(new gameActions.LoadDivisionPlayoffGames);
      this.store.dispatch(new gameActions.LoadStandings);
    });
  }

  onDivisionChange (val: Division) {
    console.log(val);
    if (val !== undefined && val !== this.currentDivision) {
      this.currentDivision = val;
      this.store.dispatch(new gameActions.SetCurrentDivision(val));

    }
  }

  onTeamChange (val: Team) {
    if (val !== undefined && val !== this.currentTeam) {
      this.currentTeam = val;
      this.store.dispatch(new gameActions.SetCurrentTeam(val));
      // this.store.dispatch(new gameActions.LoadTeamGames);
    }
  }
  divisionSelected (division: Division): void { }

  teamSelected (team: Team): void {
    this.selectedTeam.emit(team);
  }
}
