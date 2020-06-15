import {
  createFeatureSelector,
  createSelector,
  ActionReducerMap
} from '@ngrx/store';
import * as fromRoot from '../../state/app.state';
import * as fromGames from './games.reducer';

export interface State extends fromRoot.State {
  games: fromGames.GameState;
}

const getGameFeatureState = createFeatureSelector<fromGames.GameState>('games');

export const getCurrentSeason = createSelector(
  getGameFeatureState,
  state => state.currentSeason
);
export const getCurrentDivision = createSelector(
  getGameFeatureState,
  state => state.currentDivision
);

export const getCurrentDivisionId = createSelector(
  getGameFeatureState,
  state => state.currentDivisionId
);
export const getCurrentTeam = createSelector(
  getGameFeatureState,
  state => state.currentTeam
);

export const getCurrentTeamId = createSelector(
  getGameFeatureState,
  state => state.currentTeamId
);

export const getGames = createSelector(
  getGameFeatureState,
  state => state.games
);

export const getDivisions = createSelector(
  getGameFeatureState,
  state => state.divisions
);
export const getTeams = createSelector(
  getGameFeatureState,
  state => state.teams
);
export const getAllTeams = createSelector(
  getGameFeatureState,
  state => state.showAllteams
);
export const getFilteredGames = createSelector(
  getGameFeatureState,
  state => state.filteredGames
);

export const getStandings = createSelector(
  getGameFeatureState,
  state => state.standings
);
export const getCanEdit = createSelector(
  getGameFeatureState,
  state => state.canEdit
);
export const getCurrentGame = createSelector(
  getGameFeatureState,
  state => state.currentGame
)
