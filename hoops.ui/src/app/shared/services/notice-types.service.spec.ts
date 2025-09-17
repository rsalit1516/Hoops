import { TestBed } from '@angular/core/testing';

import { NoticeTypesService } from './notice-types.service';

describe('NoticeTypesService', () => {
  let service: NoticeTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoticeTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
