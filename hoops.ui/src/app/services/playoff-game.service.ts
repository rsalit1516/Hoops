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
  providedIn: 'root'
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
  selectedDivision = computed(() => this.#divisionService.selectedDivision);
  dailyPlayoffSchedule = signal<PlayoffGame[][]>([]);


  constructor () {
    effect(() => {
      if (this.selectedSeason() !== undefined) {
        this.fetchSeasonPlayoffGames();
      }
    });
    effect(() => {
      if (this.selectedDivision() !== undefined) {
        this.getDivisionPlayoffGames();
        const dailyGames = this.groupPlayoffGamesByDate(this.divisionPlayoffGames()!);
        this.dailyPlayoffSchedule.update(() => dailyGames);
      }
    });
  }

  getSeasonPlayoffGames (): Observable<PlayoffGame[] | null> {
    if (this.#seasonService.selectedSeason === undefined) {
      return of(null);
    } else {
      const url = Constants.PLAYOFF_GAMES_URL + '?seasonId=' + this.#seasonService.selectedSeason!.seasonId;
      return this.http.get<PlayoffGame[]>(url).pipe(
        // map((response) => (this.seasonPlayoffGames = response)),
        tap((data) => console.log('All: ' + JSON.stringify(data.length))),
        catchError(this.#dataService.handleError('getCurrentSeason', null))
      );
    }
  }
  fetchSeasonPlayoffGames () {
    if (this.selectedSeason() === undefined) {
      return;
    }
    this.getSeasonPlayoffGames().subscribe((playoffGames) => {
      if (playoffGames) {
        this.seasonPlayoffGames.update(() => playoffGames);
      }
    });
    // console.log(this.seasonPlayoffGames());
  }
  getDivisionPlayoffGames (): void {
    const allPlayoffGames = this.seasonPlayoffGames
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
  groupPlayoffGamesByDate (games: PlayoffGame[]): PlayoffGame[][] {
    const groupedGames: { [key: string]: PlayoffGame[] } = {};
    if (!games || games.length === 0) {
      return [];
    }
    games.forEach(game => {
      const gameDate = new Date(game.gameDate);
      const dateKey = gameDate.toLocaleDateString("en-CA");
      if (!groupedGames[dateKey]) {
        groupedGames[dateKey] = [];
      } groupedGames[dateKey].push(game);
    });
    return Object.values(groupedGames); // Convert the object to an array of arrays
  }
  compare (a: Date | string, b: Date | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
export interface PlayoffGameResponse {
  count: number;
  next: string;
  previous: string;
  results: PlayoffGame[]
}
