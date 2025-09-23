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

@Component({
  selector: 'csbc-admin-user-detail',
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
export class AdminUserDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private usersService = inject(AdminUsersService);
  private snack = inject(MatSnackBar);

  form!: FormGroup;
  userId!: number;
  isSaving = signal(false);

  userTypeOptions = [
    { value: 1, label: 'User' },
    { value: 2, label: 'Director' },
    { value: 3, label: 'Admin' },
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      userId: [{ value: 0, disabled: true }],
      userName: ['', [Validators.required, Validators.maxLength(100)]],
      firstName: [''],
      lastName: [''],
      userType: [1, Validators.required],
    });

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.userId = id;
      if (id) {
        this.usersService.loadUser(id);
      } else {
        this.usersService.selectedUser.set(null);
      }
    });

    // Patch form when selectedUser changes
    effect(() => {
      const u = this.usersService.selectedUser();
      if (u) {
        this.form.patchValue(u);
        this.form.markAsPristine();
      }
    });
  }

  save() {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    const value: User = { ...this.form.getRawValue() } as User;
    this.usersService.updateUser(value).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.snack.open('User saved', 'Close', { duration: 2500 });
        this.form.markAsPristine();
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: () => {
        this.isSaving.set(false);
        this.snack.open('Failed to save user', 'Close', { duration: 3000 });
      },
    });
  }

  cancel() {
    this.snack.open('Canceled', undefined, { duration: 1200 });
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // For PendingChangesGuard
  isFormDirty(): boolean {
    return this.form?.dirty ?? false;
  }
}
