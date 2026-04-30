import { PlayoffGameService } from './playoff-game.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { SeasonService } from './season.service';
import { DivisionService } from './division.service';
import { DataService } from './data.service';
import { Season } from '../domain/season';

describe('PlayoffGameService - Time Formatting', () => {
  let service: PlayoffGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PlayoffGameService,
        {
          provide: SeasonService,
          useValue: { selectedSeason: signal<Season | undefined>(undefined) },
        },
        {
          provide: DivisionService,
          useValue: { selectedDivision: (): any => undefined },
        },
        { provide: DataService, useValue: { httpOptions: {} } },
      ],
    });
    service = TestBed.inject(PlayoffGameService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should format time with AM/PM format', () => {
    // Access private method through bracket notation for testing
    const formatTime = (service as any).formatTime.bind(service);

    // Test morning time
    const morningTime = new Date('2025-08-20T06:00:00');
    const formattedMorning = formatTime(morningTime);
    expect(formattedMorning).toMatch(/06:00:00 AM/);

    // Test evening time
    const eveningTime = new Date('2025-08-20T18:00:00');
    const formattedEvening = formatTime(eveningTime);
    expect(formattedEvening).toMatch(/06:00:00 PM/);
  });

  it('should convert AM/PM time to 24-hour format', () => {
    // Access private method through bracket notation for testing
    const convertAmPmTo24Hour = (service as any).convertAmPmTo24Hour.bind(
      service,
    );

    expect(convertAmPmTo24Hour('06:00:00 AM')).toBe('06:00:00');
    expect(convertAmPmTo24Hour('12:00:00 AM')).toBe('00:00:00');
    expect(convertAmPmTo24Hour('06:00:00 PM')).toBe('18:00:00');
    expect(convertAmPmTo24Hour('12:00:00 PM')).toBe('12:00:00');
  });

  it('should normalize API playoff game with AM/PM time', () => {
    // Access private method through bracket notation for testing
    const normalizeApiPlayoffGame = (
      service as any
    ).normalizeApiPlayoffGame.bind(service);

    const rawApiData = {
      SchedulePlayoffId: 1,
      ScheduleNumber: 1,
      GameNumber: 1,
      GameDate: '2025-08-20T00:00:00',
      GameTime: '06:00:00 PM',
      HomeTeam: 'Team A',
      VisitingTeam: 'Team B',
      DivisionId: 1,
    };

    const normalized = normalizeApiPlayoffGame(rawApiData);

    expect(normalized.gameTime).toBeInstanceOf(Date);
    expect(normalized.gameTime?.getHours()).toBe(18); // 6 PM in 24-hour format
    expect(normalized.gameTime?.getMinutes()).toBe(0);
  });

  it('formatLocalDateTime should return YYYY-MM-DDTHH:mm:ss with no timezone offset', () => {
    const formatLocalDateTime = (service as any).formatLocalDateTime.bind(
      service,
    );

    // Use a date constructed from local time parts to avoid any timezone ambiguity in the test
    const date = new Date(2025, 7, 20, 20, 30, 0); // Aug 20, 2025 8:30:00 PM local

    const result: string = formatLocalDateTime(date);

    expect(result).toBe('2025-08-20T20:30:00');
    // Must not contain a Z or +/- timezone offset
    expect(result).not.toMatch(/Z|[+-]\d{2}:\d{2}/);
  });

  it('toApiModel should send a local datetime string (not UTC) for gameDate', () => {
    const toApiModel = (service as any).toApiModel.bind(service);

    // Aug 20 2025, 8:30 PM local — would shift to 00:30 next day if serialized as UTC in UTC+4 or later
    const localDate = new Date(2025, 7, 20, 20, 30, 0);

    const game = {
      schedulePlayoffId: 1,
      scheduleNumber: 1,
      gameNumber: 1,
      locationNumber: 1,
      gameDate: localDate,
      gameTime: new Date(2025, 7, 20, 20, 30, 0),
      visitingTeam: 'Team B',
      homeTeam: 'Team A',
      descr: '',
      visitingTeamScore: null as number | null,
      homeTeamScore: null as number | null,
      divisionId: 1,
    };

    const payload = toApiModel(game);

    // Should be a plain string, not a Date object (which would serialize to UTC)
    expect(typeof payload.gameDate).toBe('string');
    // Should start with the local date, not potentially shifted to next day
    expect(payload.gameDate).toMatch(/^2025-08-20T20:30:00$/);
  });
});
