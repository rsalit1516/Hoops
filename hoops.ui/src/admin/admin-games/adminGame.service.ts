import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { RegularGame } from '@app/domain/regularGame';
import { DataService } from '@app/services/data.service';
import { Observable, of } from 'rxjs';
import { User } from '@app/domain/user';
import { rxResource } from '@angular/core/rxjs-interop';
import { Division } from '@app/domain/division';
import { AuthService } from '@app/services/auth.service';
import { LoggerService } from '@app/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGameService {
  private http = inject(HttpClient);
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private logger = inject(LoggerService);

  allGames: RegularGame[] | undefined;
  selectedDivision = signal<Division | null>(null);
  selectedTeam = signal<number | undefined>(0);
  private selectedRecord = signal<RegularGame | null>(null);
  selectedRecordSignal = this.selectedRecord.asReadonly();
  filteredGames = signal<RegularGame[] | null>(null);
  currentUser = computed(() => this.authService.currentUser());

  constructor() {
    effect(() => {
      const filteredGames = this.filteredGames();
    });
  }

  filterGamesByDivision(): Observable<RegularGame[]> {
    const allGames = this.allGames ?? [];
    const games = allGames
      .filter((g) => g.divisionId === this.selectedDivision()?.divisionId)
      .sort((a, b) => this.compare(a.gameDate!, b.gameDate!, true));
    this.filteredGames.set(games);
    return of(games);
  }

  filterGamesByTeam(team: number): Observable<RegularGame[]> {
    const allGames = this.allGames ?? [];
    const games = allGames
      .filter((g) => g.homeTeamId === team || g.visitingTeamId === team)
      .sort((a, b) => this.compare(a.gameDate!, b.gameDate!, true));
    return of(games);
  }

  compare(a: Date | string, b: Date | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  setCanEdit(division: number) {
    this.logger.debug('Setting edit permission for user:', this.currentUser());
    this.getCanEdit(this.currentUser(), division);
  }

  getCanEdit(user: User | undefined, divisionId: number): boolean {
    if (!user) return false;
    if (user.userType === 2 || user.userType === 3) return true;
    return user.divisions?.some((div) => div.divisionId === divisionId) ?? false;
  }

  updateSelectedRecord(record: RegularGame) {
    this.selectedRecord.set(record);
  }
}
