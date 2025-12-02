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
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchDirectors', () => {
    it('should fetch directors and update signal', () => {
      service.fetchDirectors();

      const req = httpMock.expectOne(Constants.GET_DIRECTOR_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockDirectors);

      expect(service.directorsSignal()).toEqual(mockDirectors);
    });

    it('should handle error when fetching directors', () => {
      spyOn(console, 'error');

      service.fetchDirectors();

      const req = httpMock.expectOne(Constants.GET_DIRECTOR_URL);
      req.error(new ProgressEvent('error'));

      expect(console.error).toHaveBeenCalledWith(
        'Failed to load directors',
        jasmine.any(Object)
      );
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

      const req = httpMock.expectOne(Constants.GET_DIRECTOR_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newDirector);
      req.flush(createdDirector);

      // Should also trigger fetchDirectors
      const fetchReq = httpMock.expectOne(Constants.GET_DIRECTOR_URL);
      expect(fetchReq.request.method).toBe('GET');
      fetchReq.flush([...mockDirectors, createdDirector]);
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

      const req = httpMock.expectOne(`${Constants.GET_DIRECTOR_URL}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedDirector);
      req.flush(updatedDirector);

      // Should also trigger fetchDirectors
      const fetchReq = httpMock.expectOne(Constants.GET_DIRECTOR_URL);
      expect(fetchReq.request.method).toBe('GET');
      fetchReq.flush(mockDirectors);
    });

    it('should handle update errors', (done) => {
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

      service.update(updatedDirector).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error).toBeTruthy();
          done();
        }
      );

      const req = httpMock.expectOne(`${Constants.GET_DIRECTOR_URL}/1`);
      req.error(new ProgressEvent('error'));
    });
  });
});
