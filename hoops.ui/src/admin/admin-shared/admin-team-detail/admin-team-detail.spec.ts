import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { signal } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { AdminTeamDetail } from './admin-team-detail';
import { TeamService } from '@app/services/team.service';
import { DivisionService } from '@app/services/division.service';
import { SeasonService } from '@app/services/season.service';
import { ColorService } from '../services/color.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { Team } from '@app/domain/team';
import { Division } from '@app/domain/division';

const mockDivision: Division = Object.assign(new Division(), { divisionId: 10, divisionDescription: 'HS Boys' });

const makeTeam = (teamId: number, teamNumber: string): Team =>
  Object.assign(new Team(), { teamId, teamNumber, divisionId: 10, teamName: '', teamColorId: undefined });

function buildTeamServiceMock() {
  const selectedTeamSig = signal<Team | undefined>(undefined);
  return {
    selectedTeamSignal: selectedTeamSig.asReadonly(),
    get selectedTeam(): Team | undefined { return selectedTeamSig(); },
    divisionTeams: signal<Team[]>([]),
    updateSelectedTeam: jasmine.createSpy('updateSelectedTeam').and.callFake((t: Team | undefined) => selectedTeamSig.set(t)),
    getSeasonTeams: jasmine.createSpy('getSeasonTeams'),
    saveTeam: jasmine.createSpy('saveTeam').and.returnValue(of(makeTeam(1, '1'))),
    deleteTeam: jasmine.createSpy('deleteTeam').and.returnValue(of(makeTeam(1, '1'))),
  };
}

