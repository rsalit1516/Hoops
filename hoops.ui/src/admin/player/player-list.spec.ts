import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { PlayerList } from './player-list';
import { DraftListPlayer } from '@app/domain/draft-list-player';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';
import { LoggerService } from '@app/services/logger.service';
import { PeopleService } from '@app/services/people.service';
import { Constants } from '@app/shared/constants';
import { Season } from '@app/domain/season';
import { Division } from '@app/domain/division';
import { signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PlayerList', () => {
  let component: PlayerList;
  let fixture: ComponentFixture<PlayerList>;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSeasonService: jasmine.SpyObj<SeasonService>;
  let mockDivisionService: jasmine.SpyObj<DivisionService>;
  let mockLoggerService: jasmine.SpyObj<LoggerService>;
  let mockPeopleService: jasmine.SpyObj<PeopleService>;

  const mockSeason: Season = {
    seasonId: 1,
    description: 'Fall 2023',
    fromDate: new Date(),
    toDate: new Date(),
    participationFee: 100,
    currentSeason: true,
    currentSchedule: false,
    currentSignUps: false,
    gameSchedules: false,
    onlineRegistration: false,
  };

  const mockDivision: Division = {
    divisionId: 5,
    divisionDescription: 'HS Boys',
    seasonId: 1,
    minDate: new Date(),
    maxDate: new Date(),
    gender: 'M',
    minDate2: new Date(),
    maxDate2: new Date(),
    gender2: 'M',
    directorId: null,
  };

  const mockPlayers: DraftListPlayer[] = [
    {
      personId: 1,
      division: 'HS Boys',
      draftId: '001',
      lastName: 'Smith',
      firstName: 'John',
      dob: new Date('2005-01-01'),
      grade: 11,
      address1: '123 Main St',
      city: 'Anytown',
      zip: '12345',
    },
    {
      personId: 2,
      division: 'HS Boys',
      draftId: '002',
      lastName: 'Johnson',
      firstName: 'Mike',
      dob: new Date('2006-03-15'),
      grade: 10,
      address1: '456 Oak Ave',
      city: 'Sometown',
      zip: '67890',
    },
  ];

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSeasonService = jasmine.createSpyObj(
      'SeasonService',
      ['fetchSeasons', 'fetchCurrentSeason'],
      {
        selectedSeason: signal(mockSeason),
        currentSeason: signal(mockSeason),
        seasons: [mockSeason],
      },
    );
    mockDivisionService = jasmine.createSpyObj('DivisionService', [], {
      selectedDivision: signal(mockDivision),
      seasonDivisions: signal([mockDivision]),
    });
    mockLoggerService = jasmine.createSpyObj('LoggerService', [
      'info',
      'warn',
      'error',
      'debug',
    ]);
    mockPeopleService = jasmine.createSpyObj('PeopleService', [
      'loadAndSelectPerson',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        PlayerList,
        HttpClientTestingModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SeasonService, useValue: mockSeasonService },
        { provide: DivisionService, useValue: mockDivisionService },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: PeopleService, useValue: mockPeopleService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerList);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load players on init when season is available', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(
      `${Constants.GET_SEASON_PLAYERS_URL}/1?divisionId=5`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPlayers);

    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0].lastName).toBe('Smith');
  });

  it('should update players when season changes', () => {
    fixture.detectChanges();

    // Initial load
    let req = httpMock.expectOne(
      `${Constants.GET_SEASON_PLAYERS_URL}/1?divisionId=5`,
    );
    req.flush(mockPlayers);

    // Change season
    const newSeason = { ...mockSeason, seasonId: 2 };
    mockSeasonService.selectedSeason.set(newSeason);
    fixture.detectChanges();

    req = httpMock.expectOne(
      `${Constants.GET_SEASON_PLAYERS_URL}/2?divisionId=5`,
    );
    req.flush([mockPlayers[0]]);

    expect(component.dataSource.data.length).toBe(1);
  });

  it('should update players when division changes', () => {
    fixture.detectChanges();

    // Initial load
    let req = httpMock.expectOne(
      `${Constants.GET_SEASON_PLAYERS_URL}/1?divisionId=5`,
    );
    req.flush(mockPlayers);

    // Change division
    const newDivision = { ...mockDivision, divisionId: 6 };
    mockDivisionService.selectedDivision.set(newDivision);
    fixture.detectChanges();

    req = httpMock.expectOne(
      `${Constants.GET_SEASON_PLAYERS_URL}/1?divisionId=6`,
    );
    req.flush([mockPlayers[1]]);

    expect(component.dataSource.data.length).toBe(1);
  });

  it('should navigate to player registration on row click', () => {
    component.onRowClick(mockPlayers[0]);

    expect(mockPeopleService.loadAndSelectPerson).toHaveBeenCalledWith(
      1,
      jasmine.anything(),
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/admin/player-registration',
      1,
    ]);
  });

  it('should set isLoading to true while fetching', () => {
    fixture.detectChanges();

    expect(component.isLoading).toBe(true);

    const req = httpMock.expectOne(
      `${Constants.GET_SEASON_PLAYERS_URL}/1?divisionId=5`,
    );
    req.flush(mockPlayers);

    expect(component.isLoading).toBe(false);
  });

  it('should handle HTTP errors gracefully', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(
      `${Constants.GET_SEASON_PLAYERS_URL}/1?divisionId=5`,
    );
    req.error(new ProgressEvent('error'));

    expect(component.isLoading).toBe(false);
    expect(mockLoggerService.error).toHaveBeenCalled();
  });

  it('should display player data in correct columns', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(
      `${Constants.GET_SEASON_PLAYERS_URL}/1?divisionId=5`,
    );
    req.flush(mockPlayers);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const rows = compiled.querySelectorAll('tr.mat-mdc-row');

    expect(rows.length).toBe(2);
    expect(compiled.textContent).toContain('Smith, John');
    expect(compiled.textContent).toContain('001');
    expect(compiled.textContent).toContain('HS Boys');
  });
});
