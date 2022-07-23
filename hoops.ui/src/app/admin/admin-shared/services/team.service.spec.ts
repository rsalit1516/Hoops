import { TestBed } from '@angular/core/testing';

import { TeamService } from './team.service';

describe('TeamService', () => {
  let service: TeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('add New Team', (done: DoneFn) => {
    service.newTeam().then((response) => {
      expect(response).toBeTruthy();
      done();
    });
  })
});
