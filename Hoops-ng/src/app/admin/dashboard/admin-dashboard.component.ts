import { Component, OnInit, Input } from '@angular/core';
import { Content } from '../../domain/content';
import { Store, select } from '@ngrx/store';

import * as fromGames from '../../games/state';
import * as gameActions from './../../games/state/games.actions';
import { Observable } from 'rxjs';
import { Season } from 'app/domain/season';
import { Division } from 'app/domain/division';
import { TeamService } from 'app/services/team.service';
import { Team } from 'app/domain/team';
@Component({
  selector: 'csbc-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  currentSeason: void | Season;
  divisions: Division[];
  divisionCount: number;
  teams: Team[];
  teamCount: number;
  constructor(private store: Store<fromGames.State>, private teamService: TeamService) {}

  ngOnInit() {
    this.store.dispatch(new gameActions.LoadCurrentSeason());
    this.setStateSubscriptions();
    this.teamService.getTeams().subscribe(teams => {
      this.teams = teams;
      this.teamCount = teams.length;
    });
  }
  setStateSubscriptions() {
    this.store
      .select(fromGames.getCurrentSeason)
      .subscribe(season => {
        (this.currentSeason = season)
        this.store.dispatch(new gameActions.LoadDivisions());
      }
        );
    this.store
      .select(fromGames.getDivisions)
      .subscribe(divisions => {(this.divisions = divisions)
      this.divisionCount = divisions.length});

  }
}
