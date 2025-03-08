import { inject, Injectable } from '@angular/core';
import { Observable, of, combineLatest, from } from 'rxjs';
import { Division } from '@app/domain/division';
import {
  map,
  tap,
  shareReplay,
  distinct,
  toArray,
} from 'rxjs/operators';
import { DataService } from '@app/services/data.service';
import { Constants } from '@app/shared/constants';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegularGame } from '@app/domain/regularGame';
import * as fromGames from './state';
import * as gameActions from './state/games.actions';
import * as fromUser from '@app/user/state';
import { Store, select } from '@ngrx/store';
import { User } from '@app/domain/user';
import { Team } from '@app/domain/team';
import { DateTime } from 'luxon';
import { PlayoffGame } from '@app/domain/playoffGame';
import { LoggerService } from '@app/services/logging.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  dataService = inject(DataService);
  gameStore = inject(Store<fromGames.State>);
  http = inject(HttpClient);
  userStore = inject(Store<fromUser.State>);
  logger = inject(LoggerService);
  seasonId: number | undefined; // = 2192; // TO DO make this is passed in!
  currentSeason$ = this.gameStore.select(fromGames.getCurrentSeason).subscribe({
    next: (season) => {
      // console.log(season);
      if (season !== undefined && season !== null) {
        this.seasonId = season.seasonId;
      }
    },
  });
  handleError: ((err: any, caught: Observable<any[]>) => never) | undefined;

  games: RegularGame[] | undefined;
  divisionId: number | undefined;
  teamId: number | undefined;
  allGames: RegularGame[] | undefined;
  allPlayoffGames: PlayoffGame[] | undefined;
  standing: any[] | undefined;
  // divisions$: Observable<Division>;
  seasonGames$: Observable<RegularGame[]>;

  divisions$ = this.gameStore.select(fromGames.getDivisions);

  // vm$ = combineLatest([this.games$, this.divisions$]).pipe(
  //   map(([games, divisions]) => ({ games, divisions }))
  // );
  // currentDivision$ = this.gameStore
  //   .pipe(select(fromGames.getCurrentDivision));
  // // .subscribe((division): number | undefined => {
  // //   return division !== undefined
  // //     ? (this.divisionId = division.divisionId)
  // //     : undefined;
  // // });

  divisions: Division[] | undefined;
  user: User | undefined;
  seasonPlayoffGames: PlayoffGame[] | null | undefined;
  // divisionGames$ = this.allGames$.pipe(
  //   map(games => this.getDivisionGames(games, this.divisionId))
  // );

  constructor () {
    this.gameStore.select(fromGames.getCurrentSeason).subscribe({
      next: (season) => {
        // console.log(season);
        if (season !== undefined && season !== null) {
          this.seasonId = season.seasonId;
        }
      },
    });
    // this.currentDivision$ = this.gameStore.select(fromGames.getCurrentDivision)

    // this.getCurrentSeason();
    this.seasonGames$ = this.gameStore.pipe(select(fromGames.getGames));
  }

  private getDivisionGames (games: RegularGame[], divisionId: number) {
    let g: RegularGame[] = [];
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
  getGames (): Observable<RegularGame[]> {
    return this.http.get<RegularGame[]>(this.dataService.seasonGamesUrl + '?seasonId=' + this.seasonId);
  }
  //   const divId = fromGames.getCurrentDivisionId;
  //   return this.http
  //     .get<Game[]>(this.dataService.seasonGamesUrl + this.currentSeason$)
  //     .pipe(
  //       map((response) => (this.games = response))
  //       // tap(data => console.log('All: ' + JSON.stringify(data))),
  //       // catchError(this.handleError)
  //     );
  // }
  // getSeasonPlayoffGames (): Observable<PlayoffGame[]> {
  //   const url = Constants.PLAYOFF_GAMES_URL + '?seasonId=' + this.seasonId;
  //   this.logger.log(url);
  //   return this.http.get<PlayoffGame[]>(url).pipe(
  //     map((response) => (this.seasonPlayoffGames = response)),
  //     tap((data) => console.log('All: ' + JSON.stringify(data.length)))
  //     // catchError(this.handleError)
  //   );
  // }

  // getGame(id: number): Observable<Game> {
  //   return this.getGames().pipe(
  //     map((content: Game[]) => content.find(p => p.gameId === id))
  //   );
  // }

  // filterGamesByDivision (): Observable<RegularGame[]> {
  //   let games: RegularGame[] = [];
  //   let sortedDate: RegularGame[] = [];
  //   let div = 0;
  //   this.currentDivision$.subscribe((division) => {
  //     // console.log(division);
  //     div = division?.divisionId ?? 0;
  //     this.seasonGames$.subscribe((seasonGames) => {
  //       // console.log(seasonGames);
  //       this.allGames = seasonGames;
  //       this.setCanEdit(div);
  //       if (seasonGames) {
  //         for (let i = 0; i < this.allGames.length; i++) {
  //           if (this.allGames[i].divisionId === div) {
  //             let game = seasonGames[i];
  //             game.gameDateOnly = this.extractDate(game.gameDate.toString());
  //             games.push(game);
  //           }
  //         }
  //         games.sort();
  //         sortedDate = games.sort((a, b) => {
  //           return this.compare(a.gameDate!, b.gameDate!, true);
  //         });
  //         return of(sortedDate);
  //       }
  //       return of(sortedDate);
  //     });
  //   });
  //   return of(sortedDate);
  // }

  // divisionPlayoffGames (div: number): Observable<PlayoffGame[]> {
  //   let games: PlayoffGame[] = [];
  //   let sortedDate: PlayoffGame[] = [];
  //   this.gameStore
  //     .pipe(select(fromGames.getPlayoffGames))
  //     .subscribe((allPlayoffGames) => {
  //       this.allPlayoffGames = allPlayoffGames;
  //       if (allPlayoffGames) {
  //         this.allPlayoffGames.forEach((game) => {
  //           if (game.divisionId === div) {
  //             // let game = allPlayoffGames[i];
  //             games.push(game);
  //           }
  //         });
  //       }
  //       games.sort();
  //       sortedDate = games.sort((a, b) => {
  //         return this.compare(a.gameDate!, b.gameDate!, true);
  //       });
  //       return of(sortedDate);
  //     });
  //   return of(sortedDate);
  // }

  // public filterGamesByTeam (currentTeam: Team | undefined): Observable<RegularGame[]> {
  //   let teamId = currentTeam?.teamId;
  //   this.gameStore.pipe(select(fromGames.getGames)).subscribe((g) => {
  //     this.allGames = g;
  //   });
  //   let games: RegularGame[] = [];
  //   if (this.allGames) {
  //     for (let i = 0; i < this.allGames.length; i++) {
  //       if (
  //         this.allGames[i].visitingTeamId === teamId ||
  //         this.allGames[i].homeTeamId === teamId
  //       ) {
  //         games.push(this.allGames[i]);
  //       }
  //     }
  //   }
  //   let sortedDate = games.sort((a, b) => {
  //     return this.compare(a.gameDate as Date, b.gameDate as Date, true);
  //   });
  //   console.log(games);
  //   return of(games);
  // }

  // groupRegularGamesByDate (games: RegularGame[]): RegularGame[][] {
  //   const groupedGames: { [key: string]: RegularGame[] } = {};
  //   games.forEach(game => {
  //     const gameDate = new Date(game.gameDate);
  //     const dateKey = gameDate.toLocaleDateString("en-CA");
  //     if (!groupedGames[dateKey]) {
  //       groupedGames[dateKey] = [];
  //     } groupedGames[dateKey].push(game);
  //   });
  //   return Object.values(groupedGames); // Convert the object to an array of arrays
  // }
  // groupPlayoffGamesByDate (games: PlayoffGame[]): PlayoffGame[][] {
  //   const groupedGames: { [key: string]: PlayoffGame[] } = {};
  //   games.forEach(game => {
  //     const gameDate = new Date(game.gameDate);
  //     const dateKey = gameDate.toLocaleDateString("en-CA");
  //     if (!groupedGames[dateKey]) {
  //       groupedGames[dateKey] = [];
  //     } groupedGames[dateKey].push(game);
  //   });
  //   return Object.values(groupedGames); // Convert the object to an array of arrays
  // }

  // private sort (a: any, b: any) {
  //   return this.compare(a.gameDate, b.gameDate, true);
  // }

  // compare (a: Date | string, b: Date | string, isAsc: boolean) {
  //   return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  // }
  getCurrentSeason () {
    return this.gameStore.select(fromGames.getCurrentSeason).subscribe((season) => {
      if (season !== null) {
        this.seasonId = season.seasonId;
      }
    });
  }
  getDivisions (seasonId: number) {
    //this.seasonId = season.seasonID;
    return this.http
      .get<Division[]>(this.dataService.seasonDivisionsUrl + '/' + seasonId)
      .pipe(
        map((response) => (this.divisions = response)),
        shareReplay(1)
        // tap(data => console.log('All: ' + JSON.stringify(data))),
        // tap(divisions => gameActions.gameActionTypes.SetCurrentDivision = ),
        // catchError(this.handleError)
      );
  }

  getDistinctDates (filteredGames: RegularGame[]): Observable<(Date | undefined)[]> {
    return from(filteredGames).pipe(
      map((g) => g.gameDate),
      distinct(),
      toArray()
    );
  }

  // standingsByDivision$ = combineLatest([this.currentDivision$]).pipe();



  // extractDate (date: string): Date {
  //   return DateTime.fromISO(date).toJSDate();
  // }
}
