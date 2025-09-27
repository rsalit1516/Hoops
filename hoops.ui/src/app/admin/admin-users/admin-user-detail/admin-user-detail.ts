import { CommonModule } from '@angular/common';
import { Component, OnInit, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminUsersService } from '../admin-users.service';
import { User } from '@app/domain/user';
import { LoggerService } from '@app/services/logging.service';
import { FormValidationService } from '@app/shared/services/form-validation.service';
import { BaseFormComponent } from '@app/shared/services/base-form.component';

@Component({
  selector: 'app-admin-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin-user-detail.html',
  styleUrls: ['../../../shared/scss/forms.scss'],
})
export class AdminUserDetail extends BaseFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private usersService = inject(AdminUsersService);
  private snack = inject(MatSnackBar);
  private logger = inject(LoggerService);

  form!: FormGroup;
  userId!: number;
  isSaving = signal(false);

  userTypeOptions = [
    { value: 1, label: 'User' },
    { value: 2, label: 'Director' },
    { value: 3, label: 'Admin' },
  ];

  protected get isNewRecord(): boolean {
    return this.userId === 0;
  }

  constructor() {
    super();
    // Use service-based selectedUser - much simpler!
    effect(() => {
      const u = this.usersService.selectedUser();

      // Make sure form is initialized before trying to patch it
      if (!this.form) return;

      if (u) {
        // Existing user - populate form
        this.form.patchValue(u);
        this.form.markAsPristine();
        this.userId = u.userId;
      } else {
        // New user - reset form to defaults
        this.form.reset({
          userId: 0,
          userName: '',
          name: '',
          userType: 1,
        });
        this.userId = 0;
      }
    });
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      userId: [{ value: 0, disabled: true }],
      userName: ['', [Validators.required, Validators.maxLength(100)]],
      name: [''],
      userType: [1, Validators.required],
    });
  }

  save() {
    // Only proceed if save should be enabled (form is dirty and valid)
    if (!this.canSave()) return;

    this.isSaving.set(true);
    const value: User = { ...this.form.getRawValue() } as User;

    const isNew = this.userId === 0;

    if (isNew) {
      this.usersService.createUser(value).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.snack.open('User created', 'Close', { duration: 2500 });
          this.markFormAsPristine();
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: () => {
          this.isSaving.set(false);
          this.snack.open('Failed to create user', 'Close', { duration: 3000 });
        },
      });
    } else {
      this.usersService.updateUser(value).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.snack.open('User updated', 'Close', { duration: 2500 });
          this.markFormAsPristine();
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: () => {
          this.isSaving.set(false);
          this.snack.open('Failed to update user', 'Close', { duration: 3000 });
        },
      });
    }
  }

  cancel() {
    this.snack.open('Canceled', undefined, { duration: 1200 });
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // For PendingChangesGuard - use base implementation
  isFormDirty(): boolean {
    return this.hasUnsavedChanges();
  }
}
