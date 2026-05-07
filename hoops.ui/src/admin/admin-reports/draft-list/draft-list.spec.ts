/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DraftList } from './draft-list';
import { DraftListService } from '@app/services/draft-list.service';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';
import { LoggerService } from '@app/services/logger.service';
import { DraftListPlayer } from '@app/domain/draft-list-player';
import { Division } from '@app/domain/division';
import { Season } from '@app/domain/season';

const makePlayer = (overrides: Partial<DraftListPlayer>): DraftListPlayer =>
  Object.assign(new DraftListPlayer(), overrides);

describe('DraftList', () => {
  let component: DraftList;
  let fixture: ComponentFixture<DraftList>;
  let httpMock: HttpTestingController;

  const selectedSeasonSignal = signal<Season | undefined>(undefined);
  const selectedDivisionSignal = signal<Division | undefined>(undefined);
  const playersSignal = signal<DraftListPlayer[]>([]);
  const isLoadingSignal = signal<boolean>(false);

  const mockDraftListService = {
    get players() {
      return playersSignal.asReadonly();
    },
    get isLoading() {
      return isLoadingSignal.asReadonly();
    },
    getDraftList: jasmine.createSpy('getDraftList'),
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

  const makePlayers = (): DraftListPlayer[] => [
    makePlayer({
      personId: 1,
      division: 'U14 Girls',
      draftId: '002',
      lastName: 'Smith',
      firstName: 'Jane',
      dob: '2012-08-20T00:00:00' as any,
      grade: 4,
      address1: '456 Oak Ave',
      city: 'Riverside',
      zip: '67890',
    }),
    makePlayer({
      personId: 2,
      division: 'U12 Boys',
      draftId: '001',
      lastName: 'Johnson',
      firstName: 'John',
      dob: '2010-05-15T00:00:00' as any,
      grade: 6,
      address1: '123 Main St',
      city: 'Springfield',
      zip: '12345',
    }),
  ];

  beforeEach(async () => {
    selectedSeasonSignal.set(undefined);
    selectedDivisionSignal.set(undefined);
    playersSignal.set([]);
    isLoadingSignal.set(false);
    mockDraftListService.getDraftList.calls.reset();

    await TestBed.configureTestingModule({
      imports: [DraftList, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DraftListService, useValue: mockDraftListService },
        { provide: SeasonService, useValue: mockSeasonService },
        { provide: DivisionService, useValue: mockDivisionService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    httpMock
      .match((r) => r.url.includes('/api/auth/me'))
      .forEach((r) => r.flush(null));

    fixture = TestBed.createComponent(DraftList);
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
    it('should be true when no division is selected and not loading', () => {
      expect(component.showNoSelection).toBeTrue();
    });

    it('should be false when a specific division is selected', () => {
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

  describe('showTable', () => {
    it('should be false when no division is selected', () => {
      expect(component.showTable).toBeFalse();
    });

    it('should be true when a division is selected and not loading', () => {
      selectedDivisionSignal.set(mockDivision);
      fixture.detectChanges();
      expect(component.showTable).toBeTrue();
    });

    it('should be false when loading even with a division selected', () => {
      selectedDivisionSignal.set(mockDivision);
      isLoadingSignal.set(true);
      fixture.detectChanges();
      expect(component.showTable).toBeFalse();
    });
  });

  describe('sortedPlayers', () => {
    it('should return players unchanged for a specific division', () => {
      const players = makePlayers();
      playersSignal.set(players);
      selectedDivisionSignal.set(mockDivision);
      fixture.detectChanges();

      expect(component.sortedPlayers()).toEqual(players);
    });

    it('should sort players by division name when All Divisions is selected', () => {
      playersSignal.set(makePlayers()); // U14 Girls first, U12 Boys second
      selectedDivisionSignal.set(allDivisionsSentinel);
      fixture.detectChanges();

      const sorted = component.sortedPlayers();
      expect(sorted[0].division).toBe('U12 Boys');
      expect(sorted[1].division).toBe('U14 Girls');
    });

    it('should not mutate the original players array when sorting', () => {
      const players = makePlayers();
      playersSignal.set(players);
      selectedDivisionSignal.set(allDivisionsSentinel);
      fixture.detectChanges();

      component.sortedPlayers();
      expect(players[0].division).toBe('U14 Girls');
    });

    it('should return empty array when no players', () => {
      selectedDivisionSignal.set(allDivisionsSentinel);
      fixture.detectChanges();

      expect(component.sortedPlayers()).toEqual([]);
    });
  });

  describe('effect: getDraftList', () => {
    it('should call getDraftList when both season and division are set', () => {
      selectedSeasonSignal.set(mockSeason);
      selectedDivisionSignal.set(mockDivision);
      fixture.detectChanges();

      expect(mockDraftListService.getDraftList).toHaveBeenCalledWith(1, 10);
    });

    it('should not call getDraftList when only season is set', () => {
      selectedSeasonSignal.set(mockSeason);
      fixture.detectChanges();

      expect(mockDraftListService.getDraftList).not.toHaveBeenCalled();
    });

    it('should not call getDraftList when only division is set', () => {
      selectedDivisionSignal.set(mockDivision);
      fixture.detectChanges();

      expect(mockDraftListService.getDraftList).not.toHaveBeenCalled();
    });

    it('should pass null divisionId when All Divisions sentinel is selected', () => {
      selectedSeasonSignal.set(mockSeason);
      selectedDivisionSignal.set(allDivisionsSentinel);
      fixture.detectChanges();

      expect(mockDraftListService.getDraftList).toHaveBeenCalledWith(1, null);
    });
  });

  describe('downloadCSV', () => {
    it('should show snackbar when there are no players', () => {
      selectedDivisionSignal.set(mockDivision);
      fixture.detectChanges();

      const snackBar = component['snackBar'];
      spyOn(snackBar, 'open');
      component.downloadCSV();

      expect(snackBar.open).toHaveBeenCalledWith('No data to download', 'Close', {
        duration: 3000,
      });
    });

    it('should trigger file download when players exist', () => {
      selectedDivisionSignal.set(mockDivision);
      playersSignal.set(makePlayers());
      fixture.detectChanges();

      const link = document.createElement('a');
      spyOn(link, 'click');
      const origCreate = document.createElement.bind(document);
      spyOn(document, 'createElement').and.callFake((tag: string) =>
        tag === 'a' ? link : origCreate(tag),
      );
      spyOn(URL, 'createObjectURL').and.returnValue('blob:test');

      const snackBar = component['snackBar'];
      spyOn(snackBar, 'open');

      component.downloadCSV();

      expect(link.click).toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'File downloaded successfully',
        'Close',
        { duration: 3000 },
      );
    });

    it('should include division description in filename for a specific division', () => {
      selectedSeasonSignal.set(mockSeason);
      selectedDivisionSignal.set(mockDivision);
      playersSignal.set(makePlayers());
      fixture.detectChanges();

      const link = document.createElement('a');
      spyOn(link, 'click');
      const origCreate = document.createElement.bind(document);
      spyOn(document, 'createElement').and.callFake((tag: string) =>
        tag === 'a' ? link : origCreate(tag),
      );
      spyOn(URL, 'createObjectURL').and.returnValue('blob:test');

      component.downloadCSV();

      expect(link.download).toBe('DraftList-Spring 2026-U12 Boys.csv');
    });

    it('should use "All" in filename when All Divisions is selected', () => {
      selectedSeasonSignal.set(mockSeason);
      selectedDivisionSignal.set(allDivisionsSentinel);
      playersSignal.set(makePlayers());
      fixture.detectChanges();

      const link = document.createElement('a');
      spyOn(link, 'click');
      const origCreate = document.createElement.bind(document);
      spyOn(document, 'createElement').and.callFake((tag: string) =>
        tag === 'a' ? link : origCreate(tag),
      );
      spyOn(URL, 'createObjectURL').and.returnValue('blob:test');

      component.downloadCSV();

      expect(link.download).toBe('DraftList-Spring 2026-All.csv');
    });
  });

  describe('DOB column formatter', () => {
    let dobFormatter: ((val: any) => string) | undefined;

    beforeEach(() => {
      dobFormatter = component.columns.find((c) => c.key === 'dob')?.formatter;
    });

    it('should format ISO date string as mm-dd-yyyy', () => {
      expect(dobFormatter?.('2010-05-15T00:00:00')).toBe('05-15-2010');
    });

    it('should zero-pad single-digit month and day', () => {
      expect(dobFormatter?.('2015-03-07T00:00:00')).toBe('03-07-2015');
    });

    it('should return empty string for null', () => {
      expect(dobFormatter?.(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(dobFormatter?.(undefined)).toBe('');
    });
  });
});
