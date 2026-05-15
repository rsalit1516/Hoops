import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminSponsorService } from './admin-sponsor.service';
import { DataService } from '@app/services/data.service';
import { LoggerService } from '@app/services/logger.service';
import { Constants } from '@app/shared/constants';
import { SponsorProfile, SponsorSeason, SponsorPayment } from '@app/domain/sponsor-profile';
import { of } from 'rxjs';

describe('AdminSponsorService', () => {
  let service: AdminSponsorService;
  let httpMock: HttpTestingController;
  let mockLogger: jasmine.SpyObj<LoggerService>;

  const makeProfile = (id = 5): SponsorProfile => ({
    sponsorProfileId: id, companyId: 1, houseId: null,
    spoName: 'Acme', contactName: 'Alice', email: 'a@a.com', phone: '555-0100',
    url: '', address: '', city: '', state: '', zip: '', typeOfBuss: '',
    showAd: false, adExpiration: null,
  });

  const makeSeason = (): SponsorSeason => ({
    sponsorId: 1, sponsorProfileId: 5, seasonId: 10, seasonDescription: 'Fall 2025',
    shirtName: 'Acme', shirtSize: 'L', spoAmount: 225, feeId: 1, mailCheck: false, adExpiration: null,
  });

  const makePayment = (id = 1): SponsorPayment => ({
    paymentId: id, sponsorProfileId: 5, amount: 100, paymentType: 'Check',
    transactionDate: null, transactionNumber: '1234', memo: '',
  });

  beforeEach(() => {
    mockLogger = jasmine.createSpyObj('LoggerService', ['info', 'warn', 'error', 'debug']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AdminSponsorService,
        {
          provide: DataService,
          useValue: {
            handleError: jasmine.createSpy('handleError').and.callFake((_op: string, result?: any) => () => of(result))
          }
        },
        { provide: LoggerService, useValue: mockLogger },
      ],
    });

    service = TestBed.inject(AdminSponsorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.match(() => true).forEach(r => r.flush([]));
    httpMock.verify();
  });

  // ── loadProfile ───────────────────────────────────────────────────────────

  it('should load profile and update signal', () => {
    const profile = makeProfile(5);
    service.loadProfile(5);
    httpMock.expectOne(r => r.url.includes('/api/SponsorProfile/5')).flush(profile);
    expect(service.profileDetail()?.sponsorProfileId).toBe(5);
    expect(service.isLoadingProfile()).toBeFalse();
  });

  it('should set isLoadingProfile false and log on HTTP error', () => {
    service.loadProfile(5);
    httpMock.expectOne(r => r.url.includes('/api/SponsorProfile/5')).error(new ProgressEvent('error'));
    expect(service.isLoadingProfile()).toBeFalse();
    expect(mockLogger.error).toHaveBeenCalled();
  });

  // ── saveProfile (create) ──────────────────────────────────────────────────

  it('should POST to create a new profile', () => {
    const newProfile = makeProfile(0);
    let result: SponsorProfile | undefined;
    service.saveProfile(newProfile).subscribe(p => (result = p));
    const req = httpMock.expectOne(r => r.method === 'POST' && r.url.includes('/api/SponsorProfile'));
    req.flush(makeProfile(99));
    expect(result?.sponsorProfileId).toBe(99);
    expect(service.profileDetail()?.sponsorProfileId).toBe(99);
  });

  it('should PUT to update an existing profile', () => {
    const existing = makeProfile(5);
    service.saveProfile(existing).subscribe();
    const req = httpMock.expectOne(r => r.method === 'PUT' && r.url.includes('/api/SponsorProfile/5'));
    req.flush(existing);
    expect(req.request.method).toBe('PUT');
  });

  // ── loadSeasons ───────────────────────────────────────────────────────────

  it('should load seasons and update signal', () => {
    service.loadSeasons(5);
    httpMock.expectOne(r => r.url.includes('/api/Sponsor/ByProfile/5')).flush([makeSeason()]);
    expect(service.seasons().length).toBe(1);
    expect(service.isLoadingSeasons()).toBeFalse();
  });

  it('should set seasons to empty array on HTTP error', () => {
    service.loadSeasons(5);
    httpMock.expectOne(r => r.url.includes('/api/Sponsor/ByProfile/5')).error(new ProgressEvent('error'));
    expect(service.seasons().length).toBe(0);
    expect(service.isLoadingSeasons()).toBeFalse();
  });

  // ── loadPayments ──────────────────────────────────────────────────────────

  it('should load payments and update signal', () => {
    service.loadPayments(5);
    httpMock.expectOne(r => r.url.includes('/api/SponsorPayment/ByProfile/5')).flush([makePayment()]);
    expect(service.payments().length).toBe(1);
    expect(service.isLoadingPayments()).toBeFalse();
  });

  it('should set payments empty on HTTP error', () => {
    service.loadPayments(5);
    httpMock.expectOne(r => r.url.includes('/api/SponsorPayment/ByProfile/5')).error(new ProgressEvent('error'));
    expect(service.payments().length).toBe(0);
  });

  // ── savePayment (create) ──────────────────────────────────────────────────

  it('should POST a new payment and prepend to payments signal', () => {
    service.loadPayments(5);
    httpMock.expectOne(r => r.url.includes('/api/SponsorPayment/ByProfile/5')).flush([makePayment(1)]);

    const newPayment = makePayment(0);
    service.savePayment(newPayment).subscribe();
    const req = httpMock.expectOne(r => r.method === 'POST' && r.url.includes('/api/SponsorPayment'));
    req.flush(makePayment(2));
    expect(service.payments().some(p => p.paymentId === 2)).toBeTrue();
  });

  // ── clearDetail ───────────────────────────────────────────────────────────

  it('should reset all detail signals on clearDetail', () => {
    service.loadProfile(5);
    httpMock.expectOne(r => r.url.includes('/api/SponsorProfile/5')).flush(makeProfile(5));
    service.clearDetail();
    expect(service.profileDetail()).toBeNull();
    expect(service.seasons().length).toBe(0);
    expect(service.payments().length).toBe(0);
  });
});
