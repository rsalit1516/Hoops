import { Injectable } from '@angular/core';
import { User } from '../domain/user';
import { HttpClient } from '@angular/common/http';
import { DataService } from '@app/services/data.service';
import * as userActions from '../user/state/user.actions';
import * as fromUser from '../user/state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Constants } from '@app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User  | undefined;
  redirectUrl: string | undefined;
  loginUrl: string | undefined;
  user: User | undefined;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private store: Store<fromUser.State>
  ) {
  }

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
  }

  logout(): void {
    this.currentUser = undefined;
  }
}