describe('AdminTeamDetail', () => {
  let fixture: ComponentFixture<AdminTeamDetail>;
  let component: AdminTeamDetail;
  let teamService: ReturnType<typeof buildTeamServiceMock>;
  let notifySpy: jasmine.SpyObj<NotificationService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    teamService = buildTeamServiceMock();
    notifySpy = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warn', 'info']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [AdminTeamDetail, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: TeamService, useValue: teamService },
        {
          provide: DivisionService,
          useValue: { selectedDivision: signal<Division | undefined>(mockDivision) },
        },
        {
          provide: SeasonService,
          useValue: { selectedSeason: signal(undefined) },
        },
        {
          provide: ColorService,
          useValue: { colors: signal([]) },
        },
      ],
    })
    .overrideComponent(AdminTeamDetail, {
      set: {
        providers: [
          { provide: MatDialog, useValue: dialogSpy },
          { provide: NotificationService, useValue: notifySpy },
        ],
      },
    })
    .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AdminTeamDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.match(() => true).forEach(r => r.flush([]));
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isTeamNoEmpty', () => {
    it('returns true when teamNo is empty', () => {
      component.editTeamForm.teamNo().value.set('');
      expect(component.isTeamNoEmpty()).toBeTrue();
    });

    it('returns true when teamNo is whitespace only', () => {
      component.editTeamForm.teamNo().value.set('   ');
      expect(component.isTeamNoEmpty()).toBeTrue();
    });

    it('returns false when teamNo has a value', () => {
      component.editTeamForm.teamNo().value.set('5');
      expect(component.isTeamNoEmpty()).toBeFalse();
    });
  });

  describe('isDuplicateTeamNumber', () => {
    beforeEach(() => {
      teamService.divisionTeams.set([makeTeam(1, '1'), makeTeam(2, '2')]);
    });

    it('returns false when teamNo is empty', () => {
      component.editTeamForm.teamNo().value.set('');
      expect(component.isDuplicateTeamNumber()).toBeFalse();
    });

    it('returns true when another team in the division has the same number', () => {
      component.editTeamForm.teamNo().value.set('1');
      expect(component.isDuplicateTeamNumber()).toBeTrue();
    });

    it('returns false when no other team has the same number', () => {
      component.editTeamForm.teamNo().value.set('3');
      expect(component.isDuplicateTeamNumber()).toBeFalse();
    });

    it('returns false when editing the same team (same teamId)', () => {
      teamService.updateSelectedTeam(makeTeam(1, '1'));
      fixture.detectChanges();
      component.editTeamForm.teamNo().value.set('1');
      expect(component.isDuplicateTeamNumber()).toBeFalse();
    });
  });

  describe('isFormValid', () => {
    it('is false when teamNo is empty', () => {
      component.editTeamForm.teamNo().value.set('');
      expect(component.isFormValid()).toBeFalse();
    });

    it('is false when teamNo is a duplicate', () => {
      teamService.divisionTeams.set([makeTeam(1, '1')]);
      component.editTeamForm.teamNo().value.set('1');
      expect(component.isFormValid()).toBeFalse();
    });

    it('is true when teamNo is non-empty and unique', () => {
      teamService.divisionTeams.set([]);
      component.editTeamForm.teamNo().value.set('5');
      expect(component.isFormValid()).toBeTrue();
    });
  });

  describe('isExistingTeam', () => {
    it('is false for a new team (teamId 0)', () => {
      teamService.updateSelectedTeam(makeTeam(0, ''));
      fixture.detectChanges();
      expect(component.isExistingTeam()).toBeFalse();
    });

    it('is true for an existing team (teamId > 0)', () => {
      teamService.updateSelectedTeam(makeTeam(42, '3'));
      fixture.detectChanges();
      expect(component.isExistingTeam()).toBeTrue();
    });
  });

  describe('save()', () => {
    it('does nothing when form is invalid', () => {
      component.editTeamForm.teamNo().value.set('');
      component.save();
      expect(teamService.saveTeam).not.toHaveBeenCalled();
    });

    it('does nothing when form is not dirty', () => {
      component.editTeamForm.teamNo().value.set('5');
      component.save();
      expect(teamService.saveTeam).not.toHaveBeenCalled();
    });

    it('calls saveTeam and shows success notification on success', () => {
      teamService.saveTeam.and.returnValue(of(makeTeam(1, '5')));
      component.editTeamForm.teamNo().value.set('5');
      component.editTeamForm.teamNo().markAsDirty();
      component.save();
      expect(teamService.saveTeam).toHaveBeenCalled();
      expect(notifySpy.success).toHaveBeenCalledWith('Team saved');
    });

    it('shows error notification on save failure', () => {
      teamService.saveTeam.and.returnValue(throwError(() => new Error('fail')));
      component.editTeamForm.teamNo().value.set('5');
      component.editTeamForm.teamNo().markAsDirty();
      component.save();
      expect(notifySpy.error).toHaveBeenCalledWith('Failed to save team');
    });
  });

  describe('openDeleteDialog()', () => {
    it('opens ConfirmDialog with correct data', () => {
      const mockDialogRef = { afterClosed: () => of(false) };
      dialogSpy.open.and.returnValue(mockDialogRef as any);
      teamService.updateSelectedTeam(makeTeam(10, '3'));
      fixture.detectChanges();

      component.openDeleteDialog();

      expect(dialogSpy.open).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: jasmine.objectContaining({ title: 'Delete Team?' }),
        }),
      );
    });

    it('does not delete when user cancels', () => {
      const mockDialogRef = { afterClosed: () => of(false) };
      dialogSpy.open.and.returnValue(mockDialogRef as any);
      teamService.updateSelectedTeam(makeTeam(10, '3'));
      fixture.detectChanges();

      component.openDeleteDialog();
      expect(teamService.deleteTeam).not.toHaveBeenCalled();
    });

    it('calls deleteTeam and shows success notification when confirmed', () => {
      const mockDialogRef = { afterClosed: () => of(true) };
      dialogSpy.open.and.returnValue(mockDialogRef as any);
      teamService.deleteTeam.and.returnValue(of(makeTeam(10, '3')));
      teamService.updateSelectedTeam(makeTeam(10, '3'));
      fixture.detectChanges();

      component.openDeleteDialog();

      expect(teamService.deleteTeam).toHaveBeenCalledWith(10);
      expect(notifySpy.success).toHaveBeenCalledWith('Team deleted');
    });

    it('shows error notification when delete fails', () => {
      const mockDialogRef = { afterClosed: () => of(true) };
      dialogSpy.open.and.returnValue(mockDialogRef as any);
      teamService.deleteTeam.and.returnValue(throwError(() => new Error('fail')));
      teamService.updateSelectedTeam(makeTeam(10, '3'));
      fixture.detectChanges();

      component.openDeleteDialog();

      expect(notifySpy.error).toHaveBeenCalledWith('Failed to delete team');
    });
  });
});
