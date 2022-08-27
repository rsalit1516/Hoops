import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Game } from '@app/domain/game';
import { DataService } from '@app/services/data.service';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import * as fromGames from '../state';
import * as gameActions from '../state/admin.actions';
import * as fromUser from '@app/user/state';
import { User } from '@app/domain/user';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  allGames: Game[] | undefined;

  constructor(private dataService: DataService,
    private http: HttpClient,
    private store: Store<fromGames.State>,
    private userStore: Store<fromUser.State>
    ) { }

  filterGamesByDivision(div: number): Observable<Game[]> {
    let games: Game[] = [];
    let sortedDate: Game[] = [];
    this.store.pipe(select(fromGames.getSeasonGames)).subscribe((allGames) => {
      this.allGames = allGames;
      this.setCanEdit(div);
      if (allGames && div !== 0) {
        console.log(div);
        for (let i = 0; i < this.allGames.length; i++) {
          if (this.allGames[i].divisionId === div) {
            let game = allGames[ i ];
            console.log(game);
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

  filterGamesByTeam(team: number): Observable<Game[]> {
    let games: Game[] = [];
    let sortedDate: Game[] = [];
    console.log(team);
    this.store.pipe(select(fromGames.getSeasonGames)).subscribe((allGames) => {
      this.allGames = allGames;
      this.setCanEdit(team);
      if (allGames) {
        for (let i = 0; i < this.allGames.length; i++) {
          if (this.allGames[i].homeTeamId === team || this.allGames[i].visitingTeamId === team) {
            let game = allGames[ i ];
            console.log(game);
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
  compare(a: Date | string, b: Date | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  setCanEdit(division: number) {
    this.store.pipe(select(fromUser.getCurrentUser)).subscribe((user) => {
      let canEdit = this.getCanEdit(user, division);
    });
  }
  getCanEdit(user: User | undefined, divisionId: number): boolean {
    // console.log(divisionId);
    let tFlag = false;
    if (user) {
      if ((user.userType === 2) || (user.userType === 3)) {
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
}
