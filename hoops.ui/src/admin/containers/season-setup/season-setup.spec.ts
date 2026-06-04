import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Season } from '@app/domain/season';
import { Division } from '@app/domain/division';
import { Team } from '@app/domain/team';
import { SeasonSetup } from './season-setup';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';
import { TeamService } from '@app/services/team.service';
import { AdminSeasonService } from '../../admin-shared/services/season.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoggerService } from '@app/services/logger.service';

function mockSeason(id: number): Season {
  return Object.assign(new Season(), { seasonId: id, currentSeason: false });
}

function mockDivision(id: number): Division {
  return Object.assign(new Division(), { divisionId: id, seasonId: 5, divisionDescription: 'TEST' });
}

describe('SeasonSetup', () => {
  let component: SeasonSetup;
  let fixture: ComponentFixture<SeasonSetup>;
  let selectedSeasonSig: ReturnType<typeof signal<Season | undefined>>;
  let mockSeasonService: any;
  let mockDivisionService: any;
  let mockTeamService: any;
  let mockSnackBar: any;

  beforeEach(async () => {
    selectedSeasonSig = signal<Season | undefined>(undefined);

    mockSeasonService = {
      selectedSeason: selectedSeasonSig,
      updateSelectedSeason: jasmine.createSpy('updateSelectedSeason'),
      fetchSeasons: jasmine.createSpy('fetchSeasons'),
      fetchCurrentSeason: jasmine.createSpy('fetchCurrentSeason'),
      seasons: [],
      season1: undefined,
    };

    mockDivisionService = {
      save: jasmine.createSpy('save').and.callFake(() => of(mockDivision(1))),
      selectedDivision: signal<Division | undefined>(undefined),
      seasonDivisions: signal<Division[] | undefined>(undefined),
    };

    mockTeamService = {
      addTeam: jasmine.createSpy('addTeam').and.callFake(() => of(new Team())),
    };

    mockSnackBar = { open: jasmine.createSpy('snackBar.open') };

    const mockAdminSeasonService = { seasons: [] as Season[], selectedSeason: signal<Season | undefined>(undefined) };
    const mockLoggerService = {
      debug: jasmine.createSpy(), info: jasmine.createSpy(),
      warn: jasmine.createSpy(), error: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      imports: [SeasonSetup, NoopAnimationsModule],
      providers: [
        { provide: SeasonService, useValue: mockSeasonService },
        { provide: DivisionService, useValue: mockDivisionService },
        { provide: TeamService, useValue: mockTeamService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: AdminSeasonService, useValue: mockAdminSeasonService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    })
    .overrideComponent(SeasonSetup, {
      add: { providers: [{ provide: MatSnackBar, useValue: mockSnackBar }] },
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeasonSetup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with 10 division rows', () => {
    expect(component.rows().length).toBe(10);
  });

  it('should default all rows to selected', () => {
    component.rows().forEach(r => expect(r.selected()).toBeTrue());
  });

  it('should default each row team count to 6', () => {
    component.rows().forEach(r => expect(r.teamCount()).toBe(6));
  });

  describe('canSubmit', () => {
    it('returns false when no season selected', () => {
      expect(component.canSubmit()).toBeFalse();
    });

    it('returns true when season selected and rows are valid', () => {
      selectedSeasonSig.set(mockSeason(5));
      fixture.detectChanges();
      expect(component.canSubmit()).toBeTrue();
    });

    it('returns false when all rows deselected', () => {
      selectedSeasonSig.set(mockSeason(5));
      component.rows().forEach(r => r.selected.set(false));
      fixture.detectChanges();
      expect(component.canSubmit()).toBeFalse();
    });

    it('returns false while submitting', () => {
      selectedSeasonSig.set(mockSeason(5));
      component.submitting.set(true);
      fixture.detectChanges();
      expect(component.canSubmit()).toBeFalse();
    });
  });

  describe('setTeamCount', () => {
    it('sets valid team count', () => {
      const row = component.rows()[0];
      component.setTeamCount(row, '8');
      expect(row.teamCount()).toBe(8);
    });

    it('clamps zero to 1', () => {
      const row = component.rows()[0];
      component.setTeamCount(row, '0');
      expect(row.teamCount()).toBe(1);
    });

    it('clamps non-numeric to 1', () => {
      const row = component.rows()[0];
      component.setTeamCount(row, 'abc');
      expect(row.teamCount()).toBe(1);
    });
  });

  describe('submit', () => {
    beforeEach(() => {
      selectedSeasonSig.set(mockSeason(5));
      fixture.detectChanges();
    });

    it('calls DivisionService.save once per selected row', () => {
      component.submit();
      expect(mockDivisionService.save).toHaveBeenCalledTimes(10);
    });

    it('passes the correct seasonId to each division', () => {
      component.submit();
      (mockDivisionService.save.calls.allArgs() as [Division][]).forEach(([d]) => {
        expect(d.seasonId).toBe(5);
      });
    });

    it('calls TeamService.addTeam for each team in each division (10 × 6 = 60)', () => {
      component.submit();
      expect(mockTeamService.addTeam).toHaveBeenCalledTimes(60);
    });

    it('only creates divisions for selected rows', () => {
      component.rows().slice(1).forEach(r => r.selected.set(false));
      component.submit();
      expect(mockDivisionService.save).toHaveBeenCalledTimes(1);
    });

    it('opens snackbar after all rows complete', () => {
      component.submit();
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        jasmine.stringContaining('division'),
        'OK',
        jasmine.any(Object)
      );
    });

    it('does nothing when no season is selected', () => {
      selectedSeasonSig.set(undefined);
      component.submit();
      expect(mockDivisionService.save).not.toHaveBeenCalled();
    });

    it('assigns sequential team numbers starting at 1', () => {
      component.rows().slice(1).forEach(r => r.selected.set(false));
      component.rows()[0].teamCount.set(3);
      component.submit();
      const teamArgs = mockTeamService.addTeam.calls.allArgs() as [Team][];
      const numbers = teamArgs.map(([t]) => t.teamNumber);
      expect(numbers).toEqual(['1', '2', '3']);
    });
  });
});
