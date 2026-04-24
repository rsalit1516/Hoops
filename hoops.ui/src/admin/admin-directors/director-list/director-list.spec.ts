import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';

import { DirectorList } from './director-list';
import { DirectorService } from '@app/services/director.service';

describe('DirectorList', () => {
  let component: DirectorList;
  let fixture: ComponentFixture<DirectorList>;
  let mockDirectorService: any;

  beforeEach(async () => {
    mockDirectorService = {
      directorsSignal: signal(null),
    };

    await TestBed.configureTestingModule({
      imports: [DirectorList, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: DirectorService, useValue: mockDirectorService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectorList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show no rows when directorsSignal is null', () => {
    expect(component.filteredDirectors()).toEqual([]);
  });

  it('should map directors to list items', () => {
    mockDirectorService.directorsSignal.set([
      { directorId: 1, name: 'Jane Doe', title: 'President', seq: 1, companyId: 1, personId: 10, createdDate: new Date(), createdUser: 'admin' },
    ]);
    fixture.detectChanges();
    expect(component.filteredDirectors().length).toBe(1);
    expect(component.filteredDirectors()[0].name).toBe('Jane Doe');
  });
});
