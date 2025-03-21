import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import * as fromGames from '../games/state';
import * as gameActions from '../games/state/games.actions';
import * as fromUser from '@app/user/state';
import { Store, select } from '@ngrx/store';

import { Team } from '../domain/team';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Constants } from '@app/shared/constants';
import { DivisionService } from './division.service';
import { SeasonService } from './season.service';


@Injectable({
  providedIn: 'root',
})
export class TeamService {
  readonly #http = inject(HttpClient);
  readonly #dataService = inject(DataService);
  readonly #store = inject(Store<fromGames.State>);
  readonly #divisionService = inject(DivisionService);
  readonly #seasonService = inject(SeasonService);
  seasonId: number | undefined; // = 2192; // TO DO make this is passed in!
  selectedSeason = computed(() => this.#seasonService.selectedSeason);
  selectedDivision = computed(() => this.#divisionService.selectedDivision());
  currentSeason$ = this.#store.select(fromGames.getCurrentSeason).subscribe({
    next: (season) => {
      // console.log(season);
      if (season !== undefined && season !== null) {
        this.seasonId = season.seasonId;
      }
    },
  });
  seasonTeams = signal<Team[] | undefined>(undefined);
  divisionTeams = signal<Team[]>([]);
  teams!: Team[];
  selectedTeam = signal<Team | undefined>(undefined);

  private teamUrl = Constants.GET_SEASON_TEAMS_URL;

  constructor () {
    effect(() => {
      // console.log(this.selectedSeason());
      if (this.selectedSeason() !== undefined) {
        this.getSeasonTeams();
        //console.log(this.seasonTeams());
      }
    });
    effect(() => {
      // console.log(this.selectedDivision());
      if (this.selectedDivision() !== undefined) {
        const divisionTeams = this.filterTeamsByDivision(this.selectedDivision()!.divisionId);
        // console.log(divisionTeams);
        this.divisionTeams.update(() => divisionTeams);
        this.selectedTeam.update(() => this.divisionTeams()[0]);
      }
    });
  }

  getSeasonTeams (): void {
    if (this.selectedSeason() === undefined) {
      return;
    }
    const url = this.teamUrl + this.selectedSeason()!.seasonId;
    // console.log('getting season teams');
    this.#http.get<Team[]>(url).subscribe(
      (teams) => {
        this.seasonTeams.update(() => teams);
        this.selectedTeam.update(() => this.seasonTeams()![0]);
      },
      // tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.#dataService.handleError('getTeams', []))
    );
  }
  // fetchSeasonTeams(): void {
  //   this.getSeasonTeams().subscribe((teams) => {
  //   })
  // }
  filterTeamsByDivision (div: number): Team[] {

    let filteredTeams: Team[] = [];
    const teamId: number = 0;
    const divisionId: number = 0;
    const name: string = Constants.ALLTEAMS;
    const teamName: string = Constants.ALLTEAMS;
    const teamNumber: string = '0';
    const team = new Team(teamId, divisionId, name, teamName, teamNumber);
    filteredTeams.push(team);

    if (this.seasonTeams() !== undefined) {
      this.seasonTeams()!.forEach((element) => {
        // console.log(element);
        if (element.divisionId === div) {
          filteredTeams.push(element);
        }
      });
    }
    return filteredTeams;
  }

  // getTeam(id: number): Observable<Team> {
  //     return this.getTeams()
  //         .pipe(
  //         map((content: Team[]) => content.find(p => p.id === id))
  //         );
  // }
}
