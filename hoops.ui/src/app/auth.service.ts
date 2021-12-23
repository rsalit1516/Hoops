import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthService {
  isLoggedIn: boolean = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string | undefined;

  login(): Observable<boolean> {
    return of(true).pipe(tap(val => this.isLoggedIn = true));
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}