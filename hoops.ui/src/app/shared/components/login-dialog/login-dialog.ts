import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import {
  UntypedFormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import * as userActions from '../../../user/state/user.actions';
import * as fromUser from '../../../user/state';
import { Store } from '@ngrx/store';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'csbc-login-dialog',
  templateUrl: './login-dialog.html',
  styleUrls: ['./login-dialog.scss', '../../scss/forms.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [],
})
export class LoginDialog implements OnInit {
  /* injected */
  #authService = inject(AuthService);

  loginForm = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
  });
  // Show error only after a failed attempt
  isFormValid: boolean = true;
  attemptedSubmit = false;
  loginError = false;
  get userName() {
    return this.loginForm.get('userName');
  }
  get password() {
    return this.loginForm.get('password');
  }

  constructor(
    public dialogRef: MatDialogRef<LoginDialog>,
    private fb: UntypedFormBuilder,
    private store: Store<fromUser.State>
  ) {}

  ngOnInit() {
    this.isFormValid = true;
    this.loginError = false;
    this.attemptedSubmit = false;
  }
  onCancelClick() {
    this.dialogRef.close();
  }
  onSubmitClick() {
    this.attemptedSubmit = true;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.isFormValid = false;
      return;
    }

    const userName = this.loginForm.controls['userName'].value as string;
    const password = this.loginForm.controls['password'].value as string;
    this.validateUser(userName, password);

    const sub = this.store.select(fromUser.getCurrentUser).subscribe((user) => {
      if (user && user.userId !== 0) {
        sub.unsubscribe();
        this.dialogRef.close();
      } else {
        // Keep the dialog open and show error only if a prior attempt failed
        this.isFormValid = false;
      }
    });
  }
  validateUser(userName: string, password: string) {
    return this.#authService.login(userName, password).subscribe({
      next: (response) => {
        if (response !== null) {
          this.loginError = false;
          this.isFormValid = true;
          // The login method now automatically calls setUserState via tap operator
          // But we'll also dispatch to the store for compatibility
          this.store.dispatch(new userActions.SetCurrentUser(response));
        } else {
          this.loginError = true;
          this.isFormValid = false;
        }
      },
      error: () => {
        this.loginError = true;
        this.isFormValid = false;
      },
    });
  }
}
