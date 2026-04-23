import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { signal } from '@angular/core';

import { SeasonService } from './season.service';
import { AuthService } from './auth.service';
import { Season } from '../domain/season';
import { User } from '../domain/user';

describe('SeasonService', () => {
  let service: SeasonService;
  let httpMock: HttpTestingController;
  let mockAuthService: { currentUser: ReturnType<typeof signal<User | undefined>> };

  beforeEach(() => {
    mockAuthService = { currentUser: signal<User | undefined>(undefined) };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });
    service = TestBed.inject(SeasonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.match(() => true).forEach((r) => r.flush(null));
    httpMock.verify();
  });

  describe('convertToSeasonApiFormat', () => {
    it('sets createdUser to the logged-in user id', () => {
      mockAuthService.currentUser.set(new User(42, 'admin', true));

      const payload = service.convertToSeasonApiFormat(new Season());

      expect(payload['createdUser']).toBe(42);
    });

    it('sets createdUser to null when no user is logged in', () => {
      mockAuthService.currentUser.set(undefined);

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
