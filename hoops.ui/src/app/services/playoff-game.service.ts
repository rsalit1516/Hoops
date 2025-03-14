import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { PlayoffGame } from '@app/domain/playoffGame';
import { Constants } from '@app/shared/constants';
import { select, Store } from '@ngrx/store';
import { Observable, map, of, tap } from 'rxjs';

import * as fromGames from '../games/state';
import { LoggerService } from './logging.service';
import { SeasonService } from '@app/services/season.service';


@Injectable({
  providedIn: 'root'
})
export class PlayoffGameService {

  private http = inject(HttpClient);
  private gameStore = inject(Store<fromGames.State>);
  private logger = inject(LoggerService);
  readonly #seasonService = inject(SeasonService);

  divisionPlayoffGames = signal<PlayoffGame[] | undefined>(undefined);
  seasonId: number | undefined; // = 2192; // TO DO make this is passed in!
  seasonPlayoffGames: PlayoffGame[] | null | undefined;
  allPlayoffGames: PlayoffGame[] | undefined;



  constructor () { }

  getSeasonPlayoffGames (): Observable<PlayoffGame[]> {
    const url = Constants.PLAYOFF_GAMES_URL + '?seasonId=' + this.#seasonService.selectedSeason!.seasonId;
    this.logger.log(url);
    return this.http.get<PlayoffGame[]>(url).pipe(
      map((response) => (this.seasonPlayoffGames = response)),
      tap((data) => console.log('All: ' + JSON.stringify(data.length)))
      // catchError(this.handleError)
    );
  }
  getDivisionPlayoffGames (div: number): Observable<PlayoffGame[]> {
    let games: PlayoffGame[] = [];
    let sortedDate: PlayoffGame[] = [];
    this.gameStore
      .pipe(select(fromGames.getPlayoffGames))
      .subscribe((allPlayoffGames) => {
        this.allPlayoffGames = allPlayoffGames;
        if (allPlayoffGames) {
          this.allPlayoffGames.forEach((game) => {
            if (game.divisionId === div) {
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
        return of(sortedDate);
      });
    return of(sortedDate);
  }
  groupPlayoffGamesByDate (games: PlayoffGame[]): PlayoffGame[][] {
    const groupedGames: { [key: string]: PlayoffGame[] } = {};
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
