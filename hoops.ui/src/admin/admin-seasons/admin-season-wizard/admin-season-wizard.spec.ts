import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminSeasonWizard } from './admin-season-wizard';
import { SeasonService } from '@app/services/season.service';
import { AuthService } from '@app/services/auth.service';
import { DivisionService } from '@app/services/division.service';
import { TeamService } from '@app/services/team.service';
import { AdminSeasonService } from '../../admin-shared/services/season.service';
import { LoggerService } from '@app/services/logger.service';
import { Season } from '@app/domain/season';
import { User } from '@app/domain/user';
import { Division } from '@app/domain/division';

function mockSeason(id: number): Season {
  return Object.assign(new Season(), { seasonId: id, description: 'Test', currentSeason: false });
}

describe('AdminSeasonWizard', () => {
  let component: AdminSeasonWizard;
  let fixture: ComponentFixture<AdminSeasonWizard>;
  let mockSeasonService: any;
  let mockAuthService: any;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let routerNavigateSpy: jasmine.Spy;

  beforeEach(async () => {
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    mockSeasonService = {
      selectedSeason: signal<Season | undefined>(undefined),
      season1: undefined,
      postSeason: jasmine.createSpy('postSeason').and.returnValue(of(mockSeason(99))),
      updateSelectedSeason: jasmine.createSpy('updateSelectedSeason'),
      fetchSeasons: jasmine.createSpy('fetchSeasons'),
      fetchCurrentSeason: jasmine.createSpy('fetchCurrentSeason'),
      seasons: [],
    };

    mockAuthService = {
      currentUser: signal<User | undefined>(new User(1, 'admin', true)),
    };

    const mockDivisionService = {
      save: jasmine.createSpy('save').and.callFake(() => of(Object.assign(new Division(), { divisionId: 1 }))),
      selectedDivision: signal<Division | undefined>(undefined),
      seasonDivisions: signal<Division[] | undefined>(undefined),
    };

    const mockTeamService = {
      addTeam: jasmine.createSpy('addTeam').and.callFake(() => of({})),
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
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: DivisionService, useValue: mockDivisionService },
        { provide: TeamService, useValue: mockTeamService },
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

  it('form is invalid when name is empty', () => {
    component.form.patchValue({ name: '' });
    expect(component.form.valid).toBeFalse();
  });

  it('form is valid when name is provided', () => {
    component.form.patchValue({ name: 'Fall 2026' });
    expect(component.form.valid).toBeTrue();
  });

  describe('saveAndContinue()', () => {
    beforeEach(() => {
      component.form.patchValue({ name: 'Fall 2026' });
    });

    it('does nothing when form is invalid', () => {
      component.form.patchValue({ name: '' });
      component.saveAndContinue();
      expect(mockSeasonService.postSeason).not.toHaveBeenCalled();
    });

    it('calls postSeason with a new season (seasonId 0)', () => {
      component.saveAndContinue();
      const [season] = mockSeasonService.postSeason.calls.mostRecent().args;
      expect(season.seasonId).toBe(0);
      expect(season.description).toBe('Fall 2026');
    });

    it('passes the logged-in user id to postSeason', () => {
      component.saveAndContinue();
      const [, userId] = mockSeasonService.postSeason.calls.mostRecent().args;
      expect(userId).toBe(1);
    });

    it('calls updateSelectedSeason, fetchSeasons, fetchCurrentSeason on success', () => {
      component.saveAndContinue();
      expect(mockSeasonService.updateSelectedSeason).toHaveBeenCalledWith(mockSeason(99));
      expect(mockSeasonService.fetchSeasons).toHaveBeenCalled();
      expect(mockSeasonService.fetchCurrentSeason).toHaveBeenCalled();
    });

    it('shows success snackbar on save', () => {
      component.saveAndContinue();
      expect(mockSnackBar.open).toHaveBeenCalledWith('Season created', 'OK', { duration: 2500 });
    });

    it('does not call postSeason when postSeason errors, shows error snackbar', () => {
      spyOn(console, 'error');
      mockSeasonService.postSeason.and.returnValue(throwError(() => new Error('net error')));
      component.saveAndContinue();
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        jasmine.stringContaining('Failed'),
        'Close',
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
