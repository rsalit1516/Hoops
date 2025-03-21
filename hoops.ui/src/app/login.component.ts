import { Component, inject }   from '@angular/core';
import { Router }      from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
    template: `
    <h2>LOGIN</h2>
    <p>{{message}}</p>
    <p>
      <button   *ngIf="!authService.isLoggedIn">Login</button>
      <button (click)="logout()" *ngIf="authService.isLoggedIn">Logout</button>
    </p>`,
    imports: [NgIf]
})
export class LoginComponent {
readonly authService = inject(AuthService);
  message: string = '';

  constructor( public router: Router) {
    // this.setMessage();
  }

  setMessage() {
    // this.message = 'Logged ' + (this.authService.isLoggedIn ? 'in' : 'out');
  }

  // login() {
  //   this.message = 'Trying to log in ...';

  //   this.authService.login().subscribe(() => {
  //     this.setMessage();
  //     if (this.authService.isLoggedIn) {
  //       // Get the redirect URL from our auth service
  //       // If no redirect has been set, use the default
  //       let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/crisis-center/admin';

  //       // Redirect the user
  //       this.router.navigate([redirect]);
  //     }
  //   });
  // }

  logout() {
    this.authService.logout();
    this.setMessage();
  }
}
