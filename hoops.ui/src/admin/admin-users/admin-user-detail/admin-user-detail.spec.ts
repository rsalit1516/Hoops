import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AdminUserDetail } from './admin-user-detail';
import { AdminUsersService } from '../admin-users.service';
import { HouseholdService } from '@app/services/household.service';
import { PeopleService } from '@app/services/people.service';
import { LoggerService } from '@app/services/logging.service';
import { Household } from '@app/domain/household';
import { Person } from '@app/domain/person';

describe('AdminUserDetail', () => {
  let component: AdminUserDetail;
  let fixture: ComponentFixture<AdminUserDetail>;
  let householdServiceSpy: jasmine.SpyObj<HouseholdService>;
  let peopleServiceSpy: jasmine.SpyObj<PeopleService>;
  let httpMock: HttpTestingController;

  const mockHouseholds: Household[] = [
    { houseId: 1, name: 'Alpha Household' } as Household,
    { houseId: 2, name: 'Beta Household' } as Household,
  ];

  const mockPeople: Person[] = [
    { personId: 1, firstName: 'John', lastName: 'Doe', houseId: 1 } as Person,
    { personId: 2, firstName: 'Jane', lastName: 'Smith', houseId: 1 } as Person,
    { personId: 3, firstName: 'Bob', lastName: 'Johnson', houseId: 1 } as Person,
  ];

  beforeEach(async () => {
    const householdSpy = jasmine.createSpyObj('HouseholdService', [
      'searchByName',
    ]);
    const peopleSpy = jasmine.createSpyObj('PeopleService', [
      'getHouseholdMembersObservable',
    ]);
    const adminUsersSpy = { selectedUser: signal<any>(null) };
    const loggerSpy = jasmine.createSpyObj('LoggerService', ['error', 'info']);

    await TestBed.configureTestingModule({
      imports: [
        AdminUserDetail,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: HouseholdService, useValue: householdSpy },
        { provide: PeopleService, useValue: peopleSpy },
        { provide: AdminUsersService, useValue: adminUsersSpy },
        { provide: LoggerService, useValue: loggerSpy },
      ],
    }).compileComponents();

    householdServiceSpy = TestBed.inject(HouseholdService) as jasmine.SpyObj<HouseholdService>;
    peopleServiceSpy = TestBed.inject(PeopleService) as jasmine.SpyObj<PeopleService>;
    httpMock = TestBed.inject(HttpTestingController);

    householdServiceSpy.searchByName.and.returnValue(of(mockHouseholds));
    peopleServiceSpy.getHouseholdMembersObservable.and.returnValue(of(mockPeople));

    fixture = TestBed.createComponent(AdminUserDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.match(() => true).forEach((r) => r.flush(null));
    httpMock.verify();
  });

  // ── Creation ────────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── Form initialisation ─────────────────────────────────────────────────────

  it('should initialise model with empty values for a new user', () => {
    expect(component.model().houseId).toBeNull();
    expect(component.model().peopleId).toBeNull();
    expect(component.model().userType).toBe(1);
    expect(component.userId()).toBe(0);
  });

  it('should have peopleSelectEnabled false on init until a household is selected', () => {
    expect(component.peopleSelectEnabled()).toBeFalse();
  });

  it('should expose houseId and peopleId fields on the signal form', () => {
    expect(component.userForm.houseId).toBeDefined();
    expect(component.userForm.peopleId).toBeDefined();
  });

  // ── displayHousehold ────────────────────────────────────────────────────────

  it('displayHousehold — positive: returns the household name', () => {
    const h = { houseId: 1, name: 'Test Household' } as Household;
    expect(component.displayHousehold(h)).toBe('Test Household');
  });

  it('displayHousehold — negative: returns empty string for null', () => {
    expect(component.displayHousehold(null)).toBe('');
  });

  it('displayHousehold — negative: returns empty string when name is undefined', () => {
    const h = { houseId: 1 } as Household;
    expect(component.displayHousehold(h)).toBe('');
  });

  // ── onHouseholdSearchInput ──────────────────────────────────────────────────

  it('onHouseholdSearchInput — positive: updates householdSearchText signal', () => {
    const event = { target: { value: 'Smith' } } as unknown as Event;
    component.onHouseholdSearchInput(event);
    expect(component.householdSearchText()).toBe('Smith');
  });

  it('onHouseholdSearchInput — negative: clears houseId in model', () => {
    component.userForm.houseId().value.set(42);

    const event = { target: { value: 'new text' } } as unknown as Event;
    component.onHouseholdSearchInput(event);

    expect(component.model().houseId).toBeNull();
  });

  it('onHouseholdSearchInput — negative: clears peopleId and disables the select', () => {
    component.peopleSelectEnabled.set(true);
    component.userForm.peopleId().value.set(5);

    const event = { target: { value: 'x' } } as unknown as Event;
    component.onHouseholdSearchInput(event);

    expect(component.model().peopleId).toBeNull();
    expect(component.peopleSelectEnabled()).toBeFalse();
  });

  it('onHouseholdSearchInput — negative: clears peopleOptions', () => {
    component.peopleOptions.set(mockPeople);

    const event = { target: { value: '' } } as unknown as Event;
    component.onHouseholdSearchInput(event);

    expect(component.peopleOptions()).toEqual([]);
  });

  // ── onHouseholdSelected ─────────────────────────────────────────────────────

  it('onHouseholdSelected — positive: sets houseId in model', () => {
    const household = { houseId: 3, name: 'Gamma Household' } as Household;
    const event = { option: { value: household } } as MatAutocompleteSelectedEvent;

    component.onHouseholdSelected(event);

    expect(component.model().houseId).toBe(3);
  });

  it('onHouseholdSelected — positive: marks the form as dirty', () => {
    const household = { houseId: 3, name: 'Gamma Household' } as Household;
    const event = { option: { value: household } } as MatAutocompleteSelectedEvent;

    component.onHouseholdSelected(event);

    expect(component.isDirty()).toBeTrue();
  });

  it('onHouseholdSelected — positive: updates householdSearchText to the name', () => {
    const household = { houseId: 3, name: 'Gamma Household' } as Household;
    const event = { option: { value: household } } as MatAutocompleteSelectedEvent;

    component.onHouseholdSelected(event);

    expect(component.householdSearchText()).toBe('Gamma Household');
  });

  it('onHouseholdSelected — positive: loads people for the selected household', () => {
    const household = { houseId: 3, name: 'Gamma Household' } as Household;
    const event = { option: { value: household } } as MatAutocompleteSelectedEvent;

    component.onHouseholdSelected(event);

    expect(peopleServiceSpy.getHouseholdMembersObservable).toHaveBeenCalledWith(3);
  });

  it('onHouseholdSelected — negative: household with no name sets search text to empty', () => {
    const household = { houseId: 4 } as Household;
    const event = { option: { value: household } } as MatAutocompleteSelectedEvent;

    component.onHouseholdSelected(event);

    expect(component.householdSearchText()).toBe('');
  });

  // ── filteredHouseholds signal (debounced search) ─────────────────────────────

  it('filteredHouseholds — positive: calls searchByName after 300 ms debounce for ≥2 chars', fakeAsync(() => {
    // IMPORTANT: The component MUST be created inside fakeAsync.
    // Angular 21's ZoneAwareEffectScheduler stores Zone.current at effect creation time
    // (node.zone). If created in beforeEach (async/testProxyZone), debounceTime timers
    // are registered in that zone — invisible to tick(). Creating here ensures
    // node.zone = fakeAsyncZone so tick(300) can fire them.
    const localFixture = TestBed.createComponent(AdminUserDetail);
    const localComponent = localFixture.componentInstance;
    localFixture.detectChanges();
    householdServiceSpy.searchByName.and.returnValue(of(mockHouseholds));

    localComponent.householdSearchText.set('Sm');
    localFixture.detectChanges(); // flush the toObservable effect in fakeAsync zone
    tick(300);                    // fire the debounce timer

    expect(householdServiceSpy.searchByName).toHaveBeenCalledWith('Sm');
    expect(localComponent.filteredHouseholds()).toEqual(mockHouseholds);
  }));

  it('filteredHouseholds — negative: does not call searchByName for < 2 chars', fakeAsync(() => {
    householdServiceSpy.searchByName.calls.reset();

    component.householdSearchText.set('S');
    flushMicrotasks();
    tick(300);

    expect(householdServiceSpy.searchByName).not.toHaveBeenCalled();
    expect(component.filteredHouseholds()).toEqual([]);
  }));

  it('filteredHouseholds — negative: returns empty array on HTTP error', fakeAsync(() => {
    householdServiceSpy.searchByName.and.returnValue(throwError(() => new Error('Network error')));

    component.householdSearchText.set('Er');
    flushMicrotasks();
    tick(300);

    expect(component.filteredHouseholds()).toEqual([]);
  }));

  it('filteredHouseholds — debounce: only calls API once for rapid keystrokes', fakeAsync(() => {
    // Must create inside fakeAsync — see zone mismatch note in the positive test above.
    const localFixture = TestBed.createComponent(AdminUserDetail);
    const localComponent = localFixture.componentInstance;
    localFixture.detectChanges();
    householdServiceSpy.searchByName.calls.reset();

    localComponent.householdSearchText.set('S');
    localFixture.detectChanges();
    tick(100);
    localComponent.householdSearchText.set('Sm');
    localFixture.detectChanges();
    tick(100);
    localComponent.householdSearchText.set('Smi');
    localFixture.detectChanges();
    tick(300);

    expect(householdServiceSpy.searchByName).toHaveBeenCalledTimes(1);
    expect(householdServiceSpy.searchByName).toHaveBeenCalledWith('Smi');
  }));

  // ── loadPeopleForHousehold — sorting ────────────────────────────────────────

  it('loadPeopleForHousehold — positive: sorts people by last name then first name', () => {
    const unsorted: Person[] = [
      { personId: 1, firstName: 'John', lastName: 'Zebra', houseId: 1 } as Person,
      { personId: 2, firstName: 'Bob', lastName: 'Alpha', houseId: 1 } as Person,
      { personId: 3, firstName: 'Alice', lastName: 'Alpha', houseId: 1 } as Person,
    ];
    peopleServiceSpy.getHouseholdMembersObservable.and.returnValue(of(unsorted));

    const household = { houseId: 5, name: 'Test' } as Household;
    const event = { option: { value: household } } as MatAutocompleteSelectedEvent;
    component.onHouseholdSelected(event);

    const sorted = component.peopleOptions();
    expect(sorted[0].lastName).toBe('Alpha');
    expect(sorted[0].firstName).toBe('Alice');
    expect(sorted[1].lastName).toBe('Alpha');
    expect(sorted[1].firstName).toBe('Bob');
    expect(sorted[2].lastName).toBe('Zebra');
  });

  it('loadPeopleForHousehold — positive: enables peopleSelectEnabled after load', () => {
    const household = { houseId: 1, name: 'Alpha' } as Household;
    const event = { option: { value: household } } as MatAutocompleteSelectedEvent;

    component.onHouseholdSelected(event);

    expect(component.peopleSelectEnabled()).toBeTrue();
  });

  it('loadPeopleForHousehold — negative: clears peopleOptions on error', () => {
    peopleServiceSpy.getHouseholdMembersObservable.and.returnValue(
      throwError(() => new Error('load error'))
    );

    const household = { houseId: 99, name: 'Error House' } as Household;
    const event = { option: { value: household } } as MatAutocompleteSelectedEvent;
    component.onHouseholdSelected(event);

    expect(component.peopleOptions()).toEqual([]);
  });

  // ── showHouseholdDropdown computed ──────────────────────────────────────────

  it('showHouseholdDropdown — true when userId is 0 and no householdName', () => {
    component.userId.set(0);
    component.householdName.set('');
    expect(component.showHouseholdDropdown()).toBeTrue();
  });

  it('showHouseholdDropdown — false when householdName is set', () => {
    component.userId.set(0);
    component.householdName.set('Some House');
    expect(component.showHouseholdDropdown()).toBeFalse();
  });

  it('showHouseholdDropdown — false when editing an existing user (userId > 0)', () => {
    component.userId.set(7);
    component.householdName.set('Loaded Household');
    expect(component.showHouseholdDropdown()).toBeFalse();
  });
});
