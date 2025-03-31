import { Component, OnInit, computed, effect, inject, input, output } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromGames from '../../state';
import * as gameActions from '../../state/games.actions';
import { Division } from '@app/domain/division';
import { Team } from '@app/domain/team';
import { GameService } from '@app/services/game.service';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoggerService } from '@app/services/logging.service';
import { DivisionService } from '@app/services/division.service';
import { TeamService } from '@app/services/team.service';
import { SeasonService } from '@app/services/season.service';

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
  readonly #logger = inject(LoggerService);
  readonly #divisionService = inject(DivisionService);
  readonly #gameService = inject(GameService);
  readonly #teamService = inject(TeamService);
  readonly #seasonService = inject(SeasonService);
  readonly divisions = input.required<Division[]>();
  readonly teams = input.required<Team[] | null>();
  readonly display = input.required<string>();
  // divisionService = inject(GameService);
  gameStore = inject(Store<fromGames.State>);
  currentTeam!: Team;
  showAllTeams!: boolean;
  // readonly selectedTeam = output<Team>();
  selectedDivision = computed(() => this.#divisionService.selectedDivision);
  selectedTeam = computed(() => this.#teamService.selectedTeam);

  division = this.selectedDivision();
  team = this.selectedTeam();
  currentDivision: Division | undefined;
  // selectedDivision = computed(() => this.#divisionService.selectedDivision());
  // // divisions = computed(() => this.#divisionService.seasonDivisions);
  constructor () {
    effect(() => {
      this.division = this.selectedDivision();
    });
    effect(() => {
      this.team = this.selectedTeam();
    });
  }

  ngOnInit () {
    this.showAllTeams = true;

    // this.#seasonService.fetchCurrentSeason();
    // this.gameStore.select(fromGames.getCurrentDivision).subscribe((division) => {
    //   this.currentDivision = division!;
    //   this.#logger.log(division);
    //   this.gameStore.dispatch(new gameActions.LoadFilteredGames);
    //   this.gameStore.dispatch(new gameActions.LoadDivisionPlayoffGames);
    //   this.gameStore.dispatch(new gameActions.LoadStandings);
    // });
  }

  onDivisionChange (val: Division) {
    // console.log(val);
    if (val !== undefined) {
      // this.currentDivision = val;
      this.#divisionService.updateSelectedDivision(val);
      // this.gameStore.dispatch(new gameActions.SetCurrentDivision(val));
    }
  }

  onTeamChange (val: Team) {
    if (val !== undefined) {
      this.currentTeam = val;
      this.#teamService.updateSelectedTeam(val);
      // this.gameStore.dispatch(new gameActions.SetCurrentTeam(val));
      // this.store.dispatch(new gameActions.LoadTeamGames);
    }
  }
}
