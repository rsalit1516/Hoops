import {
  createFeatureSelector,
  createSelector,
  ActionReducerMap
} from '@ngrx/store';
import * as fromRoot from '../../state/app.state';
import * as fromAdmin from './admin.reducer';

export interface State extends fromRoot.State {
  admin: fromAdmin.AdminState;
}

const getAdminFeatureState = createFeatureSelector<fromAdmin.AdminState>(
  'admin'
);

export const getCurrentSeasonId = createSelector(
  getAdminFeatureState,
  state => state.currentSeasonId
);
export const getCurrentSeason = createSelector(
  getAdminFeatureState,
  state => state.currentSeason
);
export const getCurrentDivisionId = createSelector(
  getAdminFeatureState,
  state => state.currentDivisionId
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
  state => state.divisions
);
