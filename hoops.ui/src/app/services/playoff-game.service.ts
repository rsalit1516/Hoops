import { HttpClient, httpResource } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { PlayoffGame } from '@app/domain/playoffGame';
import { Constants } from '@app/shared/constants';
import { select, Store } from '@ngrx/store';
import { Observable, catchError, map, of, tap } from 'rxjs';

import * as fromGames from '../games/state';
import { LoggerService } from './logging.service';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from './division.service';
import { DataService } from './data.service';
import { Season } from '@app/domain/season';

@Injectable({
  providedIn: 'root',
})
export class PlayoffGameService {
  readonly #divisionService = inject(DivisionService);
  private http = inject(HttpClient);
  // private gameStore = inject(Store<fromGames.State>);
  private logger = inject(LoggerService);
  readonly #seasonService = inject(SeasonService);
  readonly #dataService = inject(DataService);

  divisionPlayoffGames = signal<PlayoffGame[] | undefined>(undefined);
  seasonId: number | undefined; // = 2192; // TO DO make this is passed in!
  seasonPlayoffGames = signal<PlayoffGame[]>([]);
  allPlayoffGames: PlayoffGame[] | undefined;
  playoffGames$: Observable<PlayoffGame[]> | undefined;
  selectedSeason = computed(() => this.#seasonService.selectedSeason);
  selectedDivision = computed(() => this.#divisionService.selectedDivision());
  dailyPlayoffSchedule = signal<PlayoffGame[][]>([]);
  // Selected record for edit/detail view
  private _selectedRecord = signal<PlayoffGame | null>(null);
  selectedRecordSignal = this._selectedRecord.asReadonly();

  constructor() {
    effect(() => {
      if (this.selectedSeason() !== undefined) {
        this.fetchSeasonPlayoffGames();
      }
    });
    effect(() => {
      if (this.selectedDivision() !== undefined) {
        this.getDivisionPlayoffGames();
        const dailyGames = this.groupPlayoffGamesByDate(
          this.divisionPlayoffGames()!
        );
        this.dailyPlayoffSchedule.update(() => dailyGames);
      }
    });
  }

  getSeasonPlayoffGames(): Observable<PlayoffGame[] | null> {
    if (this.#seasonService.selectedSeason === undefined) {
      return of(null);
    } else {
      const url =
        Constants.PLAYOFF_GAMES_URL +
        '?seasonId=' +
        this.#seasonService.selectedSeason!.seasonId;
      return this.http.get<PlayoffGame[]>(url).pipe(
        // map((response) => (this.seasonPlayoffGames = response)),
        tap((data) => console.log('All: ' + JSON.stringify(data.length))),
        catchError(this.#dataService.handleError('getCurrentSeason', null))
      );
    }
  }
  fetchSeasonPlayoffGames() {
    if (this.selectedSeason() === undefined) {
      return;
    }
    this.getSeasonPlayoffGames().subscribe((playoffGames) => {
      if (playoffGames) {
        const normalized = playoffGames.map((g: any) =>
          this.normalizeApiPlayoffGame(g)
        );
        this.seasonPlayoffGames.update(() => normalized);
      }
    });
    // console.log(this.seasonPlayoffGames());
  }
  getDivisionPlayoffGames(): void {
    const allPlayoffGames = this.seasonPlayoffGames;
    const division = this.selectedDivision();
    let games: PlayoffGame[] = [];
    let sortedDate: PlayoffGame[] = [];

    if (allPlayoffGames()) {
      allPlayoffGames().forEach((game) => {
        if (game.divisionId === this.selectedDivision()!.divisionId!) {
          // let game = allPlayoffGames[i];
          games.push(game);
        }
      });
    }
    games.sort();
    sortedDate = games.sort((a, b) => {
      return this.compare(a.gameDate!, b.gameDate!, true);
    });
    this.divisionPlayoffGames.update(() => sortedDate);
    // console.log(sortedDate);
    // console.log(this.divisionPlayoffGames());
  }
  groupPlayoffGamesByDate(games: PlayoffGame[]): PlayoffGame[][] {
    const groupedGames: { [key: string]: PlayoffGame[] } = {};
    if (!games || games.length === 0) {
      return [];
    }
    games.forEach((game) => {
      const gameDate = new Date(game.gameDate);
      const dateKey = gameDate.toLocaleDateString('en-CA');
      if (!groupedGames[dateKey]) {
        groupedGames[dateKey] = [];
      }
      groupedGames[dateKey].push(game);
    });
    return Object.values(groupedGames); // Convert the object to an array of arrays
  }
  compare(a: Date | string, b: Date | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // Create a new playoff game
  create(game: PlayoffGame): import('rxjs').Observable<PlayoffGame> {
    const url = `${Constants.BASE_URL}/api/SchedulePlayoff`;
    return this.http.post<PlayoffGame>(
      url,
      this.toApiModel(game),
      this.#dataService.httpOptions
    );
  }

  // Update an existing playoff game using composite keys
  update(game: PlayoffGame): import('rxjs').Observable<void> {
    if (!game || game.scheduleNumber == null || game.gameNumber == null) {
      throw new Error(
        'Cannot update playoff game: missing scheduleNumber or gameNumber'
      );
    }
    const url = `${Constants.BASE_URL}/api/SchedulePlayoff/${game.scheduleNumber}/${game.gameNumber}`;
    return this.http.put<void>(
      url,
      this.toApiModel(game),
      this.#dataService.httpOptions
    );
  }

  // Map UI model to API contract (SchedulePlayoff)
  private toApiModel(game: PlayoffGame) {
    return {
      schedulePlayoffId: 0,
      scheduleNumber: game.scheduleNumber,
      gameNumber: game.gameNumber,
      locationNumber: game.locationNumber ?? null,
      gameDate: game.gameDate ?? null,
      gameTime: game.gameTime ? this.formatTime(game.gameTime) : '',
      visitingTeam: game.visitingTeam ?? '',
      homeTeam: game.homeTeam ?? '',
      descr: game.descr ?? '',
      visitingTeamScore: game.visitingTeamScore ?? null,
      homeTeamScore: game.homeTeamScore ?? null,
      divisionId: game.divisionId ?? 0,
    };
  }

  private formatTime(date: Date): string {
    // Format as HH:mm:ss to match backend string time
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
  }

  // Normalize API object keys (PascalCase) to our UI model (camelCase) and parse dates
  private normalizeApiPlayoffGame(raw: any): PlayoffGame {
    const scheduleNumber = raw?.scheduleNumber ?? raw?.ScheduleNumber ?? 0;
    const gameNumber = raw?.gameNumber ?? raw?.GameNumber ?? 0;
    const divisionId = raw?.divisionId ?? raw?.DivisionId;
    const locationNumber = raw?.locationNumber ?? raw?.LocationNumber;
    const locationName = raw?.locationName ?? raw?.LocationName;
    const descr = raw?.descr ?? raw?.Descr;
    const homeTeam = raw?.homeTeam ?? raw?.HomeTeam;
    const visitingTeam = raw?.visitingTeam ?? raw?.VisitingTeam;
    const homeTeamScore = raw?.homeTeamScore ?? raw?.HomeTeamScore;
    const visitingTeamScore = raw?.visitingTeamScore ?? raw?.VisitingTeamScore;

    const dateStr: string | undefined = raw?.gameDate ?? raw?.GameDate;
    const timeStr: string | undefined = raw?.gameTime ?? raw?.GameTime;

    const gameDate = dateStr
      ? new Date(dateStr)
      : (undefined as unknown as Date);
    let gameTime: Date | undefined = undefined;
    if (timeStr) {
      if (/T/.test(timeStr)) {
        // Already a full ISO-like string
        gameTime = new Date(timeStr);
      } else if (dateStr) {
        // Combine date and time into a Date
        gameTime = new Date(`${dateStr}T${timeStr}`);
      }
    }

    return {
      scheduleNumber,
      gameNumber,
      descr,
      divisionId,
      gameId: raw?.gameId ?? raw?.GameId,
      locationNumber,
      gameDate: gameDate as Date,
      gameTime,
      homeTeam,
      visitingTeam,
      homeTeamScore,
      visitingTeamScore,
      locationName,
    } as PlayoffGame;
  }

  // Update the selected record for editing
  updateSelectedRecord(record: PlayoffGame | null) {
    this._selectedRecord.set(record);
  }
}
export interface PlayoffGameResponse {
  count: number;
  next: string;
  previous: string;
  results: PlayoffGame[];
}
