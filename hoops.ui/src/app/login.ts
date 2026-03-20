import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
  template: ` <h2>LOGIN</h2>
    <p>{{ message }}</p>
    <p>
      @if (!authService.isLoggedIn()) {
      <button>Login</button>
      } @if (authService.isLoggedIn()) {
      <button (click)="logout()">Logout</button>
      }
    </p>`,
  imports: [],
})
export class Login {
  router = inject(Router);

  readonly authService = inject(AuthService);
  message: string = '';

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
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
