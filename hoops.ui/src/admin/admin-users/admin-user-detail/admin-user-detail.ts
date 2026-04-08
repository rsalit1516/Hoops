import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  Signal,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
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
import { form, FormField } from '@angular/forms/signals';
import { AdminUsersService } from '../admin-users.service';
import { User } from '@app/domain/user';
import { LoggerService } from '@app/services/logging.service';
import { HouseholdService } from '@app/services/household.service';
import { PeopleService } from '@app/services/people.service';
import { Household } from '@app/domain/household';
import { Person } from '@app/domain/person';
import { Constants } from '@app/shared/constants';

interface UserEditModel {
  userName: string;
  name: string;
  userType: number;
  houseId: number | null;
  peopleId: number | null;
  pword: string;
}

@Component({
  selector: 'app-admin-user-detail',
  standalone: true,
  imports: [
    FormField,
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
export class AdminUserDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private usersService = inject(AdminUsersService);
  private householdService = inject(HouseholdService);
  private peopleService = inject(PeopleService);
  private snack = inject(MatSnackBar);
  private logger = inject(LoggerService);

  readonly userId = signal(0);
  readonly isSaving = signal(false);
  readonly householdName = signal<string>('');
  readonly peopleSelectEnabled = signal(false);

  readonly model = signal<UserEditModel>({
    userName: '',
    name: '',
    userType: 1,
    houseId: null,
    peopleId: null,
    pword: '',
  });

  readonly userForm = form(this.model);

  private readonly initialSnapshot = signal<UserEditModel | null>(null);

  readonly isDirty = computed(() => {
    const initial = this.initialSnapshot();
    if (!initial) return false;
    const m = this.model();
    return (
      initial.userName !== m.userName ||
      initial.name !== m.name ||
      initial.userType !== m.userType ||
      initial.houseId !== m.houseId ||
      initial.peopleId !== m.peopleId ||
      initial.pword !== m.pword
    );
  });

  readonly isValid = computed(() => {
    const m = this.model();
    return m.userName.trim().length > 0 && m.userName.length <= 100;
  });

  readonly isNewRecord = computed(() => this.userId() === 0);

  readonly canSave = computed(() => {
    if (this.isSaving()) return false;
    return this.isNewRecord()
      ? this.isValid()
      : this.isDirty() && this.isValid();
  });

  readonly showHouseholdDropdown = computed(
    () => this.isNewRecord() && !this.householdName()
  );

  readonly userTypeOptions = [
    { value: 1, label: 'User' },
    { value: 2, label: 'Director' },
    { value: 3, label: 'Admin' },
  ];

  householdSearchText = signal<string>('');
  filteredHouseholds!: Signal<Household[]>;
  readonly peopleOptions = signal<Person[]>([]);

  constructor() {
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
      untracked(() => {
        if (u) {
          this.userForm.userName().value.set(u.userName ?? '');
          this.userForm.name().value.set(u.name ?? '');
          this.userForm.userType().value.set(u.userType ?? 1);
          this.userForm.houseId().value.set(u.houseId ?? null);
          this.userForm.peopleId().value.set(u.peopleId ?? null);
          this.userForm.pword().value.set('');
          this.userId.set(u.userId);
          this.initialSnapshot.set({ ...this.model() });

          if (u.houseId) {
            this.getHouseholdById(u.houseId).subscribe({
              next: (household) => this.householdName.set(household.name),
              error: (err) =>
                this.logger.error('Failed to load household', err),
            });
            this.loadPeopleForHousehold(u.houseId);
          }
        } else {
          this.userForm.userName().value.set('');
          this.userForm.name().value.set('');
          this.userForm.userType().value.set(1);
          this.userForm.houseId().value.set(null);
          this.userForm.peopleId().value.set(null);
          this.userForm.pword().value.set('');
          this.userId.set(0);
          this.initialSnapshot.set({ ...this.model() });
          this.peopleOptions.set([]);
          this.peopleSelectEnabled.set(false);
          this.householdName.set('');
          this.householdSearchText.set('');
        }
      });
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['houseId'] && params['personId']) {
        const houseId = Number(params['houseId']);
        const personId = Number(params['personId']);
        const name = params['name'] || '';

        this.getHouseholdById(houseId).subscribe({
          next: (household) => {
            this.householdName.set(household.name);
            this.userForm.houseId().value.set(houseId);
            this.userForm.name().value.set(name);
          },
          error: (err) => {
            this.logger.error('Failed to load household', err);
            this.snack.open('Failed to load household', 'Close', {
              duration: 3000,
            });
          },
        });

        this.loadPeopleForHousehold(houseId);
        setTimeout(() => {
          this.userForm.peopleId().value.set(personId);
        }, 100);
      }
    });
  }

  /** Used by mat-autocomplete [displayWith] to show the name string in the input. */
  displayHousehold = (value: Household | null): string => value?.name ?? '';

  /** Called on every keystroke in the household search input. */
  onHouseholdSearchInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.householdSearchText.set(text);
    this.userForm.houseId().value.set(null);
    this.userForm.peopleId().value.set(null);
    this.peopleOptions.set([]);
    this.peopleSelectEnabled.set(false);
  }

  /** Called when the user picks an option from the autocomplete panel. */
  onHouseholdSelected(event: MatAutocompleteSelectedEvent): void {
    const household = event.option.value as Household;
    this.householdSearchText.set(household.name ?? '');
    this.userForm.houseId().value.set(household.houseId);
    this.loadPeopleForHousehold(household.houseId);
  }

  onPersonSelected(personId: number | null): void {
    this.userForm.peopleId().value.set(personId);
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
        this.peopleSelectEnabled.set(true);
      },
      error: (err) => {
        this.logger.error('Failed to load people for household', err);
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
    const m = this.model();
    const isNew = this.isNewRecord();

    const payload: Partial<User> = {
      userId: this.userId(),
      userName: m.userName,
      isAdmin: m.userType >= 3,
      name: m.name || undefined,
      houseId: m.houseId ?? undefined,
      peopleId: m.peopleId ?? undefined,
      userType: m.userType,
      pword: m.pword || undefined,
    };

    if (isNew) {
      this.usersService.createUser(payload as User).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.initialSnapshot.set({ ...this.model() });
          this.snack.open('User created', 'Close', { duration: 2500 });
          this.router.navigate(['/admin/users']);
        },
        error: () => {
          this.isSaving.set(false);
          this.snack.open('Failed to create user', 'Close', { duration: 3000 });
        },
      });
    } else {
      this.usersService.updateUser(payload as User).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.initialSnapshot.set({ ...this.model() });
          this.snack.open('User updated', 'Close', { duration: 2500 });
          this.router.navigate(['/admin/users']);
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
    this.router.navigate(['/admin/users']);
  }

  isFormDirty(): boolean {
    return this.isDirty();
  }
}
