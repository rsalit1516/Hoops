import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import {
  UntypedFormBuilder,
  Validators
} from '@angular/forms';
import * as userActions from '../../../user/state/user.actions';
import * as fromUser from '../../../user/state';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'csbc-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss',
    '../../scss/forms.scss',
  ],
  imports: [CommonModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }
  ]
})
export class LoginDialogComponent implements OnInit {
  /* injected */
  #authService = inject(AuthService);

  loginForm = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required]
  });
  isFormValid: boolean = false;
  get userName () {
    return this.loginForm.get('userName');
  }
  get password () {
    return this.loginForm.get('password');
  }

  constructor (
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private fb: UntypedFormBuilder,
    private store: Store<fromUser.State>
  ) { }

  ngOnInit () {
    this.isFormValid = false;
  }
  onCancelClick () {
    this.dialogRef.close();
  }
  onSubmitClick () {
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
          this.dialogRef.close();
        } else {
          this.isFormValid = false;
        }

      });
    }
  }
  validateUser (userName: string, password: string) {
    return this.#authService.login(userName, password).subscribe(response => {
      console.log(response);
      if (response !== null) {
        // The login method now automatically calls setUserState via tap operator
        // But we'll also dispatch to the store for compatibility
        this.store.dispatch(new userActions.SetCurrentUser(response));
      }
    });
  }
}
