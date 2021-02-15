import { Injectable } from '@angular/core';
import { User } from '../domain/user';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'app/services/data.service';
import { map } from 'rxjs-compat/operator/map';
import { tap, catchError } from 'rxjs/operators';
import * as userActions from '../user/state/user.actions';
import * as fromUser from '../user/state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User | null;
  redirectUrl: string;
  loginUrl: string;
  user: User;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private store: Store<fromUser.State>
  ) {
    // this.loginUrl = this.dataService.webUrl + '/api/login';
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  login(userName: string, password: string): Observable<User> {
    let tFlag = false;
    console.log(userName + ', ' + password);
    return this.http
      .get<User>(this.dataService.loginUrl + '/' + userName + '/' + password);

  }
  setUserState(user: User) {
    this.store.dispatch(new userActions.SetCurrentUser(user));
  }

  logout(): void {
    this.currentUser = null;
  }
}
