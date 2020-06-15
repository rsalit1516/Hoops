import {
    createFeatureSelector,
    createSelector,
    ActionReducerMap
  } from '@ngrx/store';
  import * as fromRoot from '../../state/app.state';
  import * as fromHome from './home.reducer';
  
  export interface State extends fromRoot.State {
    home: fromHome.HomeState;
  }

  const getHomeFeatureState = createFeatureSelector<fromHome.HomeState>(
    'home'
  );
  
  export const getContent = createSelector(
    getHomeFeatureState,
    state => state.content
  );
  