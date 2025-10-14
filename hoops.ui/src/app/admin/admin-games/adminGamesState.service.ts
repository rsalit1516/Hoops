import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { PlayoffGameService } from '@app/services/playoff-game.service';
import { RegularGame } from '@app/domain/regularGame';
import { PlayoffGame } from '@app/domain/playoffGame';
import { AdminGameService } from './adminGame.service';

export type GameType = 'regular' | 'playoff';

@Injectable({ providedIn: 'root' })
export class AdminGamesState {
  private readonly admin = inject(AdminGameService);
  private readonly playoff = inject(PlayoffGameService);

  // persist across reloads
  private loadType(): GameType {
    const v = localStorage.getItem('admin:games:type');
    return v === 'playoff' ? 'playoff' : 'regular';
  }

  readonly gameType = signal<GameType>(this.loadType());

  // expose the currently active games (already filtered by division in your services)
  readonly games = computed<(RegularGame | PlayoffGame)[]>(() =>
    this.gameType() === 'regular'
      ? this.admin.filteredGames() ?? []
      : this.playoff.divisionPlayoffGames() ?? []
  );

  // handy flags
  readonly isRegular = computed(() => this.gameType() === 'regular');
  readonly isPlayoff = computed(() => this.gameType() === 'playoff');

  setGameType(type: GameType) {
    if (type !== this.gameType()) {
      this.gameType.set(type);
      console.log(this.gameType());
    }
  }

  // persist to localStorage
  private persist = effect(() => {
    localStorage.setItem('admin:games:type', this.gameType());
  });
}
