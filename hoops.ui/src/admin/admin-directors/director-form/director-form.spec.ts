import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { DirectorForm } from './director-form';
import { DirectorService } from '@app/services/director.service';
import { LoggerService } from '@app/services/logger.service';
import { Director } from '@app/domain/director';

describe('DirectorForm', () => {
  let component: DirectorForm;
  let fixture: ComponentFixture<DirectorForm>;
  let directorServiceSpy: jasmine.SpyObj<DirectorService>;

  const mockVolunteers: Director[] = [
    {
      directorId: 0,
      companyId: 1,
      personId: 10,
      seq: 1,
      title: '',
      name: 'Alice Smith',
      createdDate: new Date(),
      createdUser: 'admin',
    },
    {
      directorId: 0,
      companyId: 1,
      personId: 11,
      seq: 2,
      title: '',
      name: 'Bob Jones',
      createdDate: new Date(),
      createdUser: 'admin',
    },
  ];

  beforeEach(async () => {
    directorServiceSpy = jasmine.createSpyObj('DirectorService', [
      'getDirectorVolunteers',
    ]);
    directorServiceSpy.getDirectorVolunteers.and.returnValue(of(mockVolunteers));

    const loggerSpy = jasmine.createSpyObj('LoggerService', [
      'debug',
      'info',
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [DirectorForm, NoopAnimationsModule],
      providers: [
        { provide: DirectorService, useValue: directorServiceSpy },
        { provide: LoggerService, useValue: loggerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectorForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load volunteers on init', () => {
    expect(directorServiceSpy.getDirectorVolunteers).toHaveBeenCalled();
    expect(component.volunteers()).toEqual(mockVolunteers);
  });

  it('should initialise form with default values', () => {
    expect(component.form.get('directorId')?.value).toBe(0);
    expect(component.form.get('companyId')?.value).toBe(1);
    expect(component.form.get('title')?.value).toBe('');
  });

  it('should patch form when director input is provided', () => {
    const director: Director = {
      directorId: 5,
      companyId: 1,
      personId: 10,
      seq: 2,
      title: 'President',
      name: 'Alice Smith',
      createdDate: new Date(),
      createdUser: 'admin',
    };

    component.director = director;
    component.ngOnChanges({ director: { currentValue: director, previousValue: null, firstChange: true, isFirstChange: () => true } });

    expect(component.form.get('directorId')?.value).toBe(5);
    expect(component.form.get('title')?.value).toBe('President');
  });

  it('should populate name and personId when a volunteer is selected', () => {
    component.onVolunteerSelected(10);

    expect(component.form.get('personId')?.value).toBe(10);
    expect(component.form.get('name')?.value).toBe('Alice Smith');
  });

  it('should not change form when an unknown personId is selected', () => {
    const initialName = component.form.get('name')?.value;
    component.onVolunteerSelected(999);
    expect(component.form.get('name')?.value).toBe(initialName);
  });
});
