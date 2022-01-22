import {
  createFeatureSelector,
  createSelector,
  ActionReducerMap
} from '@ngrx/store';
import * as fromRoot from '@app/state/app.state';
import * as fromAdmin from './admin.reducer';

export interface State extends fromRoot.State {
  admin: fromAdmin.AdminState;
}

const getAdminFeatureState = createFeatureSelector<fromAdmin.AdminState>(
  'admin'
);
export const getCurrentSeason = createSelector(
  getAdminFeatureState,
  state => state.currentSeason
);
export const getSelectedDivision = createSelector(
  getAdminFeatureState,
  state => state.selectedDivision
);
export const getCurrentTeamId = createSelector(
  getAdminFeatureState,
  state => state.currentTeamId
);
export const getSeasons = createSelector(
  getAdminFeatureState,
  state => state.seasons
);
export const getSeasonDivisions = createSelector(
  getAdminFeatureState,
  state => state.seasonDivisions
);
export const getSeasonGames = createSelector(
  getAdminFeatureState,
  state => state.games
);
export const getFilteredGames = createSelector(
  getAdminFeatureState,
  state => state.filteredGames
);
export const getSelectedGame = createSelector(
  getAdminFeatureState,
  state => state.selectedGame
);
