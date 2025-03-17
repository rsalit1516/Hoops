import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';
import { User } from '../domain/user';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Store } from '@ngrx/store';
import * as fromUser from '@app/user/state';
import * as userActions from '@app/user/state/user.actions';

import { Constants } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly http = inject(HttpClient);
  readonly dataService = inject(DataService);
  readonly store = inject(Store<fromUser.State>);

  currentUser = signal< User | undefined>(undefined);
    redirectUrl: string | undefined;
    loginUrl: string | undefined;
    user: User | undefined;

    constructor(
    ) {}

    isLoggedIn(): boolean {
      return !!this.currentUser;
    }

    login(userName: string, password: string): Observable<User> {
      let tFlag = false;
      console.log(userName + ', ' + password);
      return this.http
        .get<User>(Constants.loginUrl + '/' + userName + '/' + password);

    }
    setUserState(user: User) {
      this.store.dispatch(new userActions.SetCurrentUser(user));
      this.currentUser.set(user);
    }

    logout(): void {
      this.currentUser.set(undefined);
    }
}
