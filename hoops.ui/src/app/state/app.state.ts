import { UserState } from '@app/user/state/user.reducer';


// Representation of the entire app state
// Extended by lazy loaded modules
export interface State {
    user: UserState;

}
