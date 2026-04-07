import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HouseholdService } from './household.service';
import { Household } from '@app/domain/household';
import { Person } from '@app/domain/person';
import { Constants } from '@app/shared/constants';
import { PeopleService } from './people.service';

describe('HouseholdService', () => {
  let service: HouseholdService;
  let httpMock: HttpTestingController;

  const searchBase = Constants.SEARCH_HOUSEHOLD_URL;

  const mockHouseholds: Household[] = [
    { houseId: 1, name: 'Smith Family', companyId: 1 } as Household,
    { houseId: 2, name: 'Smithson Household', companyId: 1 } as Household,
  ];

  const peopleServiceStub = {
    getHouseholdMembers: jasmine.createSpy('getHouseholdMembers'),
    householdMembers: [] as Person[],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HouseholdService,
        { provide: PeopleService, useValue: peopleServiceStub },
      ],
    });

    service = TestBed.inject(HouseholdService);
    httpMock = TestBed.inject(HttpTestingController);

    // Flush any requests triggered by the constructor (httpResource with empty searchUrl)
    httpMock.match(() => true).forEach((req) => req.flush(null));
  });

  afterEach(() => {
    httpMock.match(() => true).forEach((req) => req.flush(null));
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('searchByName', () => {
    // ── Positive tests ──────────────────────────────────────────────────────

    it('should make a GET request to the correct URL with the name param', () => {
      service.searchByName('Smith').subscribe();

      const req = httpMock.expectOne(`${searchBase}?name=Smith`);
      expect(req.request.method).toBe('GET');
      req.flush(mockHouseholds);
    });

    it('should return matching households from the API response', () => {
      let result: Household[] = [];
      service.searchByName('Smith').subscribe((h) => (result = h));

      httpMock.expectOne(`${searchBase}?name=Smith`).flush(mockHouseholds);

      expect(result).toEqual(mockHouseholds);
      expect(result.length).toBe(2);
    });

    it('should return an empty array when the API returns no matches', () => {
      let result: Household[] = [];
      service.searchByName('Zzzzzz').subscribe((h) => (result = h));

      httpMock.expectOne(`${searchBase}?name=Zzzzzz`).flush([]);

      expect(result).toEqual([]);
    });

    it('should URL-encode special characters in the search term', () => {
      service.searchByName("O'Brien").subscribe();

      const req = httpMock.expectOne(`${searchBase}?name=O'Brien`);
      expect(req.request.url).toContain(encodeURIComponent("O'Brien"));
      req.flush([]);
    });

    it('should return a single household when API returns exactly one match', () => {
      const single: Household[] = [mockHouseholds[0]];
      let result: Household[] = [];
      service.searchByName('Smith Family').subscribe((h) => (result = h));

      httpMock.expectOne(`${searchBase}?name=Smith%20Family`).flush(single);

      expect(result.length).toBe(1);
      expect(result[0].houseId).toBe(1);
    });

    // ── Negative tests ──────────────────────────────────────────────────────

    it('should propagate an HTTP error to the subscriber', () => {
      let caught = false;
      service.searchByName('Error').subscribe({
        error: () => (caught = true),
      });

      httpMock
        .expectOne(`${searchBase}?name=Error`)
        .flush('Server error', { status: 500, statusText: 'Internal Server Error' });

      expect(caught).toBeTrue();
    });

    it('should propagate a 404 error to the subscriber', () => {
      let caughtStatus = 0;
      service.searchByName('Missing').subscribe({
        error: (err) => (caughtStatus = err.status),
      });

      httpMock
        .expectOne(`${searchBase}?name=Missing`)
        .flush('Not found', { status: 404, statusText: 'Not Found' });

      expect(caughtStatus).toBe(404);
    });
  });
});
