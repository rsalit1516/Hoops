import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { DivisionService } from './division.service';
import { DataService } from './data.service';
import { SeasonService } from './season.service';
import { LoggerService } from './logger.service';
import { Division } from '../domain/division';
import { Season } from '../domain/season';
import { Constants } from '../shared/constants';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function makeDivision(
  overrides: Partial<Division> & { divisionId: number },
): Division {
  return {
    divisionId: overrides.divisionId,
    divisionDescription: overrides.divisionDescription ?? 'Test Div',
    seasonId: overrides.seasonId ?? 1,
    gender: overrides.gender ?? 'M',
    gender2: overrides.gender2 ?? 'M',
    minDate: overrides.minDate,
    maxDate: overrides.maxDate,
    minDate2: overrides.minDate2,
    maxDate2: overrides.maxDate2,
    directorId: overrides.directorId ?? null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────

describe('DivisionService', () => {
  let service: DivisionService;
  let httpMock: HttpTestingController;
  let mockDataService: jasmine.SpyObj<DataService>;
  let mockLoggerService: jasmine.SpyObj<LoggerService>;
  let mockSeasonService: { selectedSeason: ReturnType<typeof signal<Season | undefined>>; season1: any };

  beforeEach(() => {
    mockDataService = jasmine.createSpyObj('DataService', ['put', 'post', 'delete']);
    mockLoggerService = jasmine.createSpyObj('LoggerService', [
      'info',
      'debug',
      'warn',
      'error',
    ]);

    // SeasonService.selectedSeason is a writable signal; start undefined so
    // the constructor effect does NOT call getSeasonDivisions immediately.
    mockSeasonService = {
      selectedSeason: signal<Season | undefined>(undefined),
      season1: undefined,
    };

    const mockStore = jasmine.createSpyObj('Store', ['dispatch', 'pipe', 'select']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DivisionService,
        { provide: DataService, useValue: mockDataService },
        { provide: SeasonService, useValue: mockSeasonService },
        { provide: Store, useValue: mockStore },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    });

    service = TestBed.inject(DivisionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── updateSelectedDivision ────────────────────────────────────────────────

  describe('updateSelectedDivision', () => {
    it('sets the selectedDivision signal', () => {
      const div = makeDivision({ divisionId: 5, seasonId: 2 });
      service.updateSelectedDivision(div);
      expect(service.selectedDivision()).toEqual(div);
    });

    it('persists the divisionId to localStorage when seasonId is available', () => {
      const div = makeDivision({ divisionId: 7, seasonId: 3 });
      service.updateSelectedDivision(div);
      expect(localStorage.getItem('games:lastDivision:3')).toBe('7');
    });

    it('updates currentDivision state via setCurrent', () => {
      const div = makeDivision({ divisionId: 5 });
      service.updateSelectedDivision(div);
      expect(service.currentDivision()).toEqual(div);
    });
  });

  // ── getSeasonDivisions ────────────────────────────────────────────────────

  describe('getSeasonDivisions', () => {
    const SEASON_ID = 10;
    const expectedUrl = Constants.SEASON_DIVISIONS_URL + SEASON_ID;

    it('GETs divisions and updates seasonDivisions signal', () => {
      const divisions = [
        makeDivision({ divisionId: 1, seasonId: SEASON_ID }),
        makeDivision({ divisionId: 2, seasonId: SEASON_ID }),
      ];

      service.getSeasonDivisions(SEASON_ID);

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(divisions);

      expect(service.seasonDivisions()).toEqual(divisions);
    });

    it('selects the first division as default when none previously selected', () => {
      const divisions = [
        makeDivision({ divisionId: 1, seasonId: SEASON_ID }),
        makeDivision({ divisionId: 2, seasonId: SEASON_ID }),
      ];

      service.getSeasonDivisions(SEASON_ID);
      httpMock.expectOne(expectedUrl).flush(divisions);

      expect(service.selectedDivision()?.divisionId).toBe(1);
    });

    it('preserves an existing selection when it is present in the new data', () => {
      const div1 = makeDivision({ divisionId: 1, seasonId: SEASON_ID });
      const div2 = makeDivision({ divisionId: 2, seasonId: SEASON_ID });

      // Pre-select division 2
      service.selectedDivision.set(div2);

      service.getSeasonDivisions(SEASON_ID);
      httpMock.expectOne(expectedUrl).flush([div1, div2]);

      expect(service.selectedDivision()?.divisionId).toBe(2);
    });

    it('restores selection from localStorage when no existing selection', () => {
      localStorage.setItem(`games:lastDivision:${SEASON_ID}`, '2');
      const div1 = makeDivision({ divisionId: 1, seasonId: SEASON_ID });
      const div2 = makeDivision({ divisionId: 2, seasonId: SEASON_ID });

      service.getSeasonDivisions(SEASON_ID);
      httpMock.expectOne(expectedUrl).flush([div1, div2]);

      expect(service.selectedDivision()?.divisionId).toBe(2);
    });

    it('sets seasonDivisions to empty array on HTTP error', () => {
      service.getSeasonDivisions(SEASON_ID);
      httpMock
        .expectOne(expectedUrl)
        .error(new ProgressEvent('error'));

      expect(service.seasonDivisions()).toEqual([]);
    });
  });

  // ── findEligibleDivision ──────────────────────────────────────────────────

  describe('findEligibleDivision', () => {
    const currentYear = new Date().getFullYear();
    // A 10-year-old born in this calendar year window
    const minDate = new Date(`09/01/${currentYear - 12}`);
    const maxDate = new Date(`08/31/${currentYear - 10}`);

    const boysDivision = makeDivision({
      divisionId: 1,
      gender: 'M',
      minDate,
      maxDate,
    });
    const girlsDivision = makeDivision({
      divisionId: 2,
      gender: 'F',
      minDate,
      maxDate,
    });
    const coedDivision = makeDivision({
      divisionId: 3,
      gender: 'M',
      minDate,
      maxDate,
      gender2: 'F',
      minDate2: minDate,
      maxDate2: maxDate,
    });

    it('returns undefined when birthDate is missing', () => {
      expect(service.findEligibleDivision(undefined, 'M', [boysDivision])).toBeUndefined();
    });

    it('returns undefined when gender is missing', () => {
      const bd = new Date(`01/01/${currentYear - 11}`);
      expect(service.findEligibleDivision(bd, undefined, [boysDivision])).toBeUndefined();
    });

    it('returns undefined when divisions array is empty', () => {
      const bd = new Date(`01/01/${currentYear - 11}`);
      expect(service.findEligibleDivision(bd, 'M', [])).toBeUndefined();
    });

    it('matches the primary gender and date range', () => {
      const bd = new Date(`01/01/${currentYear - 11}`);
      const result = service.findEligibleDivision(bd, 'M', [girlsDivision, boysDivision]);
      expect(result?.divisionId).toBe(1);
    });

    it('returns undefined when gender does not match any division', () => {
      const bd = new Date(`01/01/${currentYear - 11}`);
      const result = service.findEligibleDivision(bd, 'F', [boysDivision]);
      expect(result).toBeUndefined();
    });

    it('returns undefined when birth date is out of range', () => {
      const tooOld = new Date(`01/01/${currentYear - 20}`);
      const result = service.findEligibleDivision(tooOld, 'M', [boysDivision]);
      expect(result).toBeUndefined();
    });

    it('matches the secondary gender in a co-ed division', () => {
      const bd = new Date(`01/01/${currentYear - 11}`);
      const result = service.findEligibleDivision(bd, 'F', [coedDivision]);
      expect(result?.divisionId).toBe(3);
    });
  });

  // ── getDivisionMinDate / getDivisionMaxDate ────────────────────────────────

  describe('getDivisionMinDate', () => {
    it('returns September 1st of (currentYear - years)', () => {
      const years = 10;
      const expected = new Date(`09/01/${new Date().getFullYear() - years}`);
      const result = service.getDivisionMinDate(years);
      expect(result.getFullYear()).toBe(expected.getFullYear());
      expect(result.getMonth()).toBe(8); // September = index 8
      expect(result.getDate()).toBe(1);
    });
  });

  describe('getDivisionMaxDate', () => {
    it('returns August 31st of (currentYear - years)', () => {
      const years = 10;
      const expected = new Date(`08/31/${new Date().getFullYear() - years}`);
      const result = service.getDivisionMaxDate(years);
      expect(result.getFullYear()).toBe(expected.getFullYear());
      expect(result.getMonth()).toBe(7); // August = index 7
      expect(result.getDate()).toBe(31);
    });
  });

  // ── getDefaultDivision ────────────────────────────────────────────────────

  describe('getDefaultDivision', () => {
    it('returns TR2COED division with correct gender for Trainee 2 Coed', () => {
      const div = service.getDefaultDivision(Constants.TR2COED);
      expect(div.divisionDescription).toBe(Constants.TR2COED);
      expect(div.gender).toBe('M');
      expect(div.gender2).toBe('F');
      expect(div.minDate).toBeDefined();
    });

    it('returns SI Boys division with male gender', () => {
      const div = service.getDefaultDivision(Constants.SIBOYS);
      expect(div.divisionDescription).toBe(Constants.SIBOYS);
      expect(div.gender).toBe('M');
    });

    it('returns Int Girls division with female gender', () => {
      const div = service.getDefaultDivision(Constants.INTGIRLS);
      expect(div.divisionDescription).toBe(Constants.INTGIRLS);
      expect(div.gender).toBe('F');
    });

    it('returns Women division with female gender', () => {
      const div = service.getDefaultDivision(Constants.WOMEN);
      expect(div.divisionDescription).toBe(Constants.WOMEN);
      expect(div.gender).toBe('F');
    });

    it('returns Men 18+ division with male gender', () => {
      const div = service.getDefaultDivision(Constants.MEN);
      expect(div.divisionDescription).toBe(Constants.MEN);
      expect(div.gender).toBe('M');
    });

    it('returns an empty division for an unknown name', () => {
      const div = service.getDefaultDivision('Unknown Division');
      expect(div.divisionDescription).toBeUndefined();
    });
  });

  // ── save ──────────────────────────────────────────────────────────────────

  describe('save', () => {
    it('calls DataService.put when divisionId is not 0', () => {
      const div = makeDivision({ divisionId: 5 });
      const obs = of(div);
      mockDataService.put.and.returnValue(obs);

      service.save(div);

      expect(mockDataService.put).toHaveBeenCalledWith(
        `${Constants.DIVISION_URL}/${div.divisionId}`,
        div,
      );
    });

    it('calls DataService.post when divisionId is 0', () => {
      const div = makeDivision({ divisionId: 0 });
      const obs = of(div);
      mockDataService.post.and.returnValue(obs);

      service.save(div);

      expect(mockDataService.post).toHaveBeenCalledWith(
        Constants.DIVISION_URL,
        div,
      );
    });
  });

  // ── delete ────────────────────────────────────────────────────────────────

  describe('delete', () => {
    it('calls DataService.delete with the correct URL', () => {
      mockDataService.delete.and.returnValue(of(null));
      service.delete(7);
      expect(mockDataService.delete).toHaveBeenCalledWith(
        `${Constants.DIVISION_URL}/7`,
      );
    });
  });

  // ── getmatchingDivision ───────────────────────────────────────────────────

  describe('getmatchingDivision', () => {
    it('returns the canonical name when there is a case-insensitive match', () => {
      expect(service.getmatchingDivision('si boys')).toBe(Constants.SIBOYS);
      expect(service.getmatchingDivision('SI BOYS')).toBe(Constants.SIBOYS);
    });

    it('returns "Other" when there is no match', () => {
      expect(service.getmatchingDivision('Nonexistent')).toBe('Other');
    });
  });

  // ── setLoadingIndicator ───────────────────────────────────────────────────

  describe('setLoadingIndicator', () => {
    it('updates the isLoading state signal', () => {
      expect(service.isLoading()).toBeFalse();
      service.setLoadingIndicator(true);
      expect(service.isLoading()).toBeTrue();
      service.setLoadingIndicator(false);
      expect(service.isLoading()).toBeFalse();
    });
  });
});
