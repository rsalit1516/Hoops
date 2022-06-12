import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

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
