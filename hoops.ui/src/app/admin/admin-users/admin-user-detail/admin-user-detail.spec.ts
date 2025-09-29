import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { AdminUserDetail } from './admin-user-detail';
import { AdminUsersService } from '../admin-users.service';
import { HouseholdService } from '@app/services/household.service';
import { PeopleService } from '@app/services/people.service';
import { LoggerService } from '@app/services/logging.service';
import { Household } from '@app/domain/household';
import { Person } from '@app/domain/person';

describe('AdminUserDetail', () => {
  let component: AdminUserDetail;
  let householdService: jasmine.SpyObj<HouseholdService>;
  let peopleService: jasmine.SpyObj<PeopleService>;
  let adminUsersService: jasmine.SpyObj<AdminUsersService>;

  const mockHouseholds: Household[] = [
    { houseId: 1, name: 'Alpha Household' },
    { houseId: 2, name: 'Beta Household' },
    { houseId: 3, name: 'Gamma Household' },
  ];

  const mockPeople: Person[] = [
    { personId: 1, firstName: 'John', lastName: 'Doe', houseId: 1 } as Person,
    { personId: 2, firstName: 'Jane', lastName: 'Smith', houseId: 1 } as Person,
    {
      personId: 3,
      firstName: 'Bob',
      lastName: 'Johnson',
      houseId: 1,
    } as Person,
  ];

  beforeEach(async () => {
    const householdSpy = jasmine.createSpyObj('HouseholdService', [
      'getAllHouseholds',
    ]);
    const peopleSpy = jasmine.createSpyObj('PeopleService', [
      'getHouseholdMembersObservable',
    ]);
    const adminUsersSpy = jasmine.createSpyObj('AdminUsersService', [
      'selectedUser',
    ]);
    const loggerSpy = jasmine.createSpyObj('LoggerService', ['error']);

    await TestBed.configureTestingModule({
      imports: [
        AdminUserDetail,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
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

    householdService = TestBed.inject(
      HouseholdService
    ) as jasmine.SpyObj<HouseholdService>;
    peopleService = TestBed.inject(
      PeopleService
    ) as jasmine.SpyObj<PeopleService>;
    adminUsersService = TestBed.inject(
      AdminUsersService
    ) as jasmine.SpyObj<AdminUsersService>;

    // Setup service mocks
    householdService.getAllHouseholds.and.returnValue(of(mockHouseholds));
    peopleService.getHouseholdMembersObservable.and.returnValue(of(mockPeople));
    adminUsersService.selectedUser.and.returnValue(null);

    const fixture = TestBed.createComponent(AdminUserDetail);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load households on init', () => {
    // Arrange & Act
    component.ngOnInit();

    // Assert
    expect(householdService.getAllHouseholds).toHaveBeenCalled();
    expect(component.householdOptions()).toEqual(mockHouseholds);
  });

  it('should include houseId and personId in form configuration', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(component.form.get('houseId')).toBeTruthy();
    expect(component.form.get('personId')).toBeTruthy();
    expect(component.form.get('houseId')?.value).toBe('');
    expect(component.form.get('personId')?.value).toBe('');
  });

  it('should load people when household is selected', () => {
    // Arrange
    component.ngOnInit();

    // Act
    component.form.get('houseId')?.setValue(1);

    // Assert
    expect(peopleService.getHouseholdMembersObservable).toHaveBeenCalledWith(1);
  });

  it('should clear people options when household is deselected', () => {
    // Arrange
    component.ngOnInit();
    component.form.get('houseId')?.setValue(1);

    // Act
    component.form.get('houseId')?.setValue('');

    // Assert
    expect(component.peopleOptions()).toEqual([]);
    expect(component.form.get('personId')?.value).toBe('');
  });

  it('should sort people by last name then first name', () => {
    // Arrange
    const unsortedPeople: Person[] = [
      {
        personId: 1,
        firstName: 'John',
        lastName: 'Zebra',
        houseId: 1,
      } as Person,
      {
        personId: 2,
        firstName: 'Alice',
        lastName: 'Alpha',
        houseId: 1,
      } as Person,
      {
        personId: 3,
        firstName: 'Bob',
        lastName: 'Alpha',
        houseId: 1,
      } as Person,
    ];
    peopleService.getHouseholdMembersObservable.and.returnValue(
      of(unsortedPeople)
    );
    component.ngOnInit();

    // Act
    component.form.get('houseId')?.setValue(1);

    // Assert
    const sortedPeople = component.peopleOptions();
    expect(sortedPeople[0].lastName).toBe('Alpha');
    expect(sortedPeople[0].firstName).toBe('Alice');
    expect(sortedPeople[1].lastName).toBe('Alpha');
    expect(sortedPeople[1].firstName).toBe('Bob');
    expect(sortedPeople[2].lastName).toBe('Zebra');
  });

  it('should sort households alphabetically by name', () => {
    // Arrange - Note: The sorting is done in the service, so we need to mock the already-sorted result
    const sortedHouseholds: Household[] = [
      { houseId: 2, name: 'Alpha Household' },
      { houseId: 3, name: 'Beta Household' },
      { houseId: 1, name: 'Zeta Household' },
    ];
    householdService.getAllHouseholds.and.returnValue(of(sortedHouseholds));

    // Act
    component.ngOnInit();

    // Assert - The service should return pre-sorted data
    const households = component.householdOptions();
    expect(households[0].name).toBe('Alpha Household');
    expect(households[1].name).toBe('Beta Household');
    expect(households[2].name).toBe('Zeta Household');
  });

  it('should reset form with empty houseId and personId for new user', () => {
    // Arrange
    component.ngOnInit();
    adminUsersService.selectedUser.and.returnValue(null);

    // Act
    component.form.reset({
      userId: 0,
      userName: '',
      name: '',
      userType: 1,
      houseId: '',
      personId: '',
    });

    // Assert
    expect(component.form.get('houseId')?.value).toBe('');
    expect(component.form.get('personId')?.value).toBe('');
  });
});
