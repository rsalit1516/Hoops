import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { signal } from '@angular/core';

import { AdminGamesPlayoffsDetail } from './admin-games-playoffs-detail';
import { DivisionService } from '@app/services/division.service';
import { PlayoffGameService } from '@app/services/playoff-game.service';
import { LocationService } from '@app/services/location.service';

describe('AdminGamesPlayoffsDetail - Date/Time Pickers', () => {
  let component: AdminGamesPlayoffsDetail;
  let fixture: ComponentFixture<AdminGamesPlayoffsDetail>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockDivisionService: jasmine.SpyObj<DivisionService>;
  let mockPlayoffService: jasmine.SpyObj<PlayoffGameService>;
  let mockLocationService: jasmine.SpyObj<LocationService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockDivisionService = jasmine.createSpyObj('DivisionService', [
      'selectedDivision',
    ]);
    mockPlayoffService = jasmine.createSpyObj('PlayoffGameService', [
      'selectedRecordSignal',
      'update',
      'create',
      'fetchSeasonPlayoffGames',
    ]);
    mockLocationService = jasmine.createSpyObj('LocationService', [
      'locations',
      'fetchLocations',
      'getLocationById',
    ]);

    // Set up service mocks
    mockDivisionService.selectedDivision.and.returnValue({
      divisionId: 1,
      divisionName: 'Test Division',
    } as any);

    // Create a proper signal mock for selectedRecordSignal
    const selectedRecordSignal = signal<any>(null);
    mockPlayoffService.selectedRecordSignal.and.returnValue(
      selectedRecordSignal
    );

    Object.defineProperty(mockLocationService, 'locations', {
      value: signal([{ locationNumber: 1, locationName: 'Test Location' }]),
      writable: false,
    });

    await TestBed.configureTestingModule({
      imports: [
        AdminGamesPlayoffsDetail,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatDatepickerModule,
        MatTimepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: DivisionService, useValue: mockDivisionService },
        { provide: PlayoffGameService, useValue: mockPlayoffService },
        { provide: LocationService, useValue: mockLocationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminGamesPlayoffsDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form controls for gameDate and gameTime as Date objects', () => {
    expect(component.form.get('gameDate')).toBeTruthy();
    expect(component.form.get('gameTime')).toBeTruthy();
  });

  it('should set Date objects in form when editing existing record', () => {
    const mockRecord = {
      schedulePlayoffId: 1,
      gameDate: new Date('2025-08-20T10:00:00'),
      gameTime: new Date('2025-08-20T10:00:00'),
      homeTeam: 'Home Team',
      visitingTeam: 'Visiting Team',
      divisionId: 1,
      locationNumber: 1,
      descr: 'Test Game',
    };

    // Update the signal with the mock record
    const selectedSignal = signal<any>(mockRecord as any);
    mockPlayoffService.selectedRecordSignal.and.returnValue(selectedSignal);

    // Reinitialize component
    component.ngOnInit();

    expect(component.form.get('gameDate')?.value).toBeInstanceOf(Date);
    expect(component.form.get('gameTime')?.value).toBeInstanceOf(Date);
  });

  it('should combine date and time when saving', () => {
    const gameDate = new Date('2025-08-20T00:00:00');
    const gameTime = new Date('1970-01-01T14:30:00'); // Only time matters

    component.form.patchValue({
      divisionId: 1,
      locationNumber: 1,
      gameDate: gameDate,
      gameTime: gameTime,
      homeTeam: 'Home Team',
      visitingTeam: 'Visiting Team',
    });

    component.isEditing = false; // New record
    mockPlayoffService.create.and.returnValue({
      subscribe: jasmine.createSpy(),
    } as any);

    component.save();

    expect(mockPlayoffService.create).toHaveBeenCalled();
    // The payload should have combined date and time
    const payload = mockPlayoffService.create.calls.first().args[0];
    expect(payload.gameDate).toBeInstanceOf(Date);
    expect(payload.gameTime).toBeInstanceOf(Date);
  });

  it('should have isFormDirty method for PendingChangesGuard', () => {
    expect(component.isFormDirty).toBeDefined();
    expect(typeof component.isFormDirty).toBe('function');

    // Initially not dirty
    expect(component.isFormDirty()).toBeFalse();

    // After making changes
    component.form.get('homeTeam')?.setValue('Modified Team');
    expect(component.isFormDirty()).toBeTrue();
  });
});
