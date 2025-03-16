import { Injectable }       from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot }                           from '@angular/router';
import { AuthService }      from '../services/auth.service';

@Injectable()
export class AuthGuard  {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
      return true;
    // return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

}
