import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { RegularGame } from '@app/domain/regularGame';
import { DataService } from '@app/services/data.service';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import * as fromGames from '../state';
import * as gameActions from '../state/admin.actions';
import * as fromUser from '@app/user/state';
import { User } from '@app/domain/user';
import { rxResource } from '@angular/core/rxjs-interop';
import { setErrorMessage } from '@app/shared/error-message';
import { Division } from '@app/domain/division';
import { AuthService } from '@app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGameService {
  private http = inject(HttpClient);
  private dataService = inject(DataService);
readonly #authService = inject(AuthService);
  allGames: RegularGame[] | undefined;
  selectedDivision = signal<Division | null>(null);
  selectedTeam = signal<number | undefined>(0);
  // signals
  private selectedRecord = signal<RegularGame | null>(null);
  // Expose the selected record signal
  selectedRecordSignal = this.selectedRecord.asReadonly();
  filteredGames = signal<RegularGame[] | null>(null);
  curentUser = computed(() => this.#authService.currentUser());
  constructor(
    private store: Store<fromGames.State>,
    private userStore: Store<fromUser.State>
  ) {
    effect(() => {
      const filteredGames = this.filteredGames();
      // console.log('Filtered Games', filteredGames);
    });
  }

  filterGamesByDivision (): Observable<RegularGame[]> {
    let games: RegularGame[] = [];
    let gamesSortedByDate: RegularGame[] = [];
    this.store.pipe(select(fromGames.getSeasonGames)).subscribe((allGames) => {
      this.allGames = allGames;
      // console.log('Selected Division', /this.selectedDivision());
      // console.log('allGames', allGames);
      if (this.selectedDivision() !== null) {
        this.setCanEdit(this.selectedDivision()!.divisionId);
      }
      if (allGames) {
        // console.log(div);
        for (let i = 0; i < this.allGames.length; i++) {
          if (this.allGames[i].divisionId === this.selectedDivision()?.divisionId) {
            let game = allGames[i];
            games.push(game);
          }
        }
        // console.log('Games', games);
        games.sort();
        gamesSortedByDate = games.sort((a, b) => {
          return this.compare(a.gameDate!, b.gameDate!, true);
        });
        this.filteredGames.set(gamesSortedByDate);
        return of(gamesSortedByDate);
      }
      return of(gamesSortedByDate);
    });
    return of(gamesSortedByDate);
  }

  private filteredGames$ = this.filterGamesByDivision();
  private gamesResource = rxResource({
    loader: () => this.filteredGames$
  });

  // filteredGames = computed(() => this.gamesResource.value() ?? [] as Game[]);
  error = computed(() => this.gamesResource.error() as HttpErrorResponse);
  errorMessage = computed(() => setErrorMessage(this.error(), 'Game'));
  isLoading = this.gamesResource.isLoading;

  filterGamesByTeam (team: number): Observable<RegularGame[]> {
    let games: RegularGame[] = [];
    let sortedDate: RegularGame[] = [];
    // console.log(team);
    this.store.pipe(select(fromGames.getSeasonGames)).subscribe((allGames) => {
      this.allGames = allGames;
      this.setCanEdit(team);
      if (allGames) {
        for (let i = 0; i < this.allGames.length; i++) {
          if (this.allGames[i].homeTeamId === team || this.allGames[i].visitingTeamId === team) {
            let game = allGames[i];
            // console.log(game);
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
  compare (a: Date | string, b: Date | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  setCanEdit (division: number) {
    let canEdit = this.getCanEdit(this.curentUser(), division);
  }
  getCanEdit (user: User | undefined, divisionId: number): boolean {
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
  updateSelectedRecord (record: RegularGame) {
    this.selectedRecord.set(record);
  }

  reloadGames () {
    this.gamesResource.reload();
    //this.store.dispatch(gameActions.loadGames());
  }
}
