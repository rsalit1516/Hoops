import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { DirectorDetail } from './director-detail';
import { DirectorService } from '@app/services/director.service';

describe('DirectorDetail', () => {
  let component: DirectorDetail;
  let fixture: ComponentFixture<DirectorDetail>;
  let mockDirectorService: any;

  beforeEach(async () => {
    mockDirectorService = {
      directorsSignal: signal(null),
      // DirectorForm calls getDirectorVolunteers() on ngOnInit
      getDirectorVolunteers: jasmine.createSpy('getDirectorVolunteers').and.returnValue(of([])),
      update: jasmine.createSpy('update').and.returnValue(of({})),
      create: jasmine.createSpy('create').and.returnValue(of({})),
      delete: jasmine.createSpy('delete').and.returnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [DirectorDetail, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: DirectorService, useValue: mockDirectorService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectorDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to a new director when no item is resolved', () => {
    const director = component.director();
    expect(director.directorId).toBe(0);
    expect(director.name).toBe('');
  });

  it('should load volunteers for the embedded form', () => {
    expect(mockDirectorService.getDirectorVolunteers).toHaveBeenCalled();
  });
});
