import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service'; // Replace with actual service name

interface TestData {
  id: number;
  name: string;
}

describe('YourService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });

    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that no requests are outstanding
  });

  describe('put', () => {
    it('should make a PUT request with the correct URL and data', () => {
      const testUrl = 'api/test';
      const testData: TestData = { id: 1, name: 'Test' };

      service.put<TestData>(testUrl, testData).subscribe(response => {
        expect(response).toEqual(testData);
      });

      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(testData);
      expect(req.request.headers.has('Content-Type')).toBeTrue();
      expect(req.request.headers.get('Content-Type')).toBe('application/json');

      req.flush(testData);
    });

    it('should handle errors appropriately', () => {
      const testUrl = 'api/test';
      const testData: TestData = { id: 1, name: 'Test' };
      const errorMessage = 'Internal Server Error';

      service.put<TestData>(testUrl, testData).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush('', { status: 500, statusText: errorMessage });
    });

    it('should handle null response', () => {
      const testUrl = 'api/test';
      const testData: TestData = { id: 1, name: 'Test' };

      service.put<TestData>(testUrl, testData).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(testUrl);
      req.flush(null);
    });

    it('should include custom headers in the request', () => {
      const testUrl = 'api/test';
      const testData: TestData = { id: 1, name: 'Test' };

      service.put<TestData>(testUrl, testData).subscribe();

      const req = httpMock.expectOne(testUrl);
      expect(req.request.headers.has('Content-Type')).toBeTrue();
      expect(req.request.headers.get('Content-Type')).toBe('application/json');

      req.flush(testData);
    });
  });
});
