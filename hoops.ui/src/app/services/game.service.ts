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
import { TeamService } from './team.service';
import { RegularGameSaveObject } from '@app/domain/RegularGameSaveObject';

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
  readonly #teamService = inject(TeamService);
  readonly #authService = inject(AuthService);
  readonly #logger = inject(LoggerService);
  readonly #scheduleGamesUrl = Constants.SEASON_GAMES_URL + '?seasonid=' + this.#seasonService.selectedSeason.seasonId;
  private _games!: RegularGame[];
  standing: any[] = [];
  divisionStandings = signal<Standing[]>([]);
  currentDivision$: Observable<Division | null> = of(null);
  divisionGames = signal<RegularGame[]>([]);
  currentUser = computed(() => this.#authService.currentUser());
  selectedSeason = computed(() => this.#seasonService.selectedSeason);
  selectedDivision = computed(() => this.#divisionService.selectedDivision);
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
  private _selectedGame = signal<RegularGame | null>(null);
  // Expose the selected record signal
  get selectedGame () {
    return this._selectedGame();
  }
  updateSelectedGame (record: RegularGame) {
    this._selectedGame.set(record);
  }

  selectedRecordSignal = this._selectedGame.asReadonly();

  private _seasonGames = signal<RegularGame[] | null>(null);

  get seasonGames () {
    return this._seasonGames();
  }
  updateSeasonGames (games: RegularGame[]) {
    this._seasonGames.set(games);
  }
  seasonGamesCount = computed(() => this.seasonGames ? this.seasonGames.length : 0);
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
  selectedTeam = computed(() => this.#teamService.selectedTeam);
  teamGames = signal<RegularGame[]>([]);
  constructor () {
    effect(() => {
      const record = this.selectedGame;
      if (record !== null) {
        console.log(`Record updated: ${ record.scheduleGamesId }`);
        // Optionally trigger additional logic here
      }
    });

    effect(() => {
      const selectedSeason = this.selectedSeason();
      if (selectedSeason) {
        this.fetchSeasonGames();
      }
    });

    effect(() => {
      const selectedDivision = this.selectedDivision();
      console.log(this.#divisionService.selectedDivision);
      if (this.#divisionService.selectedDivision!) {
        const filteredGames = this.filterGamesByDivision();
        this.divisionGames.update(() => filteredGames);
        const dailyGames = this.groupRegularGamesByDate(this.divisionGames());
        this.dailySchedule.update(() => dailyGames);
        this.fetchStandingsByDivision();
      }
    });
    effect(() => {
      //      console.log(this.selectedTeam());
      this.filterGamesByTeam();
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
          // this.seasonGames$ = of(games);
          this.updateSeasonGames(games);
          console.log(games);
        }
      );
  }
  filterGamesByDivision (): RegularGame[] {
    let games: RegularGame[] = [];
    let filteredGamesByDate: RegularGame[] = [];
    const divisionId = this.selectedDivision()?.divisionId ?? 0;
    if (this.seasonGames) {
      for (let i = 0; i < this.seasonGames!.length; i++) {
        if (this.seasonGames![i].divisionId === divisionId) {
          let game = this.seasonGames![i];
          game.gameDateOnly = this.extractDate(game.gameDate.toString());
          games.push(game);
        }
      }
      games.sort();
      filteredGamesByDate = games.sort((a, b) => {
        return this.compare(a.gameDate!, b.gameDate!, true);
      });
      // this.divisionGames.update(() => filteredGamesByDate);
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

  public filterGamesByTeam (): Observable<RegularGame[]> {
    if (!this.selectedTeam()) {
      return of([]);
    }
    let teamId = this.selectedTeam()!.teamId;

    let games: RegularGame[] = [];
    if (this.seasonGames) {
      for (let i = 0; i < this.seasonGames!.length; i++) {
        if (
          (this.seasonGames as RegularGame[])[i].visitingTeamId === teamId ||
          (this.seasonGames as RegularGame[])[i].homeTeamId === teamId
        ) {
          games.push((this.seasonGames as RegularGame[])[i]);
        }
      }
    }
    let sortedDate = games.sort((a, b) => {
      return this.compare(a.gameDate as Date, b.gameDate as Date, true);
    });
    //console.log(games);
    this.teamGames.update(() => games);
    return of(games);
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
  saveExistingGame (game: RegularGameSaveObject) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const gameUrl = Constants.PUT_SEASON_GAME_URL + game.scheduleGamesId;
    console.log(gameUrl);
    let result = this.#http
      .put(gameUrl, game, httpOptions)
      .subscribe((x) => console.log(x));
    // .pipe(
    //   tap(data => console.log(data)),
    //   catchError(this.dataService.handleError)
    // );
    // this.gameStore.dispatch(new gameActions.UpdateGame(game));
  }
  saveNewGame (game: RegularGameSaveObject) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const gameUrl = Constants.POST_SEASON_GAME_URL;
    console.log(gameUrl);
    let result = this.#http
      .post(gameUrl, game, httpOptions)
      .subscribe((x) => console.log(x));
    // .pipe(
    //   tap(data => console.log(data)),
    //   catchError(this.dataService.handleError)
    // );
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
