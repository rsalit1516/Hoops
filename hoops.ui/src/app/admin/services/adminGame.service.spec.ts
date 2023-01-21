import { TestBed } from '@angular/core/testing';

import { AdminGameService } from './adminGame.service';

describe('GameService', () => {
  let service: AdminGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return some games', () => {
    expect(service.filterGamesByDivision(4148)).toBeTruthy();
  });

});
