import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { SeasonService } from './season.service';
import { Season } from '../domain/season';

describe('SeasonService', () => {
  let service: SeasonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SeasonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.match(() => true).forEach((r) => r.flush(null));
    httpMock.verify();
  });

  describe('convertToSeasonApiFormat', () => {
    it('sets createdUser to the passed userId', () => {
      const payload = service.convertToSeasonApiFormat(new Season(), 42);

      expect(payload['createdUser']).toBe(42);
    });

    it('sets createdUser to null when no userId is provided', () => {
      const payload = service.convertToSeasonApiFormat(new Season());

      expect(payload['createdUser']).toBeNull();
    });

    it('maps onlineStarts/onlineStops to signUpsDate/signUpsEnd', () => {
      const start = new Date('2025-09-01');
      const end = new Date('2025-09-15');
      const season = new Season();
      season.onlineStarts = start;
      season.onlineStops = end;

      const payload = service.convertToSeasonApiFormat(season);

      expect(payload['signUpsDate']).toBe(start);
      expect(payload['signUpsEnd']).toBe(end);
    });

    it('always sets companyId to 1', () => {
      const payload = service.convertToSeasonApiFormat(new Season());
      expect(payload['companyId']).toBe(1);
    });
  });
});
