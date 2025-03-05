import { TestBed } from '@angular/core/testing';

import { PlayoffGameService } from './playoff-game.service';

describe('PlayoffGameService', () => {
  let service: PlayoffGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayoffGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
