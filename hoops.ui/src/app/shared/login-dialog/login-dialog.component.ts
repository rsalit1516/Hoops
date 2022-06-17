import { Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { AuthService } from 'app/user/auth.service';
import {
  FormControl,
  FormGroup,
  FormArray,
  UntypedFormBuilder,
  Validators
} from '@angular/forms';
import * as userActions from '../../user/state/user.actions';
import * as fromUser from '../../user/state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'csbc-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
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
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private store: Store<fromUser.State>
  ) {}

  ngOnInit() {
    this.isFormValid = true;
  }
  onCancelClick() {
    this.dialogRef.close();
  }
  onSubmitClick() {
    this.loginForm.markAllAsTouched();
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
  validateUser(userName: string, password: string) {
    return this.authService.login(userName, password).subscribe(response => {
      console.log(response);
      if (response !== null) {
        this.store.dispatch(new userActions.SetCurrentUser(response));
      }
    });
  }
}
