import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from '../../../state/app.state';
import {
  ContentActions,
  ContentActionTypes,
  SetActiveContentSuccess
} from './content.actions';
import { Content } from '@app/domain/content';
import { WebContentType } from '@app/domain/webContentType';
import { WebContent } from '../../../domain/webContent';

export interface ContentState {
  currentContentId: number | null;
  selectedContent: Content | null;
  contentList: WebContent[];
  isActiveOnly: boolean;
  filteredList: WebContent[];
  contentTypeList: WebContentType[];
  clonedContent: Content;
}

const initialState: ContentState = {
  currentContentId: null,
  selectedContent: null,
  contentList: [],
  isActiveOnly: true,
  filteredList: [],
  contentTypeList: [],
  clonedContent: new Content()
};

export function reducer(
  state = initialState,
  action: ContentActions
): ContentState {
  switch (action.type) {
    case ContentActionTypes.SetSelectedContent:
      return {
        ...state,
        selectedContent: action.payload
      };
    case ContentActionTypes.SetAllContentSuccess:
      return {
        ...state,
        filteredList: action.payload
      };
    case ContentActionTypes.SetIsActiveOnly:
      return {
        ...state,
        isActiveOnly: action.payload
      };
    case ContentActionTypes.LoadSuccess:
      return {
        ...state,
        contentList: action.payload
      };
    case ContentActionTypes.SetActiveContentSuccess:
      return {
        ...state,
        filteredList: action.payload
      };
      case ContentActionTypes.SetClonedContent:
        return {
          ...state,
          clonedContent: action.payload
        };
case ContentActionTypes.LoadContentTypeListSuccess:
  return {
    ...state,
    contentTypeList: action.payload
  };

    default: {
      return state;
    }
  }
}
