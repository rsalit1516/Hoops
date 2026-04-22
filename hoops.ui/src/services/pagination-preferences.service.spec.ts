import { TestBed } from '@angular/core/testing';
import { PaginationPreferencesService } from './pagination-preferences.service';

describe('PaginationPreferencesService', () => {
  let service: PaginationPreferencesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginationPreferencesService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return the fallback when nothing is stored', () => {
    expect(service.getPageSize(10)).toBe(10);
  });

  it('should return a custom fallback when nothing is stored', () => {
    expect(service.getPageSize(25)).toBe(25);
  });

  it('should return the stored value when one exists', () => {
    service.savePageSize(50);
    expect(service.getPageSize(10)).toBe(50);
  });

  it('should overwrite a previously stored value', () => {
    service.savePageSize(25);
    service.savePageSize(100);
    expect(service.getPageSize(10)).toBe(100);
  });

  it('should write the page size to localStorage', () => {
    service.savePageSize(25);
    expect(localStorage.getItem('hoops.pageSize')).toBe('25');
  });
});
