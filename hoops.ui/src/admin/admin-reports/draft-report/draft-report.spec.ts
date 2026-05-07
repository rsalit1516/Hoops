/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DraftReport } from './draft-report';
import { DraftReportService } from '@app/services/draft-report.service';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';
import { LoggerService } from '@app/services/logger.service';
import { DraftReportPlayer } from '@app/domain/draft-report-player';
import { Division } from '@app/domain/division';
import { Season } from '@app/domain/season';

const makePlayer = (overrides: Partial<DraftReportPlayer>): DraftReportPlayer =>
  Object.assign(new DraftReportPlayer(), overrides);

describe('DraftReport', () => {
  let component: DraftReport;
  let fixture: ComponentFixture<DraftReport>;
  let httpMock: HttpTestingController;

  const selectedSeasonSignal = signal<Season | undefined>(undefined);
  const selectedDivisionSignal = signal<Division | undefined>(undefined);
  const playersSignal = signal<DraftReportPlayer[]>([]);
  const isLoadingSignal = signal<boolean>(false);

  const mockDraftReportService = {
    get players() {
      return playersSignal.asReadonly();
    },
    get isLoading() {
      return isLoadingSignal.asReadonly();
    },
    getDraftReport: jasmine.createSpy('getDraftReport'),
    clearPlayers: jasmine.createSpy('clearPlayers'),
  };

  const mockSeasonService = {
    seasons: [] as Season[],
    selectedSeason: selectedSeasonSignal,
    currentSeason: undefined as Season | undefined,
    fetchSeasons: jasmine.createSpy('fetchSeasons'),
    fetchCurrentSeason: jasmine.createSpy('fetchCurrentSeason'),
    updateSelectedSeason: jasmine.createSpy('updateSelectedSeason'),
  };

  const mockDivisionService = {
    seasonDivisions: signal<Division[]>([]),
    selectedDivision: selectedDivisionSignal,
    updateSelectedDivision: jasmine.createSpy('updateSelectedDivision'),
  };

  const mockLoggerService = {
    info: () => {},
    debug: () => {},
    warn: () => {},
    error: () => {},
  };

  const mockSeason = Object.assign(new Season(), {
    seasonId: 1,
    description: 'Spring 2026',
  });
  const mockDivision = Object.assign(new Division(), {
    divisionId: 10,
    divisionDescription: 'U12 Boys',
    seasonId: 1,
  });
  const allDivisionsSentinel = Object.assign(new Division(), {
    divisionId: 0,
    divisionDescription: 'All Divisions',
    seasonId: 0,
  });

  const makePlayers = (): DraftReportPlayer[] => [
    makePlayer({ personId: 2, division: 'U14 Girls', draftId: '002', lastName: 'Smith',   firstName: 'Jane', dob: '2012-08-20T00:00:00' as any, phone: '555-222-2222', grade: 4 }),
    makePlayer({ personId: 1, division: 'U12 Boys',  draftId: '001', lastName: 'Johnson', firstName: 'John', dob: '2010-05-15T00:00:00' as any, phone: '555-111-1111', grade: 6 }),
  ];

  beforeEach(async () => {
    selectedSeasonSignal.set(undefined);
    selectedDivisionSignal.set(undefined);
    playersSignal.set([]);
    isLoadingSignal.set(false);
    mockDraftReportService.getDraftReport.calls.reset();

    await TestBed.configureTestingModule({
      imports: [DraftReport, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DraftReportService, useValue: mockDraftReportService },
        { provide: SeasonService, useValue: mockSeasonService },
        { provide: DivisionService, useValue: mockDivisionService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    httpMock
      .match((r) => r.url.includes('/api/auth/me'))
      .forEach((r) => r.flush(null));

    fixture = TestBed.createComponent(DraftReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.match(() => true).forEach((r) => r.flush([]));
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('showNoSelection', () => {
    it('should be true when no division is selected', () => {
      expect(component.showNoSelection).toBeTrue();
    });

    it('should be false when a division is selected', () => {
      selectedDivisionSignal.set(mockDivision);
      fixture.detectChanges();
      expect(component.showNoSelection).toBeFalse();
    });

    it('should be false when All Divisions sentinel is selected', () => {
      selectedDivisionSignal.set(allDivisionsSentinel);
      fixture.detectChanges();
      expect(component.showNoSelection).toBeFalse();
    });
  });

  describe('showReport', () => {
    it('should be false when no division is selected', () => {
      expect(component.showReport).toBeFalse();
    });

    it('should be true when a division is selected and not loading', () => {
      selectedDivisionSignal.set(mockDivision);
      fixture.detectChanges();
      expect(component.showReport).toBeTrue();
    });

    it('should be false while loading', () => {
      selectedDivisionSignal.set(mockDivision);
      isLoadingSignal.set(true);
      fixture.detectChanges();
      expect(component.showReport).toBeFalse();
    });
  });

  describe('groupedByDivision', () => {
    it('should return empty array when no players', () => {
      selectedDivisionSignal.set(mockDivision);
      fixture.detectChanges();
      expect(component.groupedByDivision()).toEqual([]);
    });

    it('should return a single group for a specific division', () => {
      playersSignal.set(makePlayers().filter((p) => p.division === 'U12 Boys'));
      selectedDivisionSignal.set(mockDivision);
      fixture.detectChanges();

      const groups = component.groupedByDivision();
      expect(groups.length).toBe(1);
      expect(groups[0].division).toBe('U12 Boys');
      expect(groups[0].players.length).toBe(1);
    });

    it('should group by division when All Divisions is selected', () => {
      playersSignal.set(makePlayers());
      selectedDivisionSignal.set(allDivisionsSentinel);
      fixture.detectChanges();

      const groups = component.groupedByDivision();
      expect(groups.length).toBe(2);
    });

    it('should sort groups alphabetically by division name', () => {
      playersSignal.set(makePlayers()); // U14 Girls listed first in data
      selectedDivisionSignal.set(allDivisionsSentinel);
      fixture.detectChanges();

      const groups = component.groupedByDivision();
      expect(groups[0].division).toBe('U12 Boys');
      expect(groups[1].division).toBe('U14 Girls');
    });

    it('should place multiple players in the correct group', () => {
      const twoU12Players = [
        makePlayer({ personId: 1, division: 'U12 Boys', draftId: '001', lastName: 'Aaron',   firstName: 'A' }),
        makePlayer({ personId: 2, division: 'U12 Boys', draftId: '002', lastName: 'Bennett',  firstName: 'B' }),
        makePlayer({ personId: 3, division: 'U14 Girls', draftId: '010', lastName: 'Carter', firstName: 'C' }),
      ];
      playersSignal.set(twoU12Players);
      selectedDivisionSignal.set(allDivisionsSentinel);
      fixture.detectChanges();

      const groups = component.groupedByDivision();
      const u12Group = groups.find((g) => g.division === 'U12 Boys');
      expect(u12Group?.players.length).toBe(2);
    });
  });

  describe('effect: getDraftReport', () => {
    it('should call getDraftReport when both season and division are set', () => {
      selectedSeasonSignal.set(mockSeason);
      selectedDivisionSignal.set(mockDivision);
      fixture.detectChanges();

      expect(mockDraftReportService.getDraftReport).toHaveBeenCalledWith(1, 10);
    });

    it('should not call getDraftReport when only season is set', () => {
      selectedSeasonSignal.set(mockSeason);
      fixture.detectChanges();
      expect(mockDraftReportService.getDraftReport).not.toHaveBeenCalled();
    });

    it('should not call getDraftReport when only division is set', () => {
      selectedDivisionSignal.set(mockDivision);
      fixture.detectChanges();
      expect(mockDraftReportService.getDraftReport).not.toHaveBeenCalled();
    });

    it('should pass null divisionId when All Divisions sentinel is selected', () => {
      selectedSeasonSignal.set(mockSeason);
      selectedDivisionSignal.set(allDivisionsSentinel);
      fixture.detectChanges();

      expect(mockDraftReportService.getDraftReport).toHaveBeenCalledWith(1, null);
    });
  });

  describe('formatDob', () => {
    it('should format ISO date string as mm/dd/yyyy', () => {
      expect(component.formatDob('2010-05-15T00:00:00')).toBe('05/15/2010');
    });

    it('should zero-pad single-digit month and day', () => {
      expect(component.formatDob('2015-03-07T00:00:00')).toBe('03/07/2015');
    });

    it('should return empty string for null', () => {
      expect(component.formatDob(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(component.formatDob(undefined as any)).toBe('');
    });
  });

  describe('print', () => {
    it('should call window.print()', () => {
      spyOn(window, 'print');
      component.print();
      expect(window.print).toHaveBeenCalled();
    });
  });
});
