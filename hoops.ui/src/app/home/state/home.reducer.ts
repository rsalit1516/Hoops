import { HomeActions, HomeActionTypes } from './home.actions';
import { Content } from 'app/domain/content';
import { WebContent } from '../../domain/webContent';

export interface HomeState {
  content: WebContent[];
}

const initialState: HomeState = {
  content: [],
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
