import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Constants } from '../shared/constants';
import { DraftReportPlayer } from '@app/domain/draft-report-player';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class DraftReportService {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);

  private _players = signal<DraftReportPlayer[]>([]);
  get players() {
    return this._players.asReadonly();
  }

  private _isLoading = signal<boolean>(false);
  get isLoading() {
    return this._isLoading.asReadonly();
  }

  getDraftReport(seasonId: number, divisionId: number | null): void {
    this._isLoading.set(true);
    const url = divisionId
      ? `${Constants.DRAFT_REPORT_URL}/${seasonId}/${divisionId}`
      : `${Constants.DRAFT_REPORT_URL}/${seasonId}`;

    this.logger.info('[DraftReportService] Fetching draft report from:', url);

    this.http.get<DraftReportPlayer[]>(url).subscribe({
      next: (players) => {
        this._players.set(players);
        this._isLoading.set(false);
      },
      error: (error) => {
        this.logger.error('[DraftReportService] Error fetching draft report:', error);
        this._players.set([]);
        this._isLoading.set(false);
      },
    });
  }

  clearPlayers(): void {
    this._players.set([]);
  }
}
