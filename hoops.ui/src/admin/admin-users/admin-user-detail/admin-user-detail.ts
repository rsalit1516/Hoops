import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  Signal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AdminUsersService } from '../admin-users.service';
import { User } from '@app/domain/user';
import { LoggerService } from '@app/services/logging.service';
import { FormValidationService } from '@app/shared/services/form-validation.service';
import { BaseFormComponent } from '@app/shared/services/base-form.component';
import { HouseholdService } from '@app/services/household.service';
import { PeopleService } from '@app/services/people.service';
import { Household } from '@app/domain/household';
import { Person } from '@app/domain/person';
import { Constants } from '@app/shared/constants';

@Component({
  selector: 'app-admin-user-detail',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    MatAutocompleteModule,
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
  private http = inject(HttpClient);
  private usersService = inject(AdminUsersService);
  private householdService = inject(HouseholdService);
  private peopleService = inject(PeopleService);
  private snack = inject(MatSnackBar);
  private logger = inject(LoggerService);

  form!: FormGroup;
  userId!: number;
  isSaving = signal(false);
  householdName = signal<string>('');

  showHouseholdDropdown = computed(
    () => this.userId === 0 && !this.householdName()
  );

  userTypeOptions = [
    { value: 1, label: 'User' },
    { value: 2, label: 'Director' },
    { value: 3, label: 'Admin' },
  ];

  // Autocomplete signals — set up in constructor (injection context required)
  householdSearchText = signal<string>('');
  filteredHouseholds!: Signal<Household[]>;
  peopleOptions = signal<Person[]>([]);

  protected get isNewRecord(): boolean {
    return this.userId === 0;
  }

  constructor() {
    super();

    // Wire up debounced household search as a signal.
    // toObservable/toSignal must be called in an injection context (constructor).
    this.filteredHouseholds = toSignal(
      toObservable(this.householdSearchText).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((text) =>
          text.length >= 2
            ? this.householdService
                .searchByName(text)
                .pipe(catchError(() => of([])))
            : of([])
        )
      ),
      { initialValue: [] as Household[] }
    );

    effect(() => {
      const u = this.usersService.selectedUser();
      if (!this.form) return;

      if (u) {
        this.form.patchValue(u);
        this.form.markAsPristine();
        this.userId = u.userId;

        if (u.houseId) {
          this.getHouseholdById(u.houseId).subscribe({
            next: (household) => this.householdName.set(household.name),
            error: (error) =>
              this.logger.error('Failed to load household', error),
          });
          this.loadPeopleForHousehold(u.houseId);
        }
      } else {
        this.form.reset({
          userId: 0,
          userName: '',
          name: '',
          userType: 1,
          houseId: '',
          peopleId: '',
        });
        this.peopleOptions.set([]);
        this.userId = 0;
        this.householdName.set('');
        this.householdSearchText.set('');
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
      peopleId: [''],
      pword: [''],
    });

    // Disable until a household is chosen
    this.form.get('peopleId')?.disable();

    this.route.queryParams.subscribe((params) => {
      if (params['houseId'] && params['personId']) {
        const houseId = Number(params['houseId']);
        const personId = Number(params['personId']);
        const name = params['name'] || '';

        this.getHouseholdById(houseId).subscribe({
          next: (household) => {
            this.householdName.set(household.name);
            this.form.patchValue({ houseId, name });
          },
          error: (error) => {
            this.logger.error('Failed to load household', error);
            this.snack.open('Failed to load household', 'Close', {
              duration: 3000,
            });
          },
        });

        this.loadPeopleForHousehold(houseId);
        setTimeout(() => this.form.patchValue({ peopleId: personId }), 100);
      }
    });
  }

  /** Used by mat-autocomplete [displayWith] to show the name string in the input. */
  displayHousehold = (value: Household | null): string => value?.name ?? '';

  /** Called on every keystroke in the household search input. */
  onHouseholdSearchInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.householdSearchText.set(text);
    // Clear any prior selection immediately so the form stays consistent
    this.form.get('houseId')?.setValue('', { emitEvent: false });
    this.form.get('peopleId')?.setValue('', { emitEvent: false });
    this.form.get('peopleId')?.disable();
    this.peopleOptions.set([]);
  }

  /** Called when the user picks an option from the autocomplete panel. */
  onHouseholdSelected(event: MatAutocompleteSelectedEvent): void {
    const household = event.option.value as Household;
    this.householdSearchText.set(household.name ?? '');
    this.form.get('houseId')?.setValue(household.houseId);
    this.form.get('houseId')?.markAsDirty();
    this.loadPeopleForHousehold(household.houseId);
  }

  private getHouseholdById(houseId: number): Observable<Household> {
    return this.http.get<Household>(
      `${Constants.GET_HOUSEHOLD_BY_ID_URL}/${houseId}`
    );
  }

  private loadPeopleForHousehold(houseId: number): void {
    this.peopleService.getHouseholdMembersObservable(houseId).subscribe({
      next: (people) => {
        const sorted = [...people].sort((a, b) => {
          const last = a.lastName.localeCompare(b.lastName);
          return last !== 0 ? last : a.firstName.localeCompare(b.firstName);
        });
        this.peopleOptions.set(sorted);
        this.form.get('peopleId')?.enable();
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

  save(): void {
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

  cancel(): void {
    this.snack.open('Canceled', undefined, { duration: 1200 });
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  isFormDirty(): boolean {
    return this.hasUnsavedChanges();
  }
}
