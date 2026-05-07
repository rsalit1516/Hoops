/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DraftReportService } from './draft-report.service';
import { DraftReportPlayer } from '@app/domain/draft-report-player';
import { Constants } from '@app/shared/constants';
import { LoggerService } from './logger.service';

describe('DraftReportService', () => {
  let service: DraftReportService;
  let httpMock: HttpTestingController;

  const mockPlayers: DraftReportPlayer[] = [
    {
      personId: 1,
      division: 'U12 Boys',
      draftId: '001',
      lastName: 'Johnson',
      firstName: 'John',
      dob: '2010-05-15T00:00:00' as any,
      phone: '555-111-1111',
      grade: 6,
    },
    {
      personId: 2,
      division: 'U14 Girls',
      draftId: '002',
      lastName: 'Smith',
      firstName: 'Jane',
      dob: '2012-08-20T00:00:00' as any,
      phone: '555-222-2222',
      grade: 4,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DraftReportService, LoggerService],
    });
    service = TestBed.inject(DraftReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDraftReport', () => {
    it('should fetch players for season without division', () => {
      service.getDraftReport(1, null);

      const req = httpMock.expectOne(`${Constants.DRAFT_REPORT_URL}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPlayers);

      expect(service.players()).toEqual(mockPlayers);
      expect(service.isLoading()).toBe(false);
    });

    it('should fetch players for season and division', () => {
      service.getDraftReport(1, 2);

      const req = httpMock.expectOne(`${Constants.DRAFT_REPORT_URL}/1/2`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPlayers);

      expect(service.players()).toEqual(mockPlayers);
      expect(service.isLoading()).toBe(false);
    });

    it('should set loading false and clear players on error', () => {
      spyOn(console, 'error');
      service.getDraftReport(1, null);

      const req = httpMock.expectOne(`${Constants.DRAFT_REPORT_URL}/1`);
      req.error(new ProgressEvent('error'));

      expect(service.players()).toEqual([]);
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('clearPlayers', () => {
    it('should clear the players signal', () => {
      service.getDraftReport(1, null);
      httpMock.expectOne(`${Constants.DRAFT_REPORT_URL}/1`).flush(mockPlayers);
      expect(service.players().length).toBe(2);

      service.clearPlayers();
      expect(service.players()).toEqual([]);
    });
  });
});
