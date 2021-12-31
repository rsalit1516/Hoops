import { Injectable } from '@angular/core';
import { Observable, of, combineLatest, throwError, pipe, from } from 'rxjs';
import { Division } from '@app/domain/division';
import { map, tap, catchError, shareReplay, distinct, toArray, mergeMap, groupBy } from 'rxjs/operators';
import { DataService } from '@app/services/data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Game } from '@app/domain/game';
import * as fromGames from './state';
import * as gameActions from './state/games.actions';
import * as fromUser from '@app/user/state';
import { Store, select } from '@ngrx/store';
import { User } from '@app/domain/user';
import { TeamService } from '@app/services/team.service';
import { Team } from '@app/domain/team';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  seasonId: number | undefined; // = 2192; // TO DO make this is passed in!
  currentSeason$ = this.store.select(fromGames.getCurrentSeason).subscribe({
    next: (season) => {
      // console.log(season);
      if (season !== undefined && season !== null) {
        this.seasonId = season.seasonId;
      }
    },
  });
  handleError: ((err: any, caught: Observable<any[]>) => never) | undefined;

  private gameUrl =
    this.dataService.webUrl + '/api/Schedulegame/getSeasonGames';
  //    this.seasonId;
  private standingsUrl =
    this.dataService.webUrl + '/api/ScheduleGame/getStandings';
  // private divisionUrl = this.dataService.webUrl + '/api/divisions';
  private divisionUrl =
    this.dataService.webUrl + '/api/division/GetSeasonDivisions/' + '4111';
  // this.seasonId;
  private divisionStartUrl =
    this.dataService.webUrl + '/api/division/GetSeasonDivisions';
  games: Game[] | undefined;
  divisionId: number | undefined;
  teamId: number | undefined;
  allGames: Game[] | undefined;
  standing: any[] | undefined;
  // divisions$: Observable<Division>;
  games$ = this.http.get<Game[]>(this.dataService.seasonGamesUrl + '?seasonId=' + '2203').pipe(
    // tap((data) => console.log("All games: " + JSON.stringify(data))),
    shareReplay(1)
    // catchError()
  );

  divisions$ = this.store.select(fromGames.getDivisions);

  vm$ = combineLatest([this.games$, this.divisions$]).pipe(
    map(([games, divisions]) => ({ games, divisions }))
  );
  currentDivision$ = this.store
    .pipe(select(fromGames.getCurrentDivision))
    .subscribe((division): number | undefined => {
      return division !== undefined
        ? // console.log(division);
          (this.divisionId = division.divisionId)
        : undefined;
    });
  allGames$ = this.store.pipe(
    select(fromGames.getGames)
    // tap((data) => console.log(data))
  );
  selectedDivision$ = this.store.pipe(
    select(fromGames.getCurrentDivision),
    map((division) => {
      this.divisionId = division?.divisionId;
      // this.getStandingsByDivision(divisionId);
    })
    // tap((data) => console.log("Division", JSON.stringify(data)))
  );
  divisionGames$ = this.games$.pipe(
    map((games) => games.filter((game) => game.divisionId === this.divisionId))
  );
  gameDivisions$ = this.http.get<Division[]>(this.divisionUrl).pipe(
    // tap((data) => console.log("Divisions", JSON.stringify(data))),
    shareReplay(1)
    // catchError(this.handleError)
  );
  divisions: Division[] | undefined;
  user: User | undefined;
  // divisionGames$ = this.allGames$.pipe(
  //   map(games => this.getDivisionGames(games, this.divisionId))
  // );

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private store: Store<fromGames.State>,
    private userStore: Store<fromUser.State>
  ) {
    this.getCurrentSeason();
  }

  private getDivisionGames(games: Game[], divisionId: number) {
    let g: Game[] = [];
    // console.log(divisionId);
    // console.log(games);
    for (let i = 0; i < games.length; i++) {
      // console.log("looking for a match");
      // console.log(games[i].divisionId);
      if (games[i].divisionId === divisionId) {
        g.push(games[i]);
        // console.log("got a match");
      }
    }
    console.log(g);
    return g;
  }
  getGames(): Observable<Game[]> {
    const divId = fromGames.getCurrentDivisionId;
    return this.http.get<Game[]>(this.dataService.seasonGamesUrl + this.currentSeason$).pipe(
      map((response) => (this.games = response))
      // tap(data => console.log('All: ' + JSON.stringify(data))),
      // catchError(this.handleError)
    );
  }

  // getGame(id: number): Observable<Game> {
  //   return this.getGames().pipe(
  //     map((content: Game[]) => content.find(p => p.gameId === id))
  //   );
  // }

  filterGamesByDivision(div: number): Observable<Game[]> {
    let games: Game[] = [];
    let sortedDate: Game[] = [];
    this.store.pipe(select(fromGames.getGames)).subscribe((allGames) => {
      this.allGames = allGames;
      this.setCanEdit(div);
      if (allGames) {
        for (let i = 0; i < this.allGames.length; i++) {
          if (this.allGames[i].divisionId === div) {
            let game = allGames[i];
            // console.log(game);
            // if (allGames[i].homeTeamScore === -1) allGames[i].homeTeamScore = 0;
            // if (game.homeTeamScore === -1) game.homeTeamScore = 0;
            // if (game.visitingTeamScore === -1) game.visitingTeamScore = 0;
            games.push(game);
          }
        }
        games.sort();
        sortedDate = games.sort((a, b) => {
          return this.compare(a.gameDate!, b.gameDate!, true);
        });
        return of(sortedDate);
      }
      return of(sortedDate);
    });
    return of(sortedDate);
  }

  public filterGamesByTeam(currentTeam: Team | undefined): Observable<Game[]> {
    let teamId = currentTeam?.teamId;
    this.store.pipe(select(fromGames.getGames)).subscribe((g) => {
      this.allGames = g;
    });
    let games: Game[] = [];
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

  groupByDate(games: Game[]) {
    const source = from(games);
    const gDate = source.pipe(
      map(s => (s.gameDate = moment(s.gameDate).toDate()))
    );

    const gamesByDate = source.pipe(
      groupBy(game =>
        moment(game.gameDate).format(moment.HTML5_FMT.DATE)
        ),
      mergeMap(group => group.pipe(toArray()))
    );
    return gamesByDate;
  }

  private sort(a: any, b: any) {
    return this.compare(a.gameDate, b.gameDate, true);
  }

  compare(a: Date | string, b: Date | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  getCurrentSeason() {
    return this.store.select(fromGames.getCurrentSeason).subscribe((season) => {
      if (season !== null) {
        this.seasonId = season.seasonId;
        // console.log(season);
      }
    });
  }
  getDivisions(seasonId: number) {
    //this.seasonId = season.seasonID;
    return this.http
      .get<Division[]>(this.divisionStartUrl + '/' + seasonId)
      .pipe(
        map((response) => (this.divisions = response)),
        shareReplay(1)
        // tap(data => console.log('All: ' + JSON.stringify(data))),
        // tap(divisions => gameActions.gameActionTypes.SetCurrentDivision = ),
        // catchError(this.handleError)
      );
  }

  getDistinctDates(filteredGames: Game[]): Observable<(Date | undefined)[]> {
    return from(filteredGames).pipe(
      map((g) => g.gameDate),
      distinct(),
      toArray()
    );
  }

  standingsByDivision$ = combineLatest([this.currentDivision$]).pipe();
  getStandingsByDivision(divisionId: number) {
    return this.http
      .get<any[]>(this.standingsUrl + '?divisionId=' + divisionId)
      .pipe(
        map((response) => (this.standing = response))
        // tap(data => console.log('All: ' + JSON.stringify(data))),
        // catchError(this.handleError)
      );
  }
  getCanEdit(user: User | undefined, divisionId: number): boolean {
    // console.log(divisionId);
    let tFlag = false;
    if (user) {
      if (user.userType === 3) {
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

  setCanEdit(division: number) {
    this.store.pipe(select(fromUser.getCurrentUser)).subscribe((user) => {
      let canEdit = this.getCanEdit(user, division);
      this.store.dispatch(new gameActions.SetCanEdit(canEdit));
    });
  }

  validateScores(homeTeamScore: any, visitorTeamScore: any) {
    //validate scores
    return true;
  }
  saveGame({
    game,
    homeTeamScore,
    visitingTeamScore,
  }: {
    game: Game;
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
    // + game;
    console.log(gameUrl);
    let result = this.http
      .put(gameUrl, game, httpOptions)
      .subscribe((x) => console.log(x));
    // .pipe(
    //   tap(data => console.log(data)),
    //   catchError(this.dataService.handleError)
    // );
  }
}
