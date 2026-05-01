import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';

import { SponsorList } from './sponsor-list';
import { SeasonService } from '@app/services/season.service';
import { LoggerService } from '@app/services/logger.service';
import { Season } from '@app/domain/season';
import { Constants } from '@app/shared/constants';

describe('SponsorList', () => {
  let component: SponsorList;
  let fixture: ComponentFixture<SponsorList>;
  let httpMock: HttpTestingController;
  let mockSeasonService: {
    currentSeason: ReturnType<typeof signal<Season | undefined>>;
    fetchCurrentSeason: jasmine.Spy;
  };

  const makeCurrentSeason = (seasonId: number): Season =>
    Object.assign(new Season(), { seasonId });

  // Two sponsors in current season (lastSeasonId=5), one in a past season, one with no history
  const mockSponsors = [
    {
      sponsorProfileId: 1,
      spoName: 'Sunrise Dental Group',
      contactName: 'Dr. Ellis',
      email: 'a@a.com',
      phone: '555-0101',
      lastSeasonId: 5,
      lastSeasonDescription: 'Winter 2026',
    },
    {
      sponsorProfileId: 2,
      spoName: 'Pizza Palace',
      contactName: 'Tony',
      email: 'b@b.com',
      phone: '555-0102',
      lastSeasonId: 3,
      lastSeasonDescription: 'Spring 2025',
    },
    {
      sponsorProfileId: 3,
      spoName: 'Gold Gym',
      contactName: 'Lisa',
      email: 'c@c.com',
      phone: '555-0103',
      lastSeasonId: null,
      lastSeasonDescription: null,
    },
  ];

  beforeEach(async () => {
    mockSeasonService = {
      currentSeason: signal<Season | undefined>(undefined),
      fetchCurrentSeason: jasmine.createSpy('fetchCurrentSeason'),
    };

    await TestBed.configureTestingModule({
      imports: [SponsorList, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: SeasonService, useValue: mockSeasonService },
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

    fixture = TestBed.createComponent(SponsorList);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.match(() => true).forEach((r) => r.flush([]));
    httpMock.verify();
  });

  function flushSponsors(sponsors = mockSponsors): void {
    httpMock
      .expectOne((r) => r.url === Constants.GET_SPONSOR_PROFILES_URL)
      .flush(sponsors);
    fixture.detectChanges();
  }

  // ── Creation ──────────────────────────────────────────────────────────────

  it('should create', () => {
    flushSponsors();
    expect(component).toBeTruthy();
  });

  it('should call fetchCurrentSeason on init', () => {
    flushSponsors();
    expect(mockSeasonService.fetchCurrentSeason).toHaveBeenCalled();
  });

  // ── Data mapping ──────────────────────────────────────────────────────────

  it('should map sponsorProfileId to id for BaseList compatibility', () => {
    flushSponsors();
    const items = component.sponsors();
    expect(items[0].id).toBe(1);
    expect(items[1].id).toBe(2);
    expect(items[2].id).toBe(3);
  });

  it('should expose empty list before HTTP response arrives', () => {
    // sponsors starts empty; do not flush yet
    expect(component.sponsors().length).toBe(0);
    flushSponsors(); // clean up
  });

  it('should handle an empty HTTP response', () => {
    flushSponsors([]);
    expect(component.sponsors().length).toBe(0);
    expect(component.filteredSponsors().length).toBe(0);
  });

  it('should set isLoading to false after successful response', () => {
    flushSponsors();
    expect(component.isLoading()).toBeFalse();
  });

  it('should set isLoading to false and keep sponsors empty on HTTP error', () => {
    const logger = TestBed.inject(LoggerService) as any;
    httpMock
      .expectOne((r) => r.url === Constants.GET_SPONSOR_PROFILES_URL)
      .error(new ProgressEvent('error'));
    fixture.detectChanges();
    expect(component.isLoading()).toBeFalse();
    expect(component.sponsors().length).toBe(0);
    expect(logger.error).toHaveBeenCalled();
  });

  // ── Column definition ─────────────────────────────────────────────────────

  it('should define a spoName column', () => {
    flushSponsors();
    expect(component.columns.map((c) => c.key)).toContain('spoName');
  });

  it('should define a lastSeasonDescription column', () => {
    flushSponsors();
    expect(component.columns.map((c) => c.key)).toContain('lastSeasonDescription');
  });

  // ── No filter ─────────────────────────────────────────────────────────────

  it('should show all sponsors when no filter is active', () => {
    flushSponsors();
    expect(component.filteredSponsors().length).toBe(3);
  });

  // ── Name filter ───────────────────────────────────────────────────────────

  it('should filter sponsors by name substring', () => {
    flushSponsors();
    component.onFilterChange({ name: 'Dental', currentSeasonOnly: false });
    const result = component.filteredSponsors();
    expect(result.length).toBe(1);
    expect(result[0].spoName).toBe('Sunrise Dental Group');
  });

  it('should filter sponsors by name case-insensitively', () => {
    flushSponsors();
    component.onFilterChange({ name: 'PIZZA', currentSeasonOnly: false });
    expect(component.filteredSponsors().length).toBe(1);
    expect(component.filteredSponsors()[0].spoName).toBe('Pizza Palace');
  });

  it('should return no results when name filter matches nothing', () => {
    flushSponsors();
    component.onFilterChange({ name: 'zzz', currentSeasonOnly: false });
    expect(component.filteredSponsors().length).toBe(0);
  });

  it('should show all sponsors when name filter is cleared', () => {
    flushSponsors();
    component.onFilterChange({ name: 'Dental', currentSeasonOnly: false });
    component.onFilterChange({ name: '', currentSeasonOnly: false });
    expect(component.filteredSponsors().length).toBe(3);
  });

  // ── Current-season-only filter — season not yet loaded ───────────────────

  it('should show no sponsors when currentSeasonOnly is true and season is not loaded', () => {
    flushSponsors();
    // currentSeason signal still undefined
    component.onFilterChange({ name: '', currentSeasonOnly: true });
    expect(component.filteredSponsors().length).toBe(0);
  });

  // ── Current-season-only filter — season loaded ────────────────────────────

  it('should show all sponsors when currentSeasonOnly is false regardless of season', () => {
    flushSponsors();
    mockSeasonService.currentSeason.set(makeCurrentSeason(5));
    component.onFilterChange({ name: '', currentSeasonOnly: false });
    expect(component.filteredSponsors().length).toBe(3);
  });

  it('should filter to only current-season sponsors when currentSeasonOnly is true', () => {
    flushSponsors();
    mockSeasonService.currentSeason.set(makeCurrentSeason(5));
    component.onFilterChange({ name: '', currentSeasonOnly: true });
    const result = component.filteredSponsors();
    expect(result.length).toBe(1);
    expect(result[0].sponsorProfileId).toBe(1);
  });

  it('should exclude sponsors with no season history when currentSeasonOnly is true', () => {
    flushSponsors();
    mockSeasonService.currentSeason.set(makeCurrentSeason(5));
    component.onFilterChange({ name: '', currentSeasonOnly: true });
    const ids = component.filteredSponsors().map((s) => s.sponsorProfileId);
    expect(ids).not.toContain(3); // lastSeasonId is null
  });

  it('should exclude past-season-only sponsors when currentSeasonOnly is true', () => {
    flushSponsors();
    mockSeasonService.currentSeason.set(makeCurrentSeason(5));
    component.onFilterChange({ name: '', currentSeasonOnly: true });
    const ids = component.filteredSponsors().map((s) => s.sponsorProfileId);
    expect(ids).not.toContain(2); // lastSeasonId is 3, not 5
  });

  it('should reactively update when currentSeason signal changes', () => {
    flushSponsors();
    component.onFilterChange({ name: '', currentSeasonOnly: true });

    // Before season loads: no results
    expect(component.filteredSponsors().length).toBe(0);

    // Season arrives
    mockSeasonService.currentSeason.set(makeCurrentSeason(5));
    fixture.detectChanges();

    // Now Sunrise Dental (lastSeasonId=5) appears
    expect(component.filteredSponsors().length).toBe(1);
  });

  // ── Combined filters ──────────────────────────────────────────────────────

  it('should apply name and currentSeasonOnly filters together', () => {
    flushSponsors();
    mockSeasonService.currentSeason.set(makeCurrentSeason(5));
    // "Sunrise" matches sponsor 1 (current season) only
    component.onFilterChange({ name: 'Sunrise', currentSeasonOnly: true });
    const result = component.filteredSponsors();
    expect(result.length).toBe(1);
    expect(result[0].spoName).toBe('Sunrise Dental Group');
  });

  it('should return nothing when name matches a past-season sponsor with currentSeasonOnly active', () => {
    flushSponsors();
    mockSeasonService.currentSeason.set(makeCurrentSeason(5));
    // "Pizza" matches sponsor 2, but sponsor 2 is not in the current season
    component.onFilterChange({ name: 'Pizza', currentSeasonOnly: true });
    expect(component.filteredSponsors().length).toBe(0);
  });
});
