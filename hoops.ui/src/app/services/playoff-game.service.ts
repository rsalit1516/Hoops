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
  private readonly seasonService = inject(SeasonService);
  readonly #dataService = inject(DataService);

  divisionPlayoffGames = signal<PlayoffGame[] | undefined>(undefined);
  seasonId: number | undefined; // = 2192; // TO DO make this is passed in!
  seasonPlayoffGames = signal<PlayoffGame[]>([]);
  allPlayoffGames: PlayoffGame[] | undefined;
  playoffGames$: Observable<PlayoffGame[]> | undefined;
  selectedSeason = computed(() => this.seasonService.selectedSeason);
  selectedDivision = computed(() => this.#divisionService.selectedDivision());
  dailyPlayoffSchedule = signal<PlayoffGame[][]>([]);
  // Selected record for edit/detail view
  private _selectedRecord = signal<PlayoffGame | null>(null);
  selectedRecordSignal = this._selectedRecord.asReadonly();

  constructor() {
    effect(() => {
      const season = this.seasonService.selectedSeason();
      if (season && season.seasonId && season.seasonId > 0) {
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
    if (this.seasonService.selectedSeason === undefined) {
      return of(null);
    } else {
      const url =
        Constants.PLAYOFF_GAMES_URL +
        '?seasonId=' +
        this.seasonService.selectedSeason()!.seasonId;
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

  // Update an existing playoff game: prefer PK, fallback to composite keys
  update(game: PlayoffGame): import('rxjs').Observable<void> {
    // Prefer primary-key updates via by-id endpoint
    const id = (game as any).schedulePlayoffId as number | undefined;
    if (id) {
      const url = `${Constants.BASE_URL}/api/SchedulePlayoff/by-id/${id}`;
      return this.http.put<void>(
        url,
        this.toApiModel(game),
        this.#dataService.httpOptions
      );
    }
    // Fallback: composite keys
    if (game.scheduleNumber == null || game.gameNumber == null) {
      throw new Error(
        'Cannot update playoff game: missing primary key and composite keys'
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
      // Include if present; backend uses route id for by-id updates
      schedulePlayoffId: (game as any).schedulePlayoffId ?? 0,
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
    // Format as HH:mm:ss AM/PM to match backend expected format
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    return date.toLocaleTimeString('en-US', options);
  }

  private convertAmPmTo24Hour(timeStr: string): string {
    // Convert "06:00:00 PM" to "18:00:00"
    const [time, period] = timeStr.trim().split(/\s+/);
    const [hours, minutes, seconds] = time.split(':').map(Number);

    let hour24 = hours;
    if (period?.toUpperCase() === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (period?.toUpperCase() === 'AM' && hours === 12) {
      hour24 = 0;
    }

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hour24)}:${pad(minutes)}:${pad(seconds || 0)}`;
  }

  // Normalize API object keys (PascalCase) to our UI model (camelCase) and parse dates
  private normalizeApiPlayoffGame(raw: any): PlayoffGame {
    const schedulePlayoffId = raw?.schedulePlayoffId ?? raw?.SchedulePlayoffId;
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
        // Handle time format like "06:00:00 PM" or "HH:mm:ss"
        let timeToProcess = timeStr;

        // If it contains AM/PM, parse it directly
        if (/[AP]M/i.test(timeStr)) {
          // Create a date with today's date and the time string
          const today = new Date().toISOString().split('T')[0];
          gameTime = new Date(`${today}T${this.convertAmPmTo24Hour(timeStr)}`);
        } else {
          // Assume 24-hour format, combine with date
          gameTime = new Date(`${dateStr}T${timeStr}`);
        }
      }
    }

    const model: PlayoffGame & { schedulePlayoffId?: number } = {
      // Not part of PlayoffGame class but we can tack it on for reference using type assertion
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
      schedulePlayoffId,
    };
    return model;
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
