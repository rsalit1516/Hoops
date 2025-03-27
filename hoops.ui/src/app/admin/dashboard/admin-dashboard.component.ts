import { Component, computed, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Season } from '@app/domain/season';
import { Division } from '@app/domain/division';
import { TeamService } from '@app/services/team.service';
import { Team } from '@app/domain/team';
import { Router } from '@angular/router';

import * as fromAdmin from '../state';
import * as adminActions from '../state/admin.actions';
import { RegularGame } from '@app/domain/regularGame';
import { AdminGamesListComponent } from '../admin-games/admin-games-list/admin-games-list.component';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgForOf } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { SeasonSelectComponent } from '../admin-shared/season-select/season-select.component';
import { SeasonService } from '@app/services/season.service';
import { GameService } from '@app/services/game.service';
import { DivisionService } from '@app/services/division.service';
import { DashboardDivisionsComponent } from '../components/dashboard-divisions/dashboard-divisions.component';
import { DashboardTeamsComponent } from "../components/dashboard-teams/dashboard-teams.component";
import { DashboardGamesComponent } from '../components/dashboard-games/dashboard-games.component';

@Component({
  selector: 'csbc-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: [
    '../../shared/scss/cards.scss',
    './admin-dashboard.component.scss',
    '../admin.component.scss'
  ],
  imports: [
    SeasonSelectComponent,
    MatCardModule,
    MatListModule,
    NgFor,
    NgForOf,
    AdminGamesListComponent,
    DashboardDivisionsComponent,
    DashboardTeamsComponent,
    DashboardGamesComponent
  ]
})
export class AdminDashboardComponent implements OnInit {
  private store = inject(Store<fromAdmin.State>);
  readonly #seasonService = inject(SeasonService);
  readonly #divisionService = inject(DivisionService);
  readonly #teamService = inject(TeamService);
  readonly #gameService = inject(GameService);
  readonly #router = (Router);
  currentSeason!: Season;
  divisions!: Division[];
  // divisionCount!: number;
  teams!: Team[] | null;
  teamCount!: number;
  seasonGames: RegularGame[] | undefined;
  // seasonGameCount: number | undefined;
  // divisionTeams!: Team[] | null;
  selectedDivision!: Division | null;
  filteredGames!: RegularGame[];
  // divisionGames!: RegularGame[];
  divisionCount = computed(() => (this.#divisionService.seasonDivisions?.length ?? 0));

  selectedTeam!: Team | null;
  selectedSeason = computed(() => this.#seasonService.selectedSeason);
  seasonDivisions = computed(() => this.#divisionService.seasonDivisions);
  divisionTeams = computed(() => this.#teamService.divisionTeams);
  divisionGames = computed(() => this.#gameService.divisionGames);
  seasonGameCount = computed(() => this.#gameService.seasonGamesSignal.length ?? 0);
  teamGames = this.#gameService.teamGames;
  constructor() { }

  ngOnInit() {
    // this.store.dispatch(new adminActions.LoadCurrentSeason());
    this.setStateSubscriptions();
    // this.router.navigate(['/admin/content/list']);
  }
  setStateSubscriptions() {
    // this.store.select(fromAdmin.getSelectedSeason).subscribe((season) => {
    //   this.currentSeason = season as Season;
    // this.store.dispatch(new gameActions.LoadDivisions());

    //   this.divisionCount = divisions.length;
    //   if (divisions.length > 0) {
    //     this.selectedDivision = divisions[0];
    //   }
    // });
    // this.store.select(fromAdmin.getSeasonTeams).subscribe((teams) => {
    //   this.teams = teams;
    //   this.teamCount = teams === null ? 0 : teams.length;
    // });

    // this.store.select(fromAdmin.getSeasonGames).subscribe((games) => {
    //   this.seasonGames = games;
    //   this.seasonGameCount = games.length;
    // });
    // });
    // this.store.select(fromAdmin.getSelectedDivision).subscribe((division) => {
    //   this.store.select(fromAdmin.getDivisionTeams).subscribe((teams) => {
    //     this.divisionTeams = teams;
    //     this.teamCount = teams === null ? 0 : teams.length;
    //   });
    //   this.selectedDivision = division;
    //   this.store.dispatch(new adminActions.LoadDivisionGames());
    //   // this.store.dispatch(new adminActions.SetFilteredGames()
    // });
    // this.store.select(fromAdmin.getSelectedTeam).subscribe((team) => {
    //   // console.log(team);
    //   this.selectedTeam = team;
    //   this.store.dispatch(new adminActions.LoadTeamGames());
    // });
    // this.store.select(fromAdmin.getDivisionGames).subscribe((games) => {
    //   if (games !== null) {
    //     this.divisionGames = games;
    //   }
    // if (games !== null) {
    //   this.store.dispatch(new adminActions.SetFilteredGames(games));
    // }
    // this.store.dispatch(new adminActions.LoadTeamGames);
    // });

    //   this.#gameService.filterGamesByTeam().subscribe((games) => {
    //     // console.log(games);
    //     if (games !== null) {
    //       this.teamGames = games;
    //       this.store.dispatch(new adminActions.SetFilteredGames(games));
    //     }
    //   });
  }
  goToDivision(division: Division) {
    // this.store.dispatch(new adminActions.SetSelectedDivision(division));
    this.selectedDivision = division;
    // this.router.navigate(['/admin/division']);
  }
  setTeam(team: Team) {
    this.store.dispatch(new adminActions.SetSelectedTeam(team));

    // this.router.navigate(['/admin/division']);
  }
}
