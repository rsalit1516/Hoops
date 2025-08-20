import { PlayoffGameService } from './playoff-game.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SeasonService } from './season.service';
import { DivisionService } from './division.service';
import { DataService } from './data.service';

describe('PlayoffGameService - Time Formatting', () => {
  let service: PlayoffGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PlayoffGameService,
        { provide: SeasonService, useValue: { selectedSeason: undefined } },
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
      service
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
});
