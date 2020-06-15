import {
  createFeatureSelector,
  createSelector,
  ActionReducerMap
} from '@ngrx/store';
import * as fromRoot from '../../../state/app.state';
import * as fromContent from './content.reducer';

export interface State extends fromRoot.State {
  content: fromContent.ContentState;
}

const getContentFeatureState = createFeatureSelector<fromContent.ContentState>(
  'content'
);

export const getCurrentContentId = createSelector(
  getContentFeatureState,
  state => state.currentContentId
);
export const getSelectedContent = createSelector(
  getContentFeatureState,
  state => state.selectedContent
);
export const getContentList = createSelector(
  getContentFeatureState,
  state => state.contentList
);
export const getIsActiveOnly = createSelector(
  getContentFeatureState,
  state => state.isActiveOnly
);
export const getfilteredList = createSelector(
  getContentFeatureState,
  state => state.filteredList
);


