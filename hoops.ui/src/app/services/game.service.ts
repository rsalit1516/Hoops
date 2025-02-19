                                                                                              import { effect, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DataService } from './data.service';
import { Game } from '../domain/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private _gameUrl: string;
  private _games!: Game[];
  get games () {
    return this._games;
  }
  set games (games: Game[]) {
    this._games = games;
  }
  standingsUrl: string;

  // signals
  private selectedRecord = signal<Game | null>(null);
  // Expose the selected record signal
  selectedRecordSignal = this.selectedRecord.asReadonly();

  public currentTeamId: string | undefined;

  constructor(private _http: HttpClient, public dataService: DataService) {
    this._gameUrl = this.dataService.webUrl + '/api/gameschedule';
    this.standingsUrl = this.dataService.webUrl + '/api/gameStandings';
    effect(() => {
          const record = this.selectedRecord();
          console.log('Selected record changed:', record);
          if (record !== null) {
            console.log(`Record updated: ${record.scheduleGamesId}`);
            // Optionally trigger additional logic here
          }
        });
  }
  getGames(): Observable<Game[]> {
    return this._http
      .get<Game[]>(this._gameUrl)
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

  getStandings(): Observable<Game[]> {
    return this._http
      .get<any[]>(this._gameUrl)
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

  public filterGamesByTeam(allGames: Game[], teamId: number): Game[] {
    let games: Game[] = [];
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

updateSelectedRecord(record: Game) {
    this.selectedRecord.set(record);
  }
}
