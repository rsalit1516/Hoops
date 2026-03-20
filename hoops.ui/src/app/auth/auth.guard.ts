import { Injectable, inject } from '@angular/core';
import {
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  #auth = inject(AuthService);
  #router = inject(Router);
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const isLoggedIn = this.#auth.isLoggedIn();
    if (isLoggedIn) return true;
    // redirect to login with returnUrl
    this.#router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
      replaceUrl: true,
    });
    return false;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.#auth.isLoggedIn();
  }
}
