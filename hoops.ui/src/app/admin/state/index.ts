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
export const getSelectedSeason = createSelector(
  getAdminFeatureState,
  state => state.selectedSeason
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
export const getSeasonTeams = createSelector(
  getAdminFeatureState,
  state => state.seasonTeams
);
export const getDivisionTeams = createSelector(
  getAdminFeatureState,
  state => state.divisionTeams
);
export const getSelectedTeam = createSelector(
  getAdminFeatureState,
  state => state.selectedTeam
);
export const getColors = createSelector(
  getAdminFeatureState,
  state => state.colors
);
export const getShowOnlyActiveWebContent = createSelector(
  getAdminFeatureState,
  state => state.showOnlyActiveWebContent
);
export const getGameType = createSelector(
  getAdminFeatureState,
  state => state.gameType
);
export const getDivisionGames = createSelector(
  getAdminFeatureState,
  state => state.divisionGames
);
export const getTeamGames = createSelector(
  getAdminFeatureState,
  state => state.teamGames
);
export const getCurrentContentId = createSelector(
  getAdminFeatureState,
  state => state.currentContentId
);
export const getSelectedContent = createSelector(
  getAdminFeatureState,
  state => state.selectedContent
);
export const getContentList = createSelector(
  getAdminFeatureState,
  state => state.contentList
);
export const getIsActiveOnly = createSelector(
  getAdminFeatureState,
  state => state.isActiveOnly
);
export const getfilteredList = createSelector(
  getAdminFeatureState,
  state => state.filteredList
);

export const getClonedContent = createSelector(
  getAdminFeatureState,
  state => state.clonedContent
);

export const getLocations = createSelector(
  getAdminFeatureState,
  state => state.locations
);

