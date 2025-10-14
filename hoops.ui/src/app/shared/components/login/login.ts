import { Component, computed, inject, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import {
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as userActions from '../../../user/state/user.actions';
import * as fromUser from '../../../user/state';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss', '../../scss/cards.scss', '../../scss/forms.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
})
export class Login implements OnInit {
  /* injected */
  #authService = inject(AuthService);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  store = inject(Store<fromUser.State>);
  loginForm = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
  });
  // UI state
  isFormValid: boolean = true;
  attemptedSubmit = false;
  saving = false;
  loginError = false;
  hidePassword = true;
  get userName() {
    return this.loginForm.get('userName');
  }
  get password() {
    return this.loginForm.get('password');
  }
  currentUser = computed(() => this.#authService.currentUser());
  constructor() {}

  ngOnInit() {
    this.isFormValid = true;
    this.attemptedSubmit = false;
    this.saving = false;
    this.loginError = false;
  }
  onCancelClick() {
    this.#router.navigate(['home']);
  }
  onSubmitClick() {
    this.attemptedSubmit = true;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.isFormValid = false;
      return;
    }
    this.saving = true;
    this.validateUser(
      this.loginForm.get('userName')?.value || '',
      this.loginForm.get('password')?.value || ''
    );
  }
  validateUser(userName: string, password: string) {
    return this.#authService.login(userName, password).subscribe({
      next: (response) => {
        if (response !== null) {
          this.store.dispatch(new userActions.SetCurrentUser(response));
          this.#authService.currentUser.set(response);
          this.loginError = false;
          this.isFormValid = true;
          this.saving = false;
          const returnUrl = this.#route.snapshot.queryParamMap.get('returnUrl');
          if (returnUrl) {
            this.#router.navigateByUrl(returnUrl);
          } else {
            this.#router.navigate(['home']);
          }
        } else {
          this.loginError = true;
          this.isFormValid = false;
          this.saving = false;
        }
      },
      error: () => {
        this.loginError = true;
        this.isFormValid = false;
        this.saving = false;
      },
    });
  }
}
