import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DailyScheduleReport, ScheduleRow } from './daily-schedule';
import { GameService } from '@app/services/game.service';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';
import { RegularGame } from '@app/domain/regularGame';

const makeGame = (overrides: Partial<RegularGame>): RegularGame =>
  Object.assign(new RegularGame(0, 0, 0, 0), overrides);

describe('DailyScheduleReport', () => {
  let component: DailyScheduleReport;
  let fixture: ComponentFixture<DailyScheduleReport>;
  let httpMock: HttpTestingController;

  const game1 = makeGame({
    scheduleGamesId: 1,
    seasonId: 1,
    divisionId: 10,
    divisionDescription: 'Varsity Boys',
    gameDate: new Date('2026-05-05T09:00:00'),
    gameTimeString: '9:00 AM',
    locationName: 'Court A',
    homeTeamName: 'Lions',
    visitingTeamName: 'Tigers',
    gameType: 0,
  });

  const game2 = makeGame({
    scheduleGamesId: 2,
    seasonId: 1,
    divisionId: 20,
    divisionDescription: 'JV Girls',
    gameDate: new Date('2026-05-06T10:00:00'),
    gameTimeString: '10:00 AM',
    locationName: 'Court B',
    homeTeamName: 'Eagles',
    visitingTeamName: 'Hawks',
    gameType: 1,
  });

  // Backing signal so filteredGames computed re-runs when seasonGames changes
  const seasonGamesSignal = signal<RegularGame[] | null>(null);

  const mockGameService = {
    get seasonGames() {
      return seasonGamesSignal();
    },
    isLoading: signal(false),
    ignoreTeamFilter: signal(true),
  };

  const mockSeasonService = {
    seasons: [],
    selectedSeason: signal<any>(undefined),
    currentSeason: null,
    fetchSeasons: jasmine.createSpy('fetchSeasons'),
    fetchCurrentSeason: jasmine.createSpy('fetchCurrentSeason'),
    updateSelectedSeason: jasmine.createSpy('updateSelectedSeason'),
  };

  const mockDivisionService = {
    seasonDivisions: signal<any[]>([
      { divisionId: 10, divisionDescription: 'Varsity Boys' },
      { divisionId: 20, divisionDescription: 'JV Girls' },
    ]),
    selectedSeason: signal<any>(undefined),
    selectedDivision: signal<any>(undefined),
    updateSelectedDivision: jasmine.createSpy('updateSelectedDivision'),
  };

  beforeEach(async () => {
    seasonGamesSignal.set(null);

    await TestBed.configureTestingModule({
      imports: [DailyScheduleReport, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: GameService, useValue: mockGameService },
        { provide: SeasonService, useValue: mockSeasonService },
        { provide: DivisionService, useValue: mockDivisionService },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    // Flush AuthService init request if triggered
    httpMock.match((r) => r.url.includes('/api/auth/me')).forEach((r) => r.flush(null));

    fixture = TestBed.createComponent(DailyScheduleReport);
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

  it('should return empty rows when seasonGames is null', () => {
    expect(component.filteredGames().length).toBe(0);
  });

  it('should show all games when All Divisions is selected and no date filter', () => {
    seasonGamesSignal.set([game1, game2]);
    component.selectedDivisionId.set(0);
    component.startDate.set(null);
    component.endDate.set(null);
    fixture.detectChanges();

    expect(component.filteredGames().length).toBe(2);
  });

  it('should filter to one division', () => {
    seasonGamesSignal.set([game1, game2]);
    component.selectedDivisionId.set(10);
    component.startDate.set(null);
    component.endDate.set(null);
    fixture.detectChanges();

    const rows = component.filteredGames();
    expect(rows.length).toBe(1);
    expect(rows[0].division).toBe('Varsity Boys');
    expect(rows[0].homeTeam).toBe('Lions');
  });

  it('should filter by start date (inclusive)', () => {
    seasonGamesSignal.set([game1, game2]);
    component.selectedDivisionId.set(0);
    component.startDate.set(new Date('2026-05-06T00:00:00'));
    component.endDate.set(null);
    fixture.detectChanges();

    const rows = component.filteredGames();
    expect(rows.length).toBe(1);
    expect(rows[0].homeTeam).toBe('Eagles');
  });

  it('should filter by end date (inclusive through end of day)', () => {
    seasonGamesSignal.set([game1, game2]);
    component.selectedDivisionId.set(0);
    component.startDate.set(null);
    component.endDate.set(new Date('2026-05-05T00:00:00'));
    fixture.detectChanges();

    const rows = component.filteredGames();
    expect(rows.length).toBe(1);
    expect(rows[0].homeTeam).toBe('Lions');
  });

  describe('time formatting', () => {
    const timeTestCases: [string, string][] = [
      ['1899-12-30 20:30:00', '08:30 PM'],   // SQL Server legacy datetime format
      ['1899-12-30 09:00:00', '09:00 AM'],
      ['1899-12-30 18:00:00', '06:00 PM'],
      ['9:00 AM', '09:00 AM'],
      ['09:00 AM', '09:00 AM'],
      ['2:30 PM', '02:30 PM'],
      ['14:30', '02:30 PM'],
      ['09:00:00', '09:00 AM'],
      ['12:00', '12:00 PM'],
      ['00:00', '12:00 AM'],
      ['0:00', '12:00 AM'],
    ];

    timeTestCases.forEach(([input, expected]) => {
      it(`should format "${input}" as "${expected}"`, () => {
        const game = makeGame({
          ...game1,
          gameTimeString: input,
          gameDate: new Date('2026-05-05T09:00:00'),
        });
        seasonGamesSignal.set([game]);
        component.selectedDivisionId.set(0);
        component.startDate.set(null);
        component.endDate.set(null);
        fixture.detectChanges();
        expect(component.filteredGames()[0].gameTime).toBe(expected);
      });
    });
  });

  it('should label regular games as "Regular"', () => {
    seasonGamesSignal.set([game1]);
    component.selectedDivisionId.set(0);
    component.startDate.set(null);
    component.endDate.set(null);
    fixture.detectChanges();

    expect(component.filteredGames()[0].gameType).toBe('Regular');
  });

  it('should label playoff games as "Playoff"', () => {
    seasonGamesSignal.set([game2]);
    component.selectedDivisionId.set(0);
    component.startDate.set(null);
    component.endDate.set(null);
    fixture.detectChanges();

    expect(component.filteredGames()[0].gameType).toBe('Playoff');
  });

  it('should sort results by date then division', () => {
    const gameEarly = makeGame({
      ...game2,
      scheduleGamesId: 3,
      gameDate: new Date('2026-05-04T08:00:00'),
      divisionDescription: 'A Division',
    });
    seasonGamesSignal.set([game2, game1, gameEarly]);
    component.selectedDivisionId.set(0);
    component.startDate.set(null);
    component.endDate.set(null);
    fixture.detectChanges();

    const rows = component.filteredGames();
    expect(rows[0].gameDate).toBe(
      new Date('2026-05-04').toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      }),
    );
  });

  it('divisionsForSelect should prepend All Divisions option', () => {
    const opts = component.divisionsForSelect();
    expect(opts[0].divisionId).toBe(0);
    expect(opts[0].divisionDescription).toBe('All Divisions');
    expect(opts.length).toBe(3);
  });

  describe('downloadCSV', () => {
    it('should open snackbar when no games', () => {
      seasonGamesSignal.set([]);
      component.startDate.set(null);
      component.endDate.set(null);
      const snackBar = component['snackBar'];
      spyOn(snackBar, 'open');
      component.downloadCSV();
      expect(snackBar.open).toHaveBeenCalledWith('No data to download', 'Close', {
        duration: 3000,
      });
    });

    it('should trigger file download when games exist', () => {
      seasonGamesSignal.set([game1]);
      component.selectedDivisionId.set(0);
      component.startDate.set(null);
      component.endDate.set(null);
      fixture.detectChanges();

      const link = { setAttribute: jasmine.createSpy(), click: jasmine.createSpy(), style: {} } as any;
      spyOn(document, 'createElement').and.returnValue(link);
      spyOn(document.body, 'appendChild');
      spyOn(document.body, 'removeChild');
      spyOn(URL, 'createObjectURL').and.returnValue('blob:test');

      const snackBar = component['snackBar'];
      spyOn(snackBar, 'open');

      component.downloadCSV();

      expect(link.click).toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith('File downloaded successfully', 'Close', {
        duration: 3000,
      });
    });
  });
});
