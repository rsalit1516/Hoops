import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@app/user/auth.service';
import {
  UntypedFormBuilder,
  Validators
} from '@angular/forms';
import * as userActions from '../../user/state/user.actions';
import * as fromUser from '../../user/state';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss',
    '../scss/cards.scss',
    '../scss/forms.scss',
    ],
    imports: [CommonModule, MatFormFieldModule,
  MatInputModule, MatButtonModule,
  MatCardModule],
})
export class LoginComponent implements OnInit {
  /* injected */
  #authService = inject(AuthService);
  #router = inject(Router);

  loginForm = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required]
  });
  isFormValid: boolean = false;
  get userName() {
    return this.loginForm.get('userName');
  }
  get password() {
    return this.loginForm.get('password');
  }

  constructor(
    private fb: UntypedFormBuilder,
    private store: Store<fromUser.State>
  ) {}

  ngOnInit() {
    this.isFormValid = false;
  }
  onCancelClick() {
    this.#router.navigate(['home']);
  }
  onSubmitClick() {
    // this.loginForm.markAllAsTouched();
    console.log(this.loginForm);
    if (!this.loginForm.invalid) {
      this.validateUser(
        this.loginForm.controls['userName'].value,
        this.loginForm.controls['password'].value
      );
      this.store.select(fromUser.getCurrentUser).subscribe(user => {
        console.log(user);
        if (user !== null && user.userId !== 0) {
          this.#router.navigate(['home']);
        } else {
          this.isFormValid = false;
        }

      });
    }
  }
  validateUser(userName: string, password: string) {
    return this.#authService.login(userName, password).subscribe(response => {
      console.log(response);
      if (response !== null) {
        this.store.dispatch(new userActions.SetCurrentUser(response));
      }
    });
  }


}
