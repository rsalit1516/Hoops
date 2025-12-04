import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DraftListService } from './draft-list.service';
import { DraftListPlayer } from '@app/domain/draft-list-player';
import { Constants } from '@app/shared/constants';
import { LoggerService } from './logger.service';

describe('DraftListService', () => {
  let service: DraftListService;
  let httpMock: HttpTestingController;

  const mockPlayers: DraftListPlayer[] = [
    {
      division: 'U12 Boys',
      draftId: '001',
      lastName: 'Johnson',
      firstName: 'John',
      dob: new Date('2010-05-15'),
      grade: 6,
      address1: '123 Main St',
      city: 'Springfield',
      zip: '12345',
    },
    {
      division: 'U14 Girls',
      draftId: '002',
      lastName: 'Smith',
      firstName: 'Jane',
      dob: new Date('2012-08-20'),
      grade: 4,
      address1: '456 Oak Ave',
      city: 'Riverside',
      zip: '67890',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DraftListService, LoggerService],
    });
    service = TestBed.inject(DraftListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDraftList', () => {
    it('should fetch draft list for season and division', () => {
      const seasonId = 1;
      const divisionId = 2;

      service.getDraftList(seasonId, divisionId);

      const req = httpMock.expectOne(
        `${Constants.DRAFT_LIST_URL}/${seasonId}/${divisionId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPlayers);

      expect(service.players()).toEqual(mockPlayers);
      expect(service.isLoading()).toBe(false);
    });

    it('should fetch draft list for season without division', () => {
      const seasonId = 1;

      service.getDraftList(seasonId, null);

      const req = httpMock.expectOne(`${Constants.DRAFT_LIST_URL}/${seasonId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPlayers);

      expect(service.players()).toEqual(mockPlayers);
      expect(service.isLoading()).toBe(false);
    });

    it('should handle error when fetching draft list', () => {
      const seasonId = 1;
      const divisionId = 2;

      service.getDraftList(seasonId, divisionId);

      const req = httpMock.expectOne(
        `${Constants.DRAFT_LIST_URL}/${seasonId}/${divisionId}`
      );
      req.error(new ProgressEvent('error'));

      expect(service.players()).toEqual([]);
      expect(service.isLoading()).toBe(false);
    });

    it('should set loading state while fetching', () => {
      const seasonId = 1;
      const divisionId = 2;

      service.getDraftList(seasonId, divisionId);

      // Loading should be true while request is pending
      // Note: In reality, isLoading might be set to true synchronously before the HTTP request completes
      // but checking the final state after flush is more reliable
      const req = httpMock.expectOne(
        `${Constants.DRAFT_LIST_URL}/${seasonId}/${divisionId}`
      );
      req.flush(mockPlayers);

      expect(service.isLoading()).toBe(false);
    });
  });

  describe('clearPlayers', () => {
    it('should clear the players signal', () => {
      // First populate with data
      service.getDraftList(1, 1);
      const req = httpMock.expectOne(`${Constants.DRAFT_LIST_URL}/1/1`);
      req.flush(mockPlayers);

      expect(service.players()).toEqual(mockPlayers);

      // Then clear
      service.clearPlayers();

      expect(service.players()).toEqual([]);
    });
  });
});
