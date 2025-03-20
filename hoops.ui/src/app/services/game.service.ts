import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { delay, map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { DateTime } from 'luxon';

import { DataService } from './data.service';

import { RegularGame } from '../domain/regularGame';
import { rxResource } from '@angular/core/rxjs-interop';
import { Constants } from '@app/shared/constants';
import { setErrorMessage } from '@app/shared/error-message';
import { Division } from '@app/domain/division';
import * as fromGames from '../games/state';
import * as gameActions from '../games/state/games.actions';
import * as fromUser from '@app/user/state';
import { select, Store } from '@ngrx/store';
import { Team } from '@app/domain/team';
import { User } from '@app/domain/user';
import { SeasonService } from './season.service';
import { DivisionService } from './division.service';
import { LoggerService } from './logging.service';
import { AuthService } from './auth.service';
import { Standing } from '@app/domain/standing';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // Injected services
  readonly #http = inject(HttpClient);
  gameStore = inject(Store<fromGames.State>);

  public dataService = inject(DataService);
  readonly #seasonService = inject(SeasonService);
  readonly #divisionService = inject(DivisionService);
  readonly #authService = inject(AuthService);
  readonly #logger = inject(LoggerService);
  readonly #scheduleGamesUrl = Constants.SEASON_GAMES_URL + '?seasonid=' + this.#seasonService.selectedSeason.seasonId;
  private _games!: RegularGame[];
  standing: any[] = [];
  divisionStandings = signal<Standing[]>([]);
  currentDivision$: Observable<Division | null> = of(null);
  filteredGames = signal<RegularGame[]>([]);
  currentUser = computed(() => this.#authService.currentUser());
  selectedSeason = computed(() => this.#seasonService.selectedSeason);
  selectedDivision = computed(() => this.#divisionService.selectedDivision());
  seasonGames$: Observable<RegularGame[] | null> = of(null);
  allGames: any;
  get games () {
    return this._games;
  }
  set games (games: RegularGame[]) {
    this._games = games;
  }
  standingsUrl = this.dataService.webUrl + '/api/gameStandings';

  teamId: number | undefined;
  compare (a: Date | string, b: Date | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // signals
  private selectedRecord = signal<RegularGame | null>(null);
  // Expose the selected record signal
  selectedRecordSignal = this.selectedRecord.asReadonly();

  seasonGamesSignal = signal<RegularGame[] | null>(null);


  public currentTeamId: string | undefined;

  // Signals managed by the service
  selectedGames = signal<RegularGame | undefined>(undefined);
  private games$ = this.#http.get<GameResponse>(this.#scheduleGamesUrl).pipe(
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
  dailySchedule = signal<RegularGame[][]>([]);
  constructor () {
    // this._gameUrl = this.dataService.webUrl + '/api/gameschedule';

    effect(() => {
      const record = this.selectedRecord();
      if (record !== null) {
        console.log(`Record updated: ${ record.scheduleGamesId }`);
        // Optionally trigger additional logic here
      }
    });

    effect(() => {
      const selectedSeason = this.selectedSeason();
      if (selectedSeason) {
        console.log(selectedSeason);
        this.fetchSeasonGames();
      }
    });

    effect(() => {
      const selectedDivision = this.selectedDivision();
      if (selectedDivision) {
        console.log(selectedDivision);
        // this.gameStore.dispatch(new gameActions.LoadDivisionGames());
        // this.gameService.currentDivision$
        const test = this.filterGamesByDivision();
        this.filteredGames.update(() => test);
        const dailyGames = this.groupRegularGamesByDate(this.filteredGames());
        this.dailySchedule.update(() => dailyGames);
        this.fetchStandingsByDivision();
      }
    });
  }

  getGames (): Observable<RegularGame[]> {
    return this.#http
      .get<RegularGame[]>(this.#scheduleGamesUrl)
      .pipe(
        map(response => this.games),
        // tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.dataService.handleError('getGames', []))
      );
  }
  fetchSeasonGames () {
    // console.log(this.#scheduleGamesUrl);
    this.#http.get<RegularGame[]>(Constants.SEASON_GAMES_URL + '?seasonId=' + this.#seasonService.selectedSeason.seasonId).
      subscribe(
        (games) => {
          this.seasonGames$ = of(games);
          this.seasonGamesSignal.set(games);
          // console.log(games);
        }
      );
  }
  filterGamesByDivision (): RegularGame[] {
    let games: RegularGame[] = [];
    let filteredGamesByDate: RegularGame[] = [];
    let div = 0;
    // const division = this.#divisionService.selectedDivision();
    // this.currentDivision$.subscribe((division) => {
    // console.log(division);
    div = this.selectedDivision()?.divisionId ?? 0;
    // this.seasonGames$.subscribe((seasonGames) => {
    // console.log(this.seasonGamesSignal());
    this.allGames = this.seasonGamesSignal();
    // this.setCanEdit(div);
    if (this.seasonGamesSignal()) {
      for (let i = 0; i < this.seasonGamesSignal()!.length; i++) {
        if (this.seasonGamesSignal()![i].divisionId === div) {
          let game = this.seasonGamesSignal()![i];
          game.gameDateOnly = this.extractDate(game.gameDate.toString());
          games.push(game);
        }
      }
      games.sort();
      filteredGamesByDate = games.sort((a, b) => {
        return this.compare(a.gameDate!, b.gameDate!, true);
      });
      return filteredGamesByDate;
    }
    return filteredGamesByDate;
    //   });
    // });
    return filteredGamesByDate;
  }


  getStandings (): Observable<RegularGame[]> {
    return this.#http
      .get<any[]>(this.#scheduleGamesUrl)
      .pipe(
        map(response => this.games = response),
        // tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.dataService.handleError('getStandings', []))
      );
  }

  getStandingsByDivision (divisionId: number) {
    return this.#http
      .get<any[]>(Constants.GET_STANDINGS_URL + '?divisionId=' + divisionId)
      .pipe(
        map((response) => (this.standing = response))
        // tap(data => console.log('All: ' + JSON.stringify(data))),
        // catchError(this.handleError)
      );
  }
  fetchStandingsByDivision () {
    this.getStandingsByDivision(this.selectedDivision()!.divisionId).subscribe((standings) => {
      if (standings) {
        this.divisionStandings.update(() => standings);
      } else {
        this.divisionStandings.update(() => []);
      }
    });
  }

  groupRegularGamesByDate (games: RegularGame[]): RegularGame[][] {
    const groupedGames: { [key: string]: RegularGame[] } = {};
    games.forEach(game => {
      const gameDate = new Date(game.gameDate);
      const dateKey = gameDate.toLocaleDateString("en-CA");
      if (!groupedGames[dateKey]) {
        groupedGames[dateKey] = [];
      } groupedGames[dateKey].push(game);
    });
    return Object.values(groupedGames); // Convert the object to an array of arrays
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

  // public filterGamesByTeam (allGames: RegularGame[], teamId: number): RegularGame[] {
  //   let games: RegularGame[] = [];
  //   if (allGames) {
  //     for (let i = 0; i < allGames.length; i++) {
  //       if (
  //         allGames[i].visitingTeamNumber === teamId ||
  //         allGames[i].homeTeamNumber === teamId
  //       ) {
  //         games.push(allGames[i]);
  //       }
  //     }
  //   }
  //   return games;
  // }

  public filterGamesByTeam (currentTeam: Team | undefined): Observable<RegularGame[]> {
    let teamId = currentTeam?.teamId;
    this.gameStore.pipe(select(fromGames.getGames)).subscribe((g) => {
      this.allGames = g;
    });
    let games: RegularGame[] = [];
    if (this.allGames) {
      for (let i = 0; i < this.allGames.length; i++) {
        if (
          this.allGames[i].visitingTeamId === teamId ||
          this.allGames[i].homeTeamId === teamId
        ) {
          games.push(this.allGames[i]);
        }
      }
    }
    let sortedDate = games.sort((a, b) => {
      return this.compare(a.gameDate as Date, b.gameDate as Date, true);
    });
    console.log(games);
    return of(games);
  }

  updateSelectedRecord (record: RegularGame) {
    this.selectedRecord.set(record);
  }

  getCanEdit (user: User | undefined, divisionId: number): boolean {
    // console.log(divisionId);
    let tFlag = false;
    if (user) {
      if (user.userType === 2 || user.userType === 3) {
        tFlag = true;
        return true;
      } else {
        if (user.divisions) {
          let found = user.divisions.find(
            (div) => div.divisionId === divisionId
          );
          return found !== undefined;
        }
      }
    }
    return tFlag;
  }

  setCanEdit (division: number) {
    let canEdit = this.getCanEdit(this.currentUser(), division);
    this.gameStore.dispatch(new gameActions.SetCanEdit(canEdit));
  }
  extractDate (date: string): Date {
    return DateTime.fromISO(date).toJSDate();
  }
  saveGame ({
    game,
    homeTeamScore,
    visitingTeamScore,
  }: {
    game: RegularGame;
    homeTeamScore: any;
    visitingTeamScore: any;
  }) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    game.homeTeamScore = homeTeamScore;
    game.visitingTeamScore = visitingTeamScore;
    console.log(game);
    const gameUrl = this.dataService.webUrl + '/api/games/updateScores';
    console.log(gameUrl);
    let result = this.#http
      .put(gameUrl, game, httpOptions)
      .subscribe((x) => console.log(x));
    // .pipe(
    //   tap(data => console.log(data)),
    //   catchError(this.dataService.handleError)
    // );
  }
  validateScores (homeTeamScore: any, visitorTeamScore: any) {
    //validate scores
    return true;
  }
}
export interface GameResponse {
  count: number;
  next: string;
  previous: string;
  results: RegularGame[]
}
