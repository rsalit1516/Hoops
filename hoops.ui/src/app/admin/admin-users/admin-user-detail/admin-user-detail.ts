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
import { HouseholdService } from '@app/services/household.service';
import { PeopleService } from '@app/services/people.service';
import { Household } from '@app/domain/household';
import { Person } from '@app/domain/person';

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
  private householdService = inject(HouseholdService);
  private peopleService = inject(PeopleService);
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

  householdOptions = signal<Household[]>([]);
  peopleOptions = signal<Person[]>([]);

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
          houseId: '',
          personId: '',
        });
        this.peopleOptions.set([]);
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
      houseId: [''],
      personId: [''],
    });

    // Load household options
    this.householdService.getAllHouseholds().subscribe({
      next: (households) => {
        this.householdOptions.set(households);
      },
      error: (error) => {
        this.logger.error('Failed to load households', error);
        this.snack.open('Failed to load households', 'Close', {
          duration: 3000,
        });
      },
    });

    // Watch for household changes and load people accordingly
    this.form.get('houseId')?.valueChanges.subscribe((houseId) => {
      if (houseId) {
        this.loadPeopleForHousehold(houseId);
      } else {
        // Clear people options and disable people dropdown when no household selected
        this.peopleOptions.set([]);
        this.form.get('personId')?.setValue('');
      }
    });
  }

  private loadPeopleForHousehold(houseId: number): void {
    this.peopleService.getHouseholdMembersObservable(houseId).subscribe({
      next: (people) => {
        // Sort people by last name, then first name
        const sortedPeople = people.sort((a, b) => {
          const lastNameComparison = a.lastName.localeCompare(b.lastName);
          if (lastNameComparison !== 0) return lastNameComparison;
          return a.firstName.localeCompare(b.firstName);
        });
        this.peopleOptions.set(sortedPeople);
      },
      error: (error) => {
        this.logger.error('Failed to load people for household', error);
        this.snack.open('Failed to load household members', 'Close', {
          duration: 3000,
        });
        this.peopleOptions.set([]);
      },
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
