import { effect, inject, Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';
import { User } from '../domain/user';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Store } from '@ngrx/store';
import * as fromUser from '@app/user/state';
import * as userActions from '@app/user/state/user.actions';

import { Constants } from '../shared/constants';
import { DivisionService } from './division.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly http = inject(HttpClient);
  readonly dataService = inject(DataService);
  readonly store = inject(Store<fromUser.State>);
  private divisionService = inject(DivisionService);

  // Enhanced signal definitions
  currentUser = signal<User | undefined>(undefined);

  // Computed signals - auto-update when dependencies change
  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => {
    const user = this.currentUser();
    return user ? user.userType === 2 || user.userType === 3 : false;
  });
  canEditGames = computed(() => {
    const user = this.currentUser();
    const divisionId = this.divisionService.selectedDivision()?.divisionId;

    if (!user || !divisionId) return false;

    // Admin users can edit all games
    if (user.userType === 2 || user.userType === 3) return true;

    // Check division-specific permissions
    return (
      user.divisions?.some((div) => div.divisionId === divisionId) ?? false
    );
  });

  redirectUrl: string | undefined;
  loginUrl: string | undefined;
  user: User | undefined;

  constructor() {
    // Simplified constructor - effects and computed signals handle reactivity automatically
    // Hydrate from cookie on app load
    this.http
      .get<User>(`${Constants.FUNCTIONS_BASE_URL}/api/auth/me`, {
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          if (user) {
            this.setUserState(user);
          }
        })
      )
      .subscribe({ error: () => {} });
  }

  login(userName: string, password: string): Observable<User> {
    return this.http
      .post<User>(
        `${Constants.FUNCTIONS_BASE_URL}/api/auth/login`,
        { userName, password },
        { withCredentials: true }
      )
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
    this.http
      .post(
        `${Constants.FUNCTIONS_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      )
      .subscribe({
        complete: () => {
          this.currentUser.set(undefined);
          this.store.dispatch(new userActions.SetCurrentUser(undefined as any));
        },
        error: () => {
          this.currentUser.set(undefined);
          this.store.dispatch(new userActions.SetCurrentUser(undefined as any));
        },
      });
  }
}
