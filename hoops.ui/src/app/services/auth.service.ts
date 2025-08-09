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
  providedIn: 'root',
})
export class AuthService {
  readonly http = inject(HttpClient);
  readonly dataService = inject(DataService);
  readonly store = inject(Store<fromUser.State>);

  currentUser = signal<User | undefined>(undefined);
  canEditGames = signal<boolean>(false);
  redirectUrl: string | undefined;
  loginUrl: string | undefined;
  user: User | undefined;

  constructor() {}

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  login(userName: string, password: string): Observable<User> {
    console.log(userName + ', ' + password);
    return this.http
      .get<User>(Constants.loginUrl + '/' + userName + '/' + password)
      .pipe(
        tap((user) => {
          if (user) {
            this.setUserState(user);
          }
        })
      );
  }
  setUserState(user: User) {
    this.store.dispatch(new userActions.SetCurrentUser(user));
    this.currentUser.set(user);
  }

  logout(): void {
    this.currentUser.set(undefined);
    this.store.dispatch(new userActions.SetCurrentUser(undefined as any));
  }

  canEdit(user: User | undefined, divisionId: number | undefined): boolean {
    console.log(divisionId);
    console.log(user);
    let tFlag = false;
    if (user && divisionId) {
      if (user.userType === 2 || user.userType === 3) {
        tFlag = true;
        this.canEditGames.set(true);
        return true;
      } else {
        if (user.divisions) {
          let found = user.divisions.find(
            (div) => div.divisionId === divisionId
          );
          this.canEditGames.set(found !== undefined);
          return found !== undefined;
        }
      }
    }
    return tFlag;
  }
  setCanEdit(divisionId: number | undefined): boolean {
    let tFlag = false;
    if (this.currentUser() && divisionId) {
      if (
        this.currentUser()!.userType === 2 ||
        this.currentUser()!.userType === 3
      ) {
        tFlag = true;
        console.log('can edit games = true');
        this.canEditGames.set(true);
        return true;
      } else {
        if (this.currentUser()!.divisions) {
          let found = this.currentUser()!.divisions!.find(
            (div) => div.divisionId === divisionId
          );
          this.canEditGames.set(found !== undefined);
          console.log(this.canEditGames());

          return found !== undefined;
        }
      }
    }
    return tFlag;
  }
}
