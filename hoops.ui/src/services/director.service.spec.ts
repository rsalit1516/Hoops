import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DirectorService } from './director.service';
import { Director } from '@app/domain/director';
import { Constants } from '@app/shared/constants';

describe('DirectorService', () => {
  let service: DirectorService;
  let httpMock: HttpTestingController;

  const mockDirectors: Director[] = [
    {
      directorId: 1,
      companyId: 1,
      personId: 101,
      seq: 1,
      title: 'Board President',
      name: 'John Smith',
      createdDate: new Date('2024-01-01'),
      createdUser: 'admin',
    },
    {
      directorId: 2,
      companyId: 1,
      personId: 102,
      seq: 2,
      title: 'Vice President',
      name: 'Alice Johnson',
      createdDate: new Date('2024-01-02'),
      createdUser: 'admin',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DirectorService],
    });
    service = TestBed.inject(DirectorService);
    httpMock = TestBed.inject(HttpTestingController);

    // Flush requests triggered by the constructor (fetchDirectors + httpResource init)
    httpMock.match(Constants.GET_DIRECTOR_URL).forEach(req => req.flush([]));
  });

  afterEach(() => {
    // Flush any remaining requests (e.g., async httpResource reloads)
    httpMock.match(Constants.GET_DIRECTOR_URL).forEach(req => req.flush([]));
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchDirectors', () => {
    it('should fetch directors and update signal', () => {
      service.fetchDirectors();

      // fetchDirectors makes 2 GET requests: http.get() + directorsResource.reload()
      const requests = httpMock.match(Constants.GET_DIRECTOR_URL);
      expect(requests.length).toBeGreaterThanOrEqual(1);
      requests.forEach(req => req.flush(mockDirectors));

      expect(service.directorsSignal()).toEqual(mockDirectors);
    });

    it('should handle error when fetching directors', () => {
      spyOn(console, 'error');

      service.fetchDirectors();

      const requests = httpMock.match(Constants.GET_DIRECTOR_URL);
      // Error the first request (http.get), flush any others
      requests[0].error(new ProgressEvent('error'));
      requests.slice(1).forEach(req => req.flush([]));

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new director', (done) => {
      const newDirector: Director = {
        directorId: 0,
        companyId: 1,
        personId: 103,
        seq: 3,
        title: 'Treasurer',
        name: 'Bob Williams',
        createdDate: new Date(),
        createdUser: 'admin',
      };

      const createdDirector: Director = {
        ...newDirector,
        directorId: 3,
      };

      service.create(newDirector).subscribe((result) => {
        expect(result).toEqual(createdDirector);
        done();
      });

      const postReq = httpMock.expectOne(
        (req) => req.method === 'POST' && req.url === Constants.GET_DIRECTOR_URL
      );
      expect(postReq.request.body).toEqual(newDirector);
      postReq.flush(createdDirector);

      // fetchDirectors triggered by tap — flush all resulting GET requests
      httpMock.match(Constants.GET_DIRECTOR_URL).forEach(req => req.flush([...mockDirectors, createdDirector]));
    });
  });

  describe('update', () => {
    it('should update an existing director', (done) => {
      const updatedDirector: Director = {
        directorId: 1,
        companyId: 1,
        personId: 101,
        seq: 1,
        title: 'Updated President',
        name: 'John Smith',
        createdDate: new Date('2024-01-01'),
        createdUser: 'admin',
      };

      service.update(updatedDirector).subscribe((result) => {
        expect(result).toEqual(updatedDirector);
        done();
      });

      const putReq = httpMock.expectOne(`${Constants.GET_DIRECTOR_URL}/1`);
      expect(putReq.request.method).toBe('PUT');
      expect(putReq.request.body).toEqual(updatedDirector);
      putReq.flush(updatedDirector);

      // fetchDirectors triggered by tap — flush all resulting GET requests
      httpMock.match(Constants.GET_DIRECTOR_URL).forEach(req => req.flush(mockDirectors));
    });

    it('should handle update errors', (done) => {
      spyOn(console, 'error');
      const updatedDirector: Director = {
        directorId: 1,
        companyId: 1,
        personId: 101,
        seq: 1,
        title: 'Updated President',
        name: 'John Smith',
        createdDate: new Date('2024-01-01'),
        createdUser: 'admin',
      };

      // catchError in update() returns a default value on error (does not re-throw)
      service.update(updatedDirector).subscribe({
        next: (result) => {
          expect(result).toBeUndefined();
          done();
        },
        error: () => fail('catchError should have handled the error'),
      });

      const req = httpMock.expectOne(`${Constants.GET_DIRECTOR_URL}/1`);
      expect(req.request.method).toBe('PUT');
      req.error(new ProgressEvent('error'));
    });
  });
});
