import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '@app/state/app.state';
import * as fromGames from './games.reducer';

export interface State extends fromRoot.State {
  games: fromGames.GameState;
}

const getGameFeatureState = createFeatureSelector<fromGames.GameState>('games');

export const getCurrentSeason = createSelector(
  getGameFeatureState,
  (state) => state.currentSeason
);
export const getCurrentDivision = createSelector(
  getGameFeatureState,
  (state) => state.currentDivision
);

export const getCurrentDivisionId = createSelector(
  getGameFeatureState,
  (state) => state.currentDivisionId
);
export const getCurrentTeam = createSelector(
  getGameFeatureState,
  (state) => state.currentTeam
);

export const getCurrentTeamId = createSelector(
  getGameFeatureState,
  (state) => state.currentTeamId
);

export const getGames = createSelector(
  getGameFeatureState,
  (state) => state.games
);

export const getPlayoffGames = createSelector(
  getGameFeatureState,
  (state) => state.playoffGames
);
export const getDivisionPlayoffGames = createSelector(
  getGameFeatureState,
  (state) => state.divisionPlayoffGames
);

export const getDivisions = createSelector(
  getGameFeatureState,
  (state) => state.divisions
);
export const getTeams = createSelector(
  getGameFeatureState,
  (state) => state.teams
);
export const getAllTeams = createSelector(
  getGameFeatureState,
  (state) => state.showAllteams
);
export const getFilteredGames = createSelector(
  getGameFeatureState,
  (state) => state.filteredGames
);

export const getFilteredGamesByTeam = createSelector(
  getGameFeatureState,
  (state) => state.filteredGames
);

export const getFilteredTeams = createSelector(
  getGameFeatureState,
  (state) => state.filteredTeams
);

export const getStandings = createSelector(
  getGameFeatureState,
  (state) => state.standings
);
export const getCurrentGame = createSelector(
  getGameFeatureState,
  (state) => state.currentGame
);
