import { User } from '../../domain/user';

/* NgRx */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserActions, UserActionTypes } from './user.actions';

// State for this feature (User)
export interface UserState {
  maskUserName: boolean;
  currentUser: User;
}

const initialState: UserState = {
  maskUserName: true,
  currentUser: new User(
    0,
    '',
    false,
  )
};

// Selector functions
const getProductFeatureState = createFeatureSelector<UserState>('users');

export const getMaskUserName = createSelector(
  getProductFeatureState,
  state => state.maskUserName
);

export const getCurrentUser = createSelector(
  getProductFeatureState,
  state => state.currentUser
);

export function reducer(state = initialState, action: UserActions): UserState {
  switch (action.type) {
    case UserActionTypes.MaskUserName:
      return {
        ...state,
        maskUserName: action.payload
      };
      case UserActionTypes.SetCurrentUser:
      return {
        ...state,
        currentUser: action.payload
      };

    default:
      return state;
  }
}
