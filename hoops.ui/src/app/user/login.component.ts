import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from './auth.service';
import { Store, select } from '@ngrx/store';
import { NgIf } from '@angular/common';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [NgIf]
})
export class LoginComponent implements OnInit {
  pageTitle = 'Log In';
  errorMessage: string | undefined;
  ngmodel: any | undefined;
  maskUserName: boolean | undefined;

  constructor(private store: Store<any>,
    private authService: AuthService,
    private router: Router) {
  }

  ngOnInit(): void {
    // TODO: Unsubscribe
    this.store.pipe(select('users')).subscribe(
      users => {
        if (users) {
          this.maskUserName = users.maskUserName;
        }
      });
  }

  cancel(): void {
    this.router.navigate(['welcome']);
  }

  checkChanged(value: boolean): void {
    this.store.dispatch({
      type: 'MASK_USER_NAME',
      payload: value
    });
  }

  login(loginForm: NgForm): void {
    if (loginForm && loginForm.valid) {
      const userName = loginForm.form.value.userName;
      const password = loginForm.form.value.password;
      this.authService.login(userName, password);

      if (this.authService.redirectUrl) {
        this.router.navigateByUrl(this.authService.redirectUrl);
      } else {
        this.router.navigate(['/products']);
      }
    } else {
      this.errorMessage = 'Please enter a user name and password.';
    }
  }
}
