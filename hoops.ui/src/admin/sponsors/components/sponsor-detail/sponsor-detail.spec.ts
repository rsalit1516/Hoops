import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { SponsorDetail } from './sponsor-detail';
import { AdminSponsorService } from '../../admin-sponsor.service';
import { SeasonService } from '@app/services/season.service';
import { LoggerService } from '@app/services/logger.service';
import { SponsorProfile, SponsorSeason, SponsorPayment, SponsorFee } from '@app/domain/sponsor-profile';
import { Season } from '@app/domain/season';
import { of } from 'rxjs';

describe('SponsorDetail', () => {
  let component: SponsorDetail;
  let fixture: ComponentFixture<SponsorDetail>;
  let mockSponsorService: Partial<AdminSponsorService>;
  let mockSeasonService: { currentSeason: ReturnType<typeof signal<Season | undefined>>; fetchCurrentSeason: jasmine.Spy };

  const mockProfile: SponsorProfile = {
    sponsorProfileId: 5, companyId: 1, houseId: null,
    spoName: 'Acme Corp', contactName: 'Alice', email: 'a@a.com', phone: '555-0100',
    url: '', address: '', city: '', state: '', zip: '', typeOfBuss: '',
    showAd: false, adExpiration: null,
  };

  beforeEach(async () => {
    mockSponsorService = {
      profileDetail: signal<SponsorProfile | null>(null),
      seasons: signal<SponsorSeason[]>([]),
      payments: signal<SponsorPayment[]>([]),
      fees: signal<SponsorFee[]>([]),
      isLoadingProfile: signal(false),
      isLoadingSeasons: signal(false),
      isLoadingPayments: signal(false),
      loadProfile: jasmine.createSpy('loadProfile'),
      loadSeasons: jasmine.createSpy('loadSeasons'),
      loadPayments: jasmine.createSpy('loadPayments'),
      loadFees: jasmine.createSpy('loadFees'),
      clearDetail: jasmine.createSpy('clearDetail'),
      saveProfile: jasmine.createSpy('saveProfile').and.returnValue(of(mockProfile)),
      saveSeasonEntry: jasmine.createSpy('saveSeasonEntry').and.returnValue(of({})),
      savePayment: jasmine.createSpy('savePayment').and.returnValue(of({})),
    };

    mockSeasonService = {
      currentSeason: signal<Season | undefined>(undefined),
      fetchCurrentSeason: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      imports: [SponsorDetail, NoopAnimationsModule],
      providers: [
        { provide: AdminSponsorService, useValue: mockSponsorService },
        { provide: SeasonService, useValue: mockSeasonService },
        {
          provide: LoggerService,
          useValue: { info: jasmine.createSpy(), warn: jasmine.createSpy(), error: jasmine.createSpy(), debug: jasmine.createSpy() },
        },
      ],
    }).compileComponents();
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(SponsorDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  // ── Creation ──────────────────────────────────────────────────────────────

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  // ── New mode ──────────────────────────────────────────────────────────────

  it('should call clearDetail when isNew is true', () => {
    createComponent();
    fixture.componentRef.setInput('isNew', true);
    fixture.detectChanges();
    expect(mockSponsorService.clearDetail).toHaveBeenCalled();
  });

  it('canSaveProfile should be true when form is valid in new mode', () => {
    createComponent();
    fixture.componentRef.setInput('isNew', true);
    fixture.detectChanges();
    component.profileForm.spoName().value.set('Test Sponsor');
    component.profileForm.contactName().value.set('Contact Person');
    fixture.detectChanges();
    expect(component.canSaveProfile()).toBeTrue();
  });

  it('canSaveProfile should be false when required fields are empty in new mode', () => {
    createComponent();
    fixture.componentRef.setInput('isNew', true);
    fixture.detectChanges();
    expect(component.canSaveProfile()).toBeFalse();
  });

  // ── Edit mode ─────────────────────────────────────────────────────────────

  it('should load profile, seasons, payments when sponsorProfileId is set', () => {
    createComponent();
    fixture.componentRef.setInput('sponsorProfileId', 5);
    fixture.detectChanges();
    expect(mockSponsorService.loadProfile).toHaveBeenCalledWith(5);
    expect(mockSponsorService.loadSeasons).toHaveBeenCalledWith(5);
    expect(mockSponsorService.loadPayments).toHaveBeenCalledWith(5);
  });

  it('canSaveProfile should be false when form is pristine (no changes)', () => {
    createComponent();
    fixture.componentRef.setInput('sponsorProfileId', 5);
    // Simulate profile loaded
    (mockSponsorService.profileDetail as ReturnType<typeof signal<SponsorProfile | null>>).set(mockProfile);
    fixture.detectChanges();
    // No changes made → not dirty
    expect(component.canSaveProfile()).toBeFalse();
  });

  it('canSaveProfile should be true when form is dirty and valid in edit mode', () => {
    createComponent();
    fixture.componentRef.setInput('sponsorProfileId', 5);
    (mockSponsorService.profileDetail as ReturnType<typeof signal<SponsorProfile | null>>).set(mockProfile);
    fixture.detectChanges();
    component.profileForm.spoName().value.set('New Name');
    component.profileForm.spoName().markAsDirty();
    fixture.detectChanges();
    expect(component.canSaveProfile()).toBeTrue();
  });

  // ── Save profile ──────────────────────────────────────────────────────────

  it('should call saveProfile on service when onSaveProfile is called with valid form', () => {
    createComponent();
    fixture.componentRef.setInput('isNew', true);
    fixture.detectChanges();
    component.profileForm.spoName().value.set('Test');
    component.profileForm.contactName().value.set('Contact');
    component.onSaveProfile();
    expect(mockSponsorService.saveProfile).toHaveBeenCalled();
  });

  it('should not call saveProfile when canSaveProfile is false', () => {
    createComponent();
    fixture.detectChanges();
    (mockSponsorService.saveProfile as jasmine.Spy).calls.reset();
    component.onSaveProfile();
    expect(mockSponsorService.saveProfile).not.toHaveBeenCalled();
  });

  // ── Close / cancel ────────────────────────────────────────────────────────

  it('should emit closed event when onCancel is called', () => {
    createComponent();
    let emitted = false;
    component.closed.subscribe(() => (emitted = true));
    component.onCancel();
    expect(emitted).toBeTrue();
  });

  // ── Payment add ───────────────────────────────────────────────────────────

  it('canSavePayment should be false when amount is null or zero', () => {
    createComponent();
    expect(component.canSavePayment()).toBeFalse();
  });

  it('canSavePayment should be true when amount is positive', () => {
    createComponent();
    component.paymentForm.amount().value.set(100);
    fixture.detectChanges();
    expect(component.canSavePayment()).toBeTrue();
  });

  it('totalPayments should sum all payment amounts', () => {
    createComponent();
    (mockSponsorService.payments as ReturnType<typeof signal<SponsorPayment[]>>).set([
      { paymentId: 1, sponsorProfileId: 5, amount: 100, paymentType: 'Check', transactionDate: null, transactionNumber: '', memo: '' },
      { paymentId: 2, sponsorProfileId: 5, amount: 225, paymentType: 'Cash',  transactionDate: null, transactionNumber: '', memo: '' },
    ]);
    fixture.detectChanges();
    expect(component.totalPayments()).toBe(325);
  });
});
