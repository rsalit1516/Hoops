/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WebContentService } from './web-content.service';

describe('WebContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebContentService]
    });
  });

  it('should ...', inject([WebContentService], (service: WebContentService) => {
    expect(service).toBeTruthy();
  }));
});
