import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NoticeTypesService } from './notice-types.service';

describe('NoticeTypesService', () => {
  let service: NoticeTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(NoticeTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
