import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../shared/constants';
import { DraftListPlayer } from '@app/domain/draft-list-player';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class DraftListService {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);

  private _players = signal<DraftListPlayer[]>([]);
  get players() {
    return this._players.asReadonly();
  }

  private _isLoading = signal<boolean>(false);
  get isLoading() {
    return this._isLoading.asReadonly();
  }

  getDraftList(seasonId: number, divisionId: number | null): void {
    this._isLoading.set(true);
    const url = divisionId
      ? `${Constants.DRAFT_LIST_URL}/${seasonId}/${divisionId}`
      : `${Constants.DRAFT_LIST_URL}/${seasonId}`;

    this.logger.info('[DraftListService] Fetching draft list from:', url);

    this.http.get<DraftListPlayer[]>(url, { responseType: 'json' }).subscribe({
      next: (players) => {
        this.logger.info('[DraftListService] Players received:', players);
        this._players.set(players);
        this._isLoading.set(false);
      },
      error: (error) => {
        this.logger.error('[DraftListService] Error fetching draft list:', error);
        this._players.set([]);
        this._isLoading.set(false);
      },
    });
  }

  clearPlayers(): void {
    this._players.set([]);
  }
}
