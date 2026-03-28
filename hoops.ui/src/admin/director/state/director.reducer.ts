import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DirectorActions, DirectorActionTypes } from './director.actions';
// import { DirectorActions } from './director.actions';

export interface DirectorState {
    currentDirectorId: number | null;
    directors: any[];
}

const initialState: DirectorState = {
    currentDirectorId: null,
    directors: []
  };
export function reducer(
    state = initialState,
    action: DirectorActions
  ): DirectorState {
    switch (action.type) {
        case DirectorActionTypes.LoadSuccess:
          return {
            ...state,
            directors: action.payload
          };
        default: {
          return state;
        }
    }
  }
