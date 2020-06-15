import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AdminActions, AdminActionTypes } from './admin.actions';
import * as fromRoot from '../../state/app.state';
import { Season } from 'app/domain/season';
import { Division } from 'app/domain/division';

export interface AdminState {
  currentSeasonId: number | null;
  currentDivisionId: number | null;
  currentTeamId: number | null;
  seasons: Season[];
  currentSeason: Season;
  divisions: Division[];
}

const initialState: AdminState = {
  currentSeason: null,
  currentSeasonId: 2193,
  currentDivisionId: null,
  currentTeamId: null,
  seasons: [],
  divisions: []
};

export function reducer(
  state = initialState,
  action: AdminActions
): AdminState {
  switch (action.type) {
    case AdminActionTypes.LoadSeasonsSuccess:
      return {
        ...state,
        seasons: action.payload
      };
    case AdminActionTypes.LoadDivisionsSuccess:
      return {
        ...state,
        divisions: action.payload
      };
    case AdminActionTypes.SetCurrentSeason:
      return {
        ...state,
        currentSeason: action.payload
      };
    case AdminActionTypes.SetSelectedSeason:
      return {
        ...state,
        currentSeason: action.payload
      };
    case AdminActionTypes.SetSelectedSeasonId:
      return {
        ...state,
        currentSeasonId: action.payload
      };

    default: {
      return state;
    }
  }
}
