import { HomeActions, HomeActionTypes } from './home.actions';
import { Content } from 'app/domain/content';
import { WebContent } from '../../domain/webContent';
import { Sponsor } from '@app/domain/sponsor';

export interface HomeState {
  content: WebContent[];
  sponsors: Sponsor[];
}

const initialState: HomeState = {
  content: [],
  sponsors: []
};

export function reducer(state = initialState, action: HomeActions): HomeState {
  switch (action.type) {
    case HomeActionTypes.LoadContentSuccess:
      return {
        ...state,
        content: action.payload,
      };
    default: {
      return state;
    }
  }
}
