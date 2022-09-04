/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SeasonService } from './season.service';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';

describe('SeasonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeasonService, DataService, HttpClient]
    });
  });

  it('should ...', inject([HttpClient,SeasonService], (service: SeasonService) => {
    expect(service).toBeTruthy();
  }));
});
