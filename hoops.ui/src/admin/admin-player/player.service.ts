import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '@app/shared/constants';
import { Player } from '@app/domain/player';
import { LoggerService } from '@app/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);

  // Signal for the selected player (for editing or viewing)
  private _selectedPlayer = signal<Player | null>(null);
  get selectedPlayer() {
    return this._selectedPlayer.asReadonly();
  }
  updateSelectedPlayer(player: Player | null) {
    this._selectedPlayer.set(player);
  }

  // Signal for form dirty state
  private _isFormDirty = signal<boolean>(false);
  get isFormDirty() {
    return this._isFormDirty.asReadonly();
  }
  updateFormDirtyState(isDirty: boolean) {
    this._isFormDirty.set(isDirty);
  }

  // Signal for loading state
  private _isLoading = signal<boolean>(false);
  get isLoading() {
    return this._isLoading.asReadonly();
  }
  updateLoadingState(isLoading: boolean) {
    this._isLoading.set(isLoading);
  }

  /**
   * Gets a player by ID
   */
  getPlayerById(playerId: number): Observable<Player> {
    const url = `${Constants.PLAYER_URL}/${playerId}`;
    this.logger.info('Getting player by ID:', playerId);
    return this.http.get<Player>(url);
  }

  /**
   * Gets a player by person ID
   */
  getPlayerByPersonId(personId: number): Observable<Player> {
    const url = `${Constants.PLAYER_URL}/Person/${personId}`;
    this.logger.info('Getting player by person ID:', personId);
    return this.http.get<Player>(url);
  }

  /**
   * Gets a player by person ID and season ID
   */
  getPlayerByPersonAndSeason(personId: number, seasonId: number): Observable<Player> {
    const url = `${Constants.PLAYER_URL}/Person/${personId}/Season/${seasonId}`;
    this.logger.info('Getting player by person ID and season:', personId, seasonId);
    return this.http.get<Player>(url);
  }

  /**
   * Creates a new player registration
   */
  createPlayer(player: Player): Observable<Player> {
    this.logger.info('Creating new player:', player);
    this.updateLoadingState(true);

    return this.http.post<Player>(Constants.PLAYER_URL, player, { withCredentials: true });
  }

  /**
   * Updates an existing player registration
   */
  updatePlayer(player: Player): Observable<Player> {
    const url = `${Constants.PLAYER_URL}/${player.playerId}`;
    this.logger.info('Updating player at URL:', url);
    this.updateLoadingState(true);

    return this.http.put<Player>(url, player, { withCredentials: true });
  }

  /**
   * Saves a player (creates or updates based on playerId)
   */
  savePlayer(player: Player): Observable<Player> {
    if (player.playerId && player.playerId !== 0) {
      return this.updatePlayer(player);
    } else {
      return this.createPlayer(player);
    }
  }

  /**
   * Deletes a player registration
   */
  deletePlayer(playerId: number): Observable<Player> {
    const url = `${Constants.PLAYER_URL}/${playerId}`;
    this.logger.info('Deleting player at URL:', url);
    return this.http.delete<Player>(url, { withCredentials: true });
  }

  /**
   * Creates a new Player instance with default values
   */
  createNewPlayer(personId: number, seasonId: number): Player {
    const player = new Player();
    player.personId = personId;
    player.seasonId = seasonId;
    return player;
  }
}
