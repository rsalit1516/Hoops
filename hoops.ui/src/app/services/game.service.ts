import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { delay, map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

import { DataService } from './data.service';

import { RegularGame } from '../domain/regularGame';
import { rxResource } from '@angular/core/rxjs-interop';
import { Constants } from '@app/shared/constants';
import { setErrorMessage } from '@app/shared/error-message';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // Injected services
  private http = inject(HttpClient);

  private scheduleGamesUrl = Constants.SEASON_GAMES_URL;
  private _games!: RegularGame[];
  get games () {
    return this._games;
  }
  set games (games: RegularGame[]) {
    this._games = games;
  }
  standingsUrl: string;

  // signals
  private selectedRecord = signal<RegularGame | null>(null);
  // Expose the selected record signal
  selectedRecordSignal = this.selectedRecord.asReadonly();

  public currentTeamId: string | undefined;

  // Signals managed by the service
  selectedGames = signal<RegularGame | undefined>(undefined);
  private games$ = this.http.get<GameResponse>(this.scheduleGamesUrl).pipe(
    map(vr =>
      vr.results.map((v) => ({
        ...v,
      }) as RegularGame)
    ),
    delay(2000)
  );
  private gamesResource = rxResource({
    loader: () => this.games$
  });

  scheduleGames = computed(() => this.gamesResource.value() ?? [] as RegularGame[]);
  error = computed(() => this.gamesResource.error() as HttpErrorResponse);
  errorMessage = computed(() => setErrorMessage(this.error(), 'Game'));
  isLoading = this.gamesResource.isLoading;

  constructor (private _http: HttpClient, public dataService: DataService) {
    // this._gameUrl = this.dataService.webUrl + '/api/gameschedule';
    this.standingsUrl = this.dataService.webUrl + '/api/gameStandings';
    effect(() => {
      const record = this.selectedRecord();
      console.log('Selected record changed:', record);
      if (record !== null) {
        console.log(`Record updated: ${ record.scheduleGamesId }`);
        // Optionally trigger additional logic here
      }
    });
  }

  getGames (): Observable<RegularGame[]> {
    return this._http
      .get<RegularGame[]>(this.scheduleGamesUrl)
      .pipe(
        map(response => this.games),
        // tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.dataService.handleError('getGames', []))
      );
  }

  // getGame(id: number): Observable<Game> {
  //     return this.getGames()
  //         .pipe(
  //             map((content: Game[]) =>
  //                 content.find(p => p.gameId === id)
  //         )
  //       );
  // }

  getStandings (): Observable<RegularGame[]> {
    return this._http
      .get<any[]>(this.scheduleGamesUrl)
      .pipe(
        map(response => this.games = response),
        // tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.dataService.handleError('getStandings', []))
      );
  }
  // filterGamesByDivision(allGames: Game[], divisionId: number): Game[] {
  //   let games: Game[] = [];
  //   // console.log(divisionId);

  //   // console.log(allGames);
  //   if (allGames) {
  //     for (let i = 0; i < allGames.length; i++) {
  //       // console.log(allGames[i].divisionID);
  //       if ( allGames[i].divisionId === divisionId ) {
  //         games.push(allGames[i]);
  //       }
  //     }
  //   }
  //   return games;
  // }

  public filterGamesByTeam (allGames: RegularGame[], teamId: number): RegularGame[] {
    let games: RegularGame[] = [];
    if (allGames) {
      for (let i = 0; i < allGames.length; i++) {
        if (
          allGames[i].visitingTeamNumber === teamId ||
          allGames[i].homeTeamNumber === teamId
        ) {
          games.push(allGames[i]);
        }
      }
    }
    return games;
  }

  updateSelectedRecord (record: RegularGame) {
    this.selectedRecord.set(record);
  }
}
export interface GameResponse {
  count: number;
  next: string;
  previous: string;
  results: RegularGame[]
}
