import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { signal } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { AdminSeasonDetail } from './admin-season-detail';
import { SeasonService } from '@app/services/season.service';
import { AuthService } from '@app/services/auth.service';
import { Season } from '@app/domain/season';
import { User } from '@app/domain/user';

describe('AdminSeasonDetail', () => {
  let component: AdminSeasonDetail;
  let fixture: ComponentFixture<AdminSeasonDetail>;
  let mockSeasonService: any;
  let mockAuthService: any;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let routerNavigateSpy: jasmine.Spy;

  beforeEach(async () => {
    // Provide MatSnackBar as a mock so the component injects our spy directly,
    // avoiding the spyOn-after-injection instance mismatch.
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    mockAuthService = {
      currentUser: signal<User | undefined>(new User(99, 'admin', true)),
    };

    mockSeasonService = {
      selectedSeason: signal<Season | undefined>(undefined),
      season: signal(new Season()),
      seasonSaved: { set: jasmine.createSpy('seasonSaved.set') },
      postSeason: jasmine.createSpy('postSeason').and.returnValue(of(new Season())),
      putSeason: jasmine.createSpy('putSeason').and.returnValue(of(new Season())),
      fetchSeasons: jasmine.createSpy('fetchSeasons'),
      fetchCurrentSeason: jasmine.createSpy('fetchCurrentSeason'),
    };

    await TestBed.configureTestingModule({
      imports: [AdminSeasonDetail, HttpClientTestingModule],
      providers: [
        provideMockStore(),
        provideRouter([]),
        { provide: SeasonService, useValue: mockSeasonService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    })
    // overrideComponent injects the mock at the component element injector level,
    // which takes priority over MatSnackBarModule's environment injector from the
    // component's standalone imports array.
    .overrideComponent(AdminSeasonDetail, {
      add: { providers: [{ provide: MatSnackBar, useValue: mockSnackBar }] },
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSeasonDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();

    routerNavigateSpy = spyOn(TestBed.inject(Router), 'navigate').and.returnValue(Promise.resolve(true));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('new season (seasonId === 0)', () => {
    beforeEach(() => {
      component.form.patchValue({ name: 'Fall 2025', seasonId: 0 });
    });

    it('calls postSeason, not putSeason', () => {
      component.onSubmit();
      expect(mockSeasonService.postSeason).toHaveBeenCalledTimes(1);
      expect(mockSeasonService.putSeason).not.toHaveBeenCalled();
    });

    it('shows created snackbar and navigates to list on success', () => {
      component.onSubmit();
      expect(mockSnackBar.open).toHaveBeenCalledWith('Season created', 'OK', { duration: 2500 });
      expect(routerNavigateSpy).toHaveBeenCalledWith(['/admin/seasons/list']);
    });

    it('refreshes seasons list on success', () => {
      component.onSubmit();
      expect(mockSeasonService.fetchSeasons).toHaveBeenCalled();
      expect(mockSeasonService.fetchCurrentSeason).toHaveBeenCalled();
    });

    it('does not show snackbar when postSeason errors', () => {
      spyOn(console, 'error');
      mockSeasonService.postSeason.and.returnValue(throwError(() => new Error('network error')));
      component.onSubmit();
      expect(mockSnackBar.open).not.toHaveBeenCalled();
      expect(routerNavigateSpy).not.toHaveBeenCalled();
    });

    it('does not submit when form is invalid', () => {
      component.form.patchValue({ name: '' });
      component.onSubmit();
      expect(mockSeasonService.postSeason).not.toHaveBeenCalled();
    });
  });

  describe('existing season (seasonId > 0)', () => {
    beforeEach(() => {
      component.form.patchValue({ name: 'Fall 2025', seasonId: 7 });
    });

    it('calls putSeason, not postSeason', () => {
      component.onSubmit();
      expect(mockSeasonService.putSeason).toHaveBeenCalledTimes(1);
      expect(mockSeasonService.postSeason).not.toHaveBeenCalled();
    });

    it('shows updated snackbar and navigates to list on success', () => {
      component.onSubmit();
      expect(mockSnackBar.open).toHaveBeenCalledWith('Season updated', 'OK', { duration: 2500 });
      expect(routerNavigateSpy).toHaveBeenCalledWith(['/admin/seasons/list']);
    });
  });

  describe('save() field mapping', () => {
    it('maps currentSchedule and currentSignUps from form to the season passed to postSeason', () => {
      component.form.patchValue({
        name: 'Test',
        seasonId: 0,
        currentSchedule: true,
        currentSignUps: true,
      });
      component.onSubmit();
      const season: Season = mockSeasonService.postSeason.calls.mostRecent().args[0];
      expect(season.currentSchedule).toBeTrue();
      expect(season.currentSignUps).toBeTrue();
    });

    it('passes the logged-in user id to postSeason', () => {
      component.form.patchValue({ name: 'Test', seasonId: 0 });
      component.onSubmit();
      const userId = mockSeasonService.postSeason.calls.mostRecent().args[1];
      expect(userId).toBe(99);
    });
  });
});
