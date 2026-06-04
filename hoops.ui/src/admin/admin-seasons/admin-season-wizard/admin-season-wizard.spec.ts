import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminSeasonWizard } from './admin-season-wizard';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';
import { TeamService } from '@app/services/team.service';
import { AuthService } from '@app/services/auth.service';
import { AdminSeasonService } from '../../admin-shared/services/season.service';
import { LoggerService } from '@app/services/logger.service';
import { Season } from '@app/domain/season';
import { User } from '@app/domain/user';
import { Division } from '@app/domain/division';
import { Team } from '@app/domain/team';

function mockSeason(id: number): Season {
  return Object.assign(new Season(), {
    seasonId: id,
    description: `Season-${id}`,
    currentSeason: false,
  });
}

function mockDivision(id: number): Division {
  return Object.assign(new Division(), { divisionId: id, seasonId: 99 });
}

describe('AdminSeasonWizard', () => {
  let component: AdminSeasonWizard;
  let fixture: ComponentFixture<AdminSeasonWizard>;
  let mockSeasonService: any;
  let mockDivisionService: any;
  let mockTeamService: any;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let routerNavigateSpy: jasmine.Spy;

  beforeEach(async () => {
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    mockSeasonService = {
      selectedSeason: signal<Season | undefined>(undefined),
      season1: undefined,
      postSeason: jasmine.createSpy('postSeason').and.callFake(() => of(mockSeason(99))),
      updateSelectedSeason: jasmine.createSpy('updateSelectedSeason'),
      fetchSeasons: jasmine.createSpy('fetchSeasons'),
      fetchCurrentSeason: jasmine.createSpy('fetchCurrentSeason'),
      seasons: [],
    };

    mockDivisionService = {
      save: jasmine.createSpy('save').and.callFake(() => of(mockDivision(1))),
      selectedDivision: signal<Division | undefined>(undefined),
      seasonDivisions: signal<Division[] | undefined>(undefined),
    };

    mockTeamService = {
      addTeam: jasmine.createSpy('addTeam').and.callFake(() => of(new Team())),
    };

    const mockAuthService = {
      currentUser: signal<User | undefined>(new User(1, 'admin', true)),
    };

    const mockAdminSeasonService = {
      seasons: [] as Season[],
      selectedSeason: signal<Season | undefined>(undefined),
    };

    const mockLoggerService = {
      debug: jasmine.createSpy(), info: jasmine.createSpy(),
      warn: jasmine.createSpy(), error: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      imports: [AdminSeasonWizard, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: SeasonService, useValue: mockSeasonService },
        { provide: DivisionService, useValue: mockDivisionService },
        { provide: TeamService, useValue: mockTeamService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: AdminSeasonService, useValue: mockAdminSeasonService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    })
    .overrideComponent(AdminSeasonWizard, {
      add: { providers: [{ provide: MatSnackBar, useValue: mockSnackBar }] },
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSeasonWizard);
    component = fixture.componentInstance;
    fixture.detectChanges();

    routerNavigateSpy = spyOn(TestBed.inject(Router), 'navigate').and.returnValue(
      Promise.resolve(true)
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initializes with seasonCreated false and saving false', () => {
    expect(component.seasonCreated()).toBeFalse();
    expect(component.saving()).toBeFalse();
  });

  it('initializes with 10 division rows all selected with teamCount 6', () => {
    expect(component.rows().length).toBe(10);
    component.rows().forEach((r) => {
      expect(r.selected()).toBeTrue();
      expect(r.teamCount()).toBe(6);
    });
  });

  describe('save()', () => {
    beforeEach(() => {
      component.form.patchValue({ name: 'Fall 2026' });
    });

    it('does nothing when form is invalid', () => {
      component.form.patchValue({ name: '' });
      component.save();
      expect(mockSeasonService.postSeason).not.toHaveBeenCalled();
    });

    it('calls postSeason with seasonId 0', () => {
      component.save();
      const [season] = mockSeasonService.postSeason.calls.mostRecent().args;
      expect(season.seasonId).toBe(0);
      expect(season.description).toBe('Fall 2026');
    });

    it('passes logged-in user id to postSeason', () => {
      component.save();
      const [, userId] = mockSeasonService.postSeason.calls.mostRecent().args;
      expect(userId).toBe(1);
    });

    it('calls updateSelectedSeason, fetchSeasons, fetchCurrentSeason on success', () => {
      component.save();
      expect(mockSeasonService.updateSelectedSeason).toHaveBeenCalledWith(mockSeason(99));
      expect(mockSeasonService.fetchSeasons).toHaveBeenCalled();
      expect(mockSeasonService.fetchCurrentSeason).toHaveBeenCalled();
    });

    it('shows season created snackbar on save', () => {
      component.save();
      expect(mockSnackBar.open).toHaveBeenCalledWith('Season created', 'OK', { duration: 2500 });
    });

    it('stores the new season id after save', () => {
      component.save();
      expect(component.newSeasonId()).toBe(99);
    });

    it('calls DivisionService.save and TeamService.addTeam for all divisions and teams', () => {
      component.save();
      expect(mockDivisionService.save).toHaveBeenCalledTimes(10);
      expect(mockTeamService.addTeam).toHaveBeenCalledTimes(60);
    });

    it('sets seasonCreated to true after all divisions are created', () => {
      component.save();
      expect(component.seasonCreated()).toBeTrue();
    });

    it('shows error snackbar when postSeason fails', () => {
      spyOn(console, 'error');
      mockSeasonService.postSeason.and.returnValue(throwError(() => new Error('net error')));
      component.save();
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        jasmine.stringContaining('Failed'),
        'Close',
        jasmine.any(Object)
      );
    });
  });

  describe('createDivisions()', () => {
    beforeEach(() => {
      component.newSeasonId.set(99);
    });

    it('canCreateDivisions is true when rows are selected', () => {
      expect(component.canCreateDivisions()).toBeTrue();
    });

    it('canCreateDivisions is false when all rows deselected', () => {
      component.rows().forEach((r) => r.selected.set(false));
      expect(component.canCreateDivisions()).toBeFalse();
    });

    it('calls DivisionService.save once per selected row', () => {
      component.createDivisions();
      expect(mockDivisionService.save).toHaveBeenCalledTimes(10);
    });

    it('passes the correct seasonId to each division', () => {
      component.createDivisions();
      (mockDivisionService.save.calls.allArgs() as [Division][]).forEach(([d]) => {
        expect(d.seasonId).toBe(99);
      });
    });

    it('calls TeamService.addTeam for each team (10 × 6 = 60)', () => {
      component.createDivisions();
      expect(mockTeamService.addTeam).toHaveBeenCalledTimes(60);
    });

    it('only creates divisions for selected rows', () => {
      component.rows().slice(1).forEach((r) => r.selected.set(false));
      component.createDivisions();
      expect(mockDivisionService.save).toHaveBeenCalledTimes(1);
    });

    it('opens snackbar after all rows complete', () => {
      component.createDivisions();
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        jasmine.stringContaining('division'),
        'OK',
        jasmine.any(Object)
      );
    });
  });

  describe('finish()', () => {
    it('navigates to /admin/seasons/list', () => {
      component.finish();
      expect(routerNavigateSpy).toHaveBeenCalledWith(['/admin/seasons/list']);
    });
  });
});
