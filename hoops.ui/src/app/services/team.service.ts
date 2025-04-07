import { computed, effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { catchError } from 'rxjs/operators';

import * as fromGames from '../games/state';
import { Store } from '@ngrx/store';

import { Team } from '../domain/team';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '@app/shared/constants';
import { DivisionService } from './division.service';
import { SeasonService } from './season.service';


@Injectable({
  providedIn: 'root',
})
export class TeamService {
  readonly #http = inject(HttpClient);
  readonly #dataService = inject(DataService);
  readonly #divisionService = inject(DivisionService);
  readonly #seasonService = inject(SeasonService);
  seasonId: number | undefined; // = 2192; // TO DO make this is passed in!
  selectedSeason = computed(() => this.#seasonService.selectedSeason);
  selectedDivision = computed(() => this.#divisionService._selectedDivision());
  seasonTeams = signal<Team[] | undefined>(undefined);
  divisionTeams = signal<Team[]>([]);
  teams!: Team[];
  private _selectedTeam = signal<Team | undefined>(undefined);

  get selectedTeam (): Team | undefined {
    return this._selectedTeam();
  }

  updateSelectedTeam (value: Team | undefined): void {
    this._selectedTeam.set(value);
  }
  _addAllTeams = signal<boolean>(false);
  get addAllTeams (): boolean {
    return this._addAllTeams();
  }
  updateAllTeams (value: boolean): void {
    this._addAllTeams.set(value);
  }// console.log('get addAllTeams');
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
        console.log('Division Teams: ', this.divisionTeams());
        this.updateSelectedTeam(this.divisionTeams()[0]);
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
        this.updateSelectedTeam(this.seasonTeams()![0]);
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
    if (this.addAllTeams) {
      const teamId: number = 0;
      const divisionId: number = this.selectedDivision()!.divisionId;
      const name: string = Constants.ALLTEAMS;
      const teamName: string = Constants.ALLTEAMS;
      const teamNumber: string = '0';
      const team = new Team(teamId, divisionId, name, teamName, teamNumber);
      filteredTeams.push(team);
    }
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
  saveTeam (team: Team): void {
    console.log(team);

    if (team.teamId === 0) {
      this.addTeam(team).subscribe((team) => {
        console.log(team);
        //this.store.dispatch(new adminActions.LoadSeasonTeams());
      });
    } else {
      this.updateTeam(team).subscribe((team) => {
        // this.store.dispatch(new adminActions.LoadSeasonTeams());
      });
    }
  }
  addTeam (team: Team): Observable<Team | ArrayBuffer> {
    console.log(this.#dataService.teamPostUrl);
    return this.#http
      .post<Team>(
        this.#dataService.teamPostUrl,
        team,
        this.#dataService.httpOptions
      )
      .pipe(catchError(this.#dataService.handleError('addTeam', team)));
  }
  // addNewTeamDefaults(team: Team) {
  //   this.store.select(fromAdmin.getSelectedDivision).subscribe((division) => {
  //     let d = division?.divisionId;
  //     team.divisionId = d as number;
  //     return team;
  //   });
  //   return team;
  // }
  // newTeam() {
  //   let team = new Team();
  //   team.teamId = 0;
  //   this.store.select(fromAdmin.getSelectedDivision).subscribe((division) => {
  //     let d = division?.divisionId;
  //     team.divisionId = d as number;
  //     return team;
  //   });
  //   return team;
  // }
  updateTeam (team: Team) {
    return this.#http
      .put<Team>(
        this.#dataService.teamPutUrl + team.teamId,
        team,
        this.#dataService.httpOptions
      )
      .pipe(catchError(this.#dataService.handleError('updateTeam', team)));
  }
  newTeam () {
    let team = new Team();
    team.teamId = 0;
    team.divisionId = this.#divisionService.
      _selectedDivision()!.divisionId
    return team;

  }
  getTeamByTeamId (teamId: number): Team | undefined {
    return this.divisionTeams()!.find((team) => team.teamId === teamId);
  }
}
