import { Component, OnInit, Input } from '@angular/core';
import { Content } from '../../domain/content';
import { Store, select } from '@ngrx/store';

import * as fromGames from '../../games/state';
import * as gameActions from './../../games/state/games.actions';
import { Observable } from 'rxjs';
import { Season } from 'app/domain/season';
import { Division } from 'app/domain/division';
import { TeamService } from '@app/services/team.service';
import { Team } from '@app/domain/team';
import { Router } from '@angular/router';

import * as fromAdmin from '../state';
import * as adminActions from '../state/admin.actions';
import { Game } from '@app/domain/game';

@Component({
  selector: 'csbc-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  currentSeason!: Season;
  divisions!: Division[];
  divisionCount!: number;
  teams!: Team[] | null;
  teamCount!: number;
  seasonGames: Game[] | undefined;
  seasonGameCount: number | undefined;
  divisionTeams!: Team[] | null;

  constructor(
    private store: Store<fromAdmin.State>,
    private teamService: TeamService,
    private router: Router
  ) {}

  ngOnInit() {
    this.store.dispatch(new adminActions.LoadCurrentSeason());
    this.setStateSubscriptions();

  }
  setStateSubscriptions() {
    this.store.select(fromAdmin.getSelectedSeason).subscribe((season) => {
      this.currentSeason = season as Season;
      // this.store.dispatch(new gameActions.LoadDivisions());

      this.store.select(fromAdmin.getSeasonDivisions).subscribe((divisions) => {
        this.divisions = divisions;
        this.divisionCount = divisions.length;
      });
      this.store.select(fromAdmin.getSeasonTeams).subscribe((teams) => {
          this.teams = teams;
          this.teamCount = (teams === null? 0 : teams.length);
      });

      this.store.select(fromAdmin.getSeasonGames).subscribe((games) => {
        this.seasonGames = games;
        this.seasonGameCount = games.length;
      });
    });
    this.store.select(fromAdmin.getSelectedDivision).subscribe((division) => {

      this.store.select(fromAdmin.getDivisionTeams).subscribe((teams) => {
        this.divisionTeams = teams;
        this.teamCount = (teams === null ? 0 : teams.length);
      });
  });

  }
  goToDivision(division: Division) {
    this.store.dispatch(new adminActions.SetSelectedDivision(division));
    // this.router.navigate(['/admin/division']);
  }
  setTeam(team: Team) {
    this.store.dispatch(new adminActions.SetSelectedTeam(team));
    // this.router.navigate(['/admin/division']);
  }

}
