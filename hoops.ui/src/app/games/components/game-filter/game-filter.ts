import {
  Component,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
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
import { LoggerService } from '@app/services/logger.service';
import { DivisionService } from '@app/services/division.service';
import { TeamService } from '@app/services/team.service';
import { SeasonService } from '@app/services/season.service';
import { DivisionSelect } from '@app/admin/admin-shared/division-select/division-select';
import { TeamSelect } from '../../shared/team-select/team-select';

@Component({
  selector: 'csbc-game-filter',
  templateUrl: './game-filter.html',
  styleUrls: [
    './game-filter.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/select.scss',
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    DivisionSelect,
    TeamSelect,
  ],
})
export class GameFilter implements OnInit {
  readonly #logger = inject(LoggerService);
  readonly divisionService = inject(DivisionService);
  readonly #gameService = inject(GameService);
  readonly #teamService = inject(TeamService);
  readonly #seasonService = inject(SeasonService);
  // readonly divisions = input.required<Division[]>();
  readonly display = input.required<string>();
  // divisionService = inject(GameService);
  gameStore = inject(Store<fromGames.State>);
  showAllTeams!: boolean;
  // readonly selectedTeam = output<Team>();
  selectedDivision = computed(() => this.divisionService.selectedDivision());
  selectedTeam = computed(() => this.#teamService.selectedTeam);

  division = this.selectedDivision();
  team = this.selectedTeam();
  currentDivision: Division | undefined;
  constructor() {
    effect(() => {
      this.division = this.selectedDivision();
    });
    effect(() => {
      this.team = this.selectedTeam();
    });
  }

  ngOnInit() {
    this.showAllTeams = true;
    // Explicitly enable the sentinel "All Teams" for games views
    this.#teamService.updateAllTeams(true);
  }

  onDivisionChange(val: Division) {
    // console.log(val);
    if (val !== undefined) {
      // this.currentDivision = val;
      this.divisionService.updateSelectedDivision(val);
      // this.gameStore.dispatch(new gameActions.SetCurrentDivision(val));
    }
  }

  // Team selection is handled by TeamSelect component -> TeamService; no extra handler needed here.
}
