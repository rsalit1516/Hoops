import { TestBed } from '@angular/core/testing';

import { GamesResolver } from './games.resolver';

describe('GamesResolver', () => {
  let resolver: GamesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(GamesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
