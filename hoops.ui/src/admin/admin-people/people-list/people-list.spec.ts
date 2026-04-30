import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { PeopleList } from './people-list';
import { PeopleService } from '@app/services/people.service';
import { HouseholdService } from '@app/services/household.service';
import { LoggerService } from '@app/services/logger.service';
import { Person } from '@app/domain/person';

describe('PeopleList', () => {
  const makePerson = (overrides: Partial<Person>) =>
    Object.assign(new Person(), { houseId: 0, gender: '', ...overrides });

  const mockPeople = [
    makePerson({
      personId: 1,
      firstName: 'Alice',
      lastName: 'Smith',
      player: true,
    }),
    makePerson({
      personId: 2,
      firstName: 'Bob',
      lastName: 'Jones',
      player: false,
    }),
  ];

  let fixture: ComponentFixture<PeopleList>;
  let component: PeopleList;
  let router: Router;

  beforeEach(async () => {
    localStorage.removeItem('peopleSearchCriteria');

    await TestBed.configureTestingModule({
      imports: [PeopleList],
      providers: [
        provideRouter([]),
        {
          provide: PeopleService,
          useValue: {
            results: signal(mockPeople),
            updateSelectedCriteria: jasmine.createSpy('updateSelectedCriteria'),
            updateSelectedPerson: jasmine.createSpy('updateSelectedPerson'),
            loadAndSelectPerson: jasmine.createSpy('loadAndSelectPerson'),
          },
        },
        {
          provide: HouseholdService,
          useValue: {
            selectedHouseholdByHouseId: jasmine.createSpy(
              'selectedHouseholdByHouseId',
            ),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            info: jasmine.createSpy(),
            warn: jasmine.createSpy(),
            error: jasmine.createSpy(),
            debug: jasmine.createSpy(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleList);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges(); // initial render + ngAfterViewInit, queues Promise
    await fixture.whenStable(); // flushes Promise.resolve microtask
    fixture.detectChanges(); // re-renders table with register column
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show Register button only for players', () => {
    const allButtons = Array.from(
      fixture.nativeElement.querySelectorAll(
        'button',
      ) as NodeListOf<HTMLButtonElement>,
    );
    const registerButtons = allButtons.filter(
      (b) => b.textContent?.trim() === 'Register',
    );
    expect(registerButtons.length).toBe(1);
  });

  it('should not show Register button for non-players', () => {
    const rows = Array.from(
      fixture.nativeElement.querySelectorAll(
        'tr[mat-row]',
      ) as NodeListOf<HTMLElement>,
    );
    const bobRow = rows.find((r) => r.textContent?.includes('Bob'));
    const registerBtn = bobRow?.querySelector('button');
    expect(registerBtn).toBeNull();
  });

  it('onRegister sets selected person before navigating', () => {
    const peopleService = TestBed.inject(PeopleService) as any;
    const mockEvent = {
      stopPropagation: jasmine.createSpy(),
    } as unknown as Event;
    const alice = { ...mockPeople[0], id: 1 } as any;
    component.onRegister(mockEvent, alice);
    expect(peopleService.loadAndSelectPerson).toHaveBeenCalledWith(1, alice);
  });

  it('onRegister navigates to player-registration with personId', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const mockEvent = {
      stopPropagation: jasmine.createSpy(),
    } as unknown as Event;
    component.onRegister(mockEvent, { ...mockPeople[0], id: 1 } as any);
    expect(navigateSpy).toHaveBeenCalledWith(
      ['/admin/player-registration', 1],
      { queryParams: { from: 'people' } },
    );
  });

  it('onRegister stops event propagation to prevent row navigation', () => {
    const mockEvent = {
      stopPropagation: jasmine.createSpy('stopPropagation'),
    } as unknown as Event;
    component.onRegister(mockEvent, { ...mockPeople[0], id: 1 } as any);
    expect((mockEvent as any).stopPropagation).toHaveBeenCalled();
  });
});
