import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
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
  private readonly http = inject(HttpClient);
  private readonly dataService = inject(DataService);
  private readonly divisionService = inject(DivisionService);
  private readonly seasonService = inject(SeasonService);
  seasonId: number | undefined; // = 2192; // TO DO make this is passed in!
  selectedSeason = computed(() => this.seasonService.selectedSeason);
  selectedDivision = computed(() => this.divisionService.selectedDivision());
  seasonTeams = signal<Team[] | undefined>(undefined);
  divisionTeams = signal<Team[]>([]);
  teams!: Team[];
  private _selectedTeam = signal<Team | undefined>(undefined);

  get selectedTeam(): Team | undefined {
    return this._selectedTeam();
  }
  // Readonly signal for components that prefer reactive binding
  selectedTeamSignal = this._selectedTeam.asReadonly();

  updateSelectedTeam(value: Team | undefined): void {
    this._selectedTeam.set(value);
    // Persist selection per (season, division) for user convenience
    try {
      const seasonId = this.seasonService.selectedSeason()?.seasonId ?? 0;
      const divisionId =
        value?.divisionId ?? this.selectedDivision()?.divisionId ?? 0;
      if (seasonId && divisionId) {
        localStorage.setItem(
          `games:lastTeam:${seasonId}:${divisionId}`,
          String(value?.teamId ?? 0)
        );
      }
    } catch {}
  }
  _addAllTeams = signal<boolean>(false);
  get addAllTeams(): boolean {
    return this._addAllTeams();
  }
  updateAllTeams(value: boolean): void {
    this._addAllTeams.set(value);
  } // console.log('get addAllTeams');
  private teamUrl = Constants.GET_SEASON_TEAMS_URL;

  constructor() {
    effect(() => {
      const sel = this.seasonService.selectedSeason();
      if (sel && sel.seasonId) {
        this.getSeasonTeams();
      }
    });
    effect(() => {
      const division = this.divisionService.selectedDivision();
      const seasonTeams = this.seasonTeams();
      if (!division || !this.seasonTeams()!) {
        this.divisionTeams.set([]);
        return;
      }
      const divisionTeams = this.filterTeamsByDivision(division.divisionId);
      this.divisionTeams.set(divisionTeams);
      // Only update selected team if none selected or no longer present.
      // Use both teamId and divisionId so the sentinel "All Teams" (teamId=0)
      // from a previous division doesn't appear as "present" in the new division.
      const current = this._selectedTeam();
      const first = divisionTeams[0];
      const isCurrentPresent =
        !!current &&
        divisionTeams.some(
          (t) =>
            t.teamId === current.teamId && t.divisionId === current.divisionId
        );
      if (!current || !isCurrentPresent) {
        // Try restoring last selection for this (season, division)
        let restored: Team | undefined = undefined;
        try {
          const seasonId = this.seasonService.selectedSeason()?.seasonId ?? 0;
          const key = `games:lastTeam:${seasonId}:${division.divisionId}`;
          const raw = localStorage.getItem(key);
          const storedId = raw ? Number(raw) : NaN;
          if (Number.isFinite(storedId)) {
            restored = divisionTeams.find((t) => t.teamId === storedId);
          }
        } catch {}
        this._selectedTeam.set(restored ?? first);
      }
    });
  }

  getSeasonTeams(): void {
    const sel = this.seasonService.selectedSeason();
    if (!sel || !sel.seasonId) return;
    const url = this.teamUrl + sel.seasonId;
    console.log(url);
    this.http.get<Team[]>(url).subscribe((teams) => {
      this.seasonTeams.set(teams ?? []);
      // Do not set selectedTeam here to avoid race conditions; handled in effect above
    }, catchError(this.dataService.handleError('getTeams', [])));
  }
  // fetchSeasonTeams(): void {
  //   this.getSeasonTeams().subscribe((teams) => {
  //   })
  // }
  filterTeamsByDivision(div: number): Team[] {
    const filtered: Team[] = [];
    if (this.addAllTeams) {
      const team = new Team(
        0,
        this.selectedDivision()!.divisionId,
        Constants.ALLTEAMS,
        Constants.ALLTEAMS,
        '0'
      );
      filtered.push(team);
    }
    const seasonTeams = this.seasonTeams();
    if (seasonTeams && seasonTeams.length) {
      for (const t of seasonTeams) {
        if (t.divisionId === div) filtered.push(t);
      }
    }
    return filtered;
  }

  // getTeam(id: number): Observable<Team> {
  //     return this.getTeams()
  //         .pipe(
  //         map((content: Team[]) => content.find(p => p.id === id))
  //         );
  // }
  saveTeam(team: Team): void {
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
  addTeam(team: Team): Observable<Team | ArrayBuffer> {
    console.log(this.dataService.teamPostUrl);
    return this.http
      .post<Team>(
        this.dataService.teamPostUrl,
        team,
        this.dataService.httpOptions
      )
      .pipe(catchError(this.dataService.handleError('addTeam', team)));
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
  updateTeam(team: Team) {
    return this.http
      .put<Team>(
        this.dataService.teamPutUrl + team.teamId,
        team,
        this.dataService.httpOptions
      )
      .pipe(catchError(this.dataService.handleError('updateTeam', team)));
  }
  newTeam() {
    let team = new Team();
    team.teamId = 0;
    team.divisionId = this.divisionService.selectedDivision()!.divisionId;
    return team;
  }
  getTeamByTeamId(teamId: number): Team | undefined {
    return this.divisionTeams()!.find((team) => team.teamId === teamId);
  }

  /**
   * Gets the mapped team number from ScheduleDivTeams for proper database storage
   * @param scheduleNumber The schedule number from the game
   * @param teamNumber The team number from Teams table
   * @returns Observable with the mapped team number
   */
  getMappedTeamNumber(
    scheduleNumber: number,
    teamNumber: number
  ): Observable<number> {
    const url = `${Constants.FUNCTIONS_BASE_URL}/api/Team/GetMappedTeamNumber/${scheduleNumber}/${teamNumber}`;
    return this.http
      .get<number>(url)
      .pipe(catchError(this.dataService.handleError('getMappedTeamNumber', 0)));
  }

  /**
   * Gets the mapped team number from ScheduleDivTeams for proper database storage (season-aware)
   * @param scheduleNumber The schedule number from the game
   * @param teamNumber The team number from Teams table
   * @param seasonId The season ID
   * @returns Observable with the mapped team number
   */
  getMappedTeamNumberWithSeason(
    scheduleNumber: number,
    teamNumber: number,
    seasonId: number
  ): Observable<number> {
    const url = `${Constants.FUNCTIONS_BASE_URL}/api/Team/GetMappedTeamNumber/${scheduleNumber}/${teamNumber}/${seasonId}`;
    return this.http
      .get<number>(url)
      .pipe(
        catchError(
          this.dataService.handleError('getMappedTeamNumberWithSeason', 0)
        )
      );
  }

  /**
   * Gets the valid schedule team numbers for a specific schedule and season
   * @param scheduleNumber The schedule number
   * @param seasonId The season ID
   * @returns Observable with array of valid schedule teams
   */
  getValidScheduleTeams(
    scheduleNumber: number,
    seasonId: number
  ): Observable<
    { scheduleTeamNumber: number; teamNumber: number; displayName: string }[]
  > {
    const url = `${Constants.FUNCTIONS_BASE_URL}/api/Team/GetValidScheduleTeams/${scheduleNumber}/${seasonId}`;
    return this.http
      .get<
        {
          scheduleTeamNumber: number;
          teamNumber: number;
          displayName: string;
        }[]
      >(url)
      .pipe(
        catchError(this.dataService.handleError('getValidScheduleTeams', []))
      );
  }
}
