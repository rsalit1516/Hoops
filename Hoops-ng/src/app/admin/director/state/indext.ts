import { createFeatureSelector, createSelector, ActionReducerMap } from '@ngrx/store';
import * as fromRoot from '../../../state/app.state';
import * as fromDirector from './director.reducer';

export interface State extends fromRoot.State {
    director: fromDirector.DirectorState;
  }

  const getDirectorFeatureState = createFeatureSelector<fromDirector.DirectorState>('director');

  export const getDirectors = createSelector(
      getDirectorFeatureState,
      state => state.directors
  );
