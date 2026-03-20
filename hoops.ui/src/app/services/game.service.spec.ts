import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { GameService } from './game.service';
import { DataService } from './data.service';
import { SeasonService } from './season.service';
import { DivisionService } from './division.service';
import { AuthService } from './auth.service';
import { LoggerService } from './logger.service';
import { TeamService } from './team.service';
import { RegularGame } from '../domain/regularGame';
import { Division } from '../domain/division';
import { Season } from '../domain/season';
import { User } from '../domain/user';
import { Constants } from '../shared/constants';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function makeGame(
  id: number,
  divisionId: number,
  gameDate: string,
  homeTeamId = 1,
  visitingTeamId = 2,
): RegularGame {
  return {
    scheduleGamesId: id,
    gameId: id,
    divisionId,
    seasonId: 1,
    gameDate: new Date(gameDate),
    homeTeamId,
    homeTeamNumber: homeTeamId,
    visitingTeamId,
    visitingTeamNumber: visitingTeamId,
    locationName: 'Gym',
    locationNumber: 1,
    scheduleNumber: id,
    gameDescription: null,
    gameType: 0,
  } as RegularGame;
}

// ─────────────────────────────────────────────────────────────────────────────

describe('GameService', () => {
  let service: GameService;
  let httpMock: HttpTestingController;
  let mockDataService: { handleError: jasmine.Spy };
  let mockLoggerService: jasmine.SpyObj<LoggerService>;

  // Writable signal mocks for cross-service signal reads
  let selectedSeasonSignal: ReturnType<typeof signal<Season | undefined>>;
  let selectedDivisionSignal: ReturnType<typeof signal<Division | undefined>>;
  let currentUserSignal: ReturnType<typeof signal<User | undefined>>;

  beforeEach(() => {
    selectedSeasonSignal = signal<Season | undefined>(undefined);
    selectedDivisionSignal = signal<Division | undefined>(undefined);
    currentUserSignal = signal<User | undefined>(undefined);

    mockLoggerService = jasmine.createSpyObj('LoggerService', [
      'info',
      'debug',
      'warn',
      'error',
    ]);
    mockDataService = {
      handleError:
        jasmine
          .createSpy('handleError')
          .and.callFake((_op: string, result: any) => () => of(result)),
    };

    const mockSeasonService = {
      selectedSeason: selectedSeasonSignal,
    };
    const mockDivisionService = {
      selectedDivision: selectedDivisionSignal,
    };
    const mockAuthService = {
      currentUser: currentUserSignal,
    };
    // TeamService.selectedTeam is a getter returning Team | undefined
    const mockTeamService = {
      get selectedTeam(): any {
        return undefined;
      },
    };
    const mockStore = jasmine.createSpyObj('Store', ['dispatch', 'pipe', 'select']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GameService,
        { provide: DataService, useValue: mockDataService },
        { provide: SeasonService, useValue: mockSeasonService },
        { provide: DivisionService, useValue: mockDivisionService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: TeamService, useValue: mockTeamService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    });

    service = TestBed.inject(GameService);
    httpMock = TestBed.inject(HttpTestingController);

    // Flush any initial requests made by httpResource or effects
    httpMock.match(() => true).forEach((req) => req.flush([]));
  });

  afterEach(() => {
    // Flush any remaining httpResource requests before verifying
    httpMock.match(() => true).forEach((req) => req.flush([]));
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── validateScores ────────────────────────────────────────────────────────

  describe('validateScores', () => {
    it('returns true for two valid integer scores', () => {
      expect(service.validateScores(50, 48)).toBeTrue();
    });

    it('returns true for boundary scores of 0 and 0', () => {
      expect(service.validateScores(0, 0)).toBeTrue();
    });

    it('returns true for boundary scores of 150 and 150', () => {
      expect(service.validateScores(150, 150)).toBeTrue();
    });

    it('returns false when home score exceeds 150', () => {
      expect(service.validateScores(151, 50)).toBeFalse();
    });

    it('returns false when visitor score is negative', () => {
      expect(service.validateScores(50, -1)).toBeFalse();
    });

    it('returns false for non-integer scores', () => {
      expect(service.validateScores(10.5, 20)).toBeFalse();
    });

    it('returns false for NaN', () => {
      expect(service.validateScores(NaN, 10)).toBeFalse();
    });

    it('returns false for Infinity', () => {
      expect(service.validateScores(Infinity, 10)).toBeFalse();
    });
  });

  // ── compare ───────────────────────────────────────────────────────────────

  describe('compare', () => {
    it('returns negative when a < b ascending', () => {
      expect(service.compare('2024-01-01', '2024-12-31', true)).toBeLessThan(0);
    });

    it('returns positive when a > b ascending', () => {
      expect(service.compare('2024-12-31', '2024-01-01', true)).toBeGreaterThan(0);
    });

    it('returns positive when a < b descending', () => {
      expect(service.compare('2024-01-01', '2024-12-31', false)).toBeGreaterThan(0);
    });
  });

  // ── extractDate ───────────────────────────────────────────────────────────

  describe('extractDate', () => {
    it('converts an ISO date string to a JS Date', () => {
      const result = service.extractDate('2024-03-15T18:00:00');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
    });
  });

  // ── updateSelectedGame / clearSelectedGame ────────────────────────────────

  describe('updateSelectedGame', () => {
    it('sets the selectedGame', () => {
      const game = makeGame(1, 5, '2024-01-01');
      service.updateSelectedGame(game);
      expect(service.selectedGame).toEqual(game);
    });
  });

  describe('clearSelectedGame', () => {
    it('resets selectedGame to null', () => {
      const game = makeGame(1, 5, '2024-01-01');
      service.updateSelectedGame(game);
      service.clearSelectedGame();
      expect(service.selectedGame).toBeNull();
    });
  });

  // ── updateSeasonGames ─────────────────────────────────────────────────────

  describe('updateSeasonGames', () => {
    it('stores the games in the internal signal', () => {
      const games = [makeGame(1, 5, '2024-01-01'), makeGame(2, 5, '2024-01-08')];
      service.updateSeasonGames(games);
      expect(service.seasonGames).toEqual(games);
    });
  });

  // ── groupRegularGamesByDate ───────────────────────────────────────────────

  describe('groupRegularGamesByDate', () => {
    it('groups games that share the same calendar date', () => {
      const games = [
        makeGame(1, 5, '2024-01-06T10:00:00'),
        makeGame(2, 5, '2024-01-06T12:00:00'),
        makeGame(3, 5, '2024-01-13T10:00:00'),
      ];

      const groups = service.groupRegularGamesByDate(games);
      expect(groups.length).toBe(2);
      const sizes = groups.map((g) => g.length).sort((a, b) => b - a);
      expect(sizes).toEqual([2, 1]);
    });

    it('returns an empty array for empty input', () => {
      expect(service.groupRegularGamesByDate([])).toEqual([]);
    });

    it('creates one group per unique date', () => {
      const games = [
        makeGame(1, 5, '2024-01-01T10:00:00'),
        makeGame(2, 5, '2024-01-08T10:00:00'),
        makeGame(3, 5, '2024-01-15T10:00:00'),
      ];
      const groups = service.groupRegularGamesByDate(games);
      expect(groups.length).toBe(3);
    });
  });

  // ── filterGamesByDivision ─────────────────────────────────────────────────

  describe('filterGamesByDivision', () => {
    beforeEach(() => {
      const division: Division = {
        divisionId: 5,
        divisionDescription: 'Boys 12',
        gender: 'M',
        gender2: 'M',
        companyId: 1,
        seasonId: 1,
        minDate: undefined,
        maxDate: undefined,
        minDate2: undefined,
        maxDate2: undefined,
        directorId: null,
      };
      selectedDivisionSignal.set(division);
    });

    it('returns only games matching the selected division', () => {
      const games = [
        makeGame(1, 5, '2024-01-06T10:00:00'),
        makeGame(2, 99, '2024-01-06T10:00:00'), // different division
        makeGame(3, 5, '2024-01-13T10:00:00'),
      ];
      service.updateSeasonGames(games);

      const result = service.filterGamesByDivision();
      expect(result.length).toBe(2);
      expect(result.every((g) => g.divisionId === 5)).toBeTrue();
    });

    it('returns games sorted by gameDate ascending', () => {
      const games = [
        makeGame(1, 5, '2024-03-10T10:00:00'),
        makeGame(2, 5, '2024-01-06T10:00:00'),
      ];
      service.updateSeasonGames(games);

      const result = service.filterGamesByDivision();
      expect(result[0].scheduleGamesId).toBe(2); // earlier date first
      expect(result[1].scheduleGamesId).toBe(1);
    });

    it('returns empty array when no seasonGames are loaded', () => {
      expect(service.filterGamesByDivision()).toEqual([]);
    });
  });

  // ── filterGamesByTeam ────────────────────────────────────────────────────

  describe('filterGamesByTeam', () => {
    it('emits an empty array when no team is selected', (done) => {
      service.filterGamesByTeam().subscribe((games) => {
        expect(games).toEqual([]);
        done();
      });
    });
  });

  // ── seasonGamesCount ──────────────────────────────────────────────────────

  describe('seasonGamesCount', () => {
    it('returns 0 when no games are loaded', () => {
      expect(service.seasonGamesCount()).toBe(0);
    });

    it('returns the count of loaded season games', () => {
      const games = [
        makeGame(1, 5, '2024-01-01'),
        makeGame(2, 5, '2024-01-08'),
        makeGame(3, 5, '2024-01-15'),
      ];
      service.updateSeasonGames(games);
      expect(service.seasonGamesCount()).toBe(3);
    });
  });

  // ── fetchSeasonGames ──────────────────────────────────────────────────────

  describe('fetchSeasonGames', () => {
    it('does nothing when no season is selected', () => {
      selectedSeasonSignal.set(undefined);
      service.fetchSeasonGames();
      httpMock.expectNone((r) => r.url.includes('GetSeasonGames'));
      // seasonGames should remain unloaded
      expect(service.seasonGames).toBeNull();
    });

    it('GETs season games and updates the signal', () => {
      const season = Object.assign(new Season(), { seasonId: 5, companyId: 1 });
      selectedSeasonSignal.set(season);

      const games = [makeGame(1, 5, '2024-01-01')];
      service.fetchSeasonGames();

      const req = httpMock.expectOne(
        (r) => r.url.includes('GetSeasonGames') && r.url.includes('seasonId=5'),
      );
      expect(req.request.method).toBe('GET');
      req.flush(games);

      expect(service.seasonGames).toEqual(games);
    });
  });

  // ── saveGame ──────────────────────────────────────────────────────────────

  describe('saveGame', () => {
    it('PUTs to the scores endpoint and updates selected game optimistically', () => {
      const game = makeGame(42, 5, '2024-01-06');
      game.homeTeamScore = 0;
      game.visitingTeamScore = 0;

      service.updateSelectedGame(game);
      service.updateSeasonGames([game]);

      // Set up division signal so fetchStandingsByDivision won't error
      const division: Division = {
        divisionId: 5,
        divisionDescription: 'Boys',
        gender: 'M',
        gender2: 'M',
        companyId: 1,
        seasonId: 1,
        minDate: undefined,
        maxDate: undefined,
        minDate2: undefined,
        maxDate2: undefined,
        directorId: null,
      };
      selectedDivisionSignal.set(division);
      const season = Object.assign(new Season(), { seasonId: 1, companyId: 1 });
      selectedSeasonSignal.set(season);

      let saved: RegularGame | undefined;
      service.saveGame({ game, homeTeamScore: 55, visitingTeamScore: 42 }).subscribe(
        (updated) => (saved = updated),
      );

      // saveGame PUT
      const putReq = httpMock.expectOne((r) =>
        r.url.includes(`/${game.scheduleGamesId}/scores`),
      );
      expect(putReq.request.method).toBe('PUT');
      putReq.flush(null);

      // fetchStandingsByDivision GET
      httpMock
        .match((r) => r.url.includes('GetStandings'))
        .forEach((r) => r.flush([]));

      expect(saved?.homeTeamScore).toBe(55);
      expect(saved?.visitingTeamScore).toBe(42);
      // Optimistic update should have set selectedGame
      expect(service.selectedGame?.homeTeamScore).toBe(55);
    });
  });
});
