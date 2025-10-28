import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { DirectorList } from './director-list';
import { DirectorService } from '@app/services/director.service';
import { Director } from '@app/domain/director';

describe('DirectorList', () => {
  let component: DirectorList;
  let fixture: ComponentFixture<DirectorList>;
  let mockDirectorService: jasmine.SpyObj<DirectorService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockDirectors: Director[] = [
    {
      id: 1,
      companyId: 1,
      peopleId: 101,
      seq: 1,
      title: 'Board President',
      name: 'John Smith',

      createdDate: new Date('2024-01-01'),
      createdUser: 'admin',
    },
    {
      id: 2,
      companyId: 1,
      peopleId: 102,
      seq: 2,
      title: 'Vice President',
      name: 'Alice Johnson',
      createdDate: new Date('2024-01-02'),
      createdUser: 'admin',
    },
    {
      id: 3,
      companyId: 1,
      peopleId: 103,
      seq: 3,
      title: 'Treasurer',
      name: 'Bob Williams',
      createdDate: new Date('2024-01-03'),
      createdUser: 'admin',
    },
  ];

  beforeEach(async () => {
    // Create mock DirectorService with signal
    const directorsSignal = signal<Director[]>(mockDirectors);
    mockDirectorService = jasmine.createSpyObj('DirectorService', [
      'fetchDirectors',
    ]);
    Object.defineProperty(mockDirectorService, 'directorsSignal', {
      get: () => directorsSignal,
    });
    Object.defineProperty(mockDirectorService, 'directors', {
      get: () => mockDirectors,
    });

    // Create mock Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DirectorList, NoopAnimationsModule],
      providers: [
        { provide: DirectorService, useValue: mockDirectorService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectorList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      expect(component.displayedColumns).toEqual(['name', 'title']);
      expect(component.pageSize).toBe(25);
      expect(component.showFirstLastButtons).toBe(true);
    });

    it('should initialize dataSource as MatTableDataSource', () => {
      expect(component.dataSource).toBeDefined();
      expect(component.dataSource.data).toBeDefined();
    });

    it('should call fetchDirectors on init if no directors provided', () => {
      expect(mockDirectorService.fetchDirectors).toHaveBeenCalled();
    });
  });

  describe('Data Loading', () => {
    it('should display directors from service signal', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('John Smith');
      expect(compiled.textContent).toContain('Alice Johnson');
      expect(compiled.textContent).toContain('Bob Williams');
      const newDirectors: Director[] = [
        {
          id: 4,
          companyId: 1,
          peopleId: 104,
          seq: 4,
          title: 'Secretary',
          name: 'Charlie Brown',
          createdDate: new Date('2024-01-04'),
          createdUser: 'admin',
        },
      ];

      component.directors = newDirectors;
      fixture.detectChanges();

      expect(component.dataSource.data).toEqual(newDirectors);
      expect(component.dataSource.data.length).toBe(1);
    });

    it('should handle empty directors list', () => {
      component.directors = [];
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('No directors found');
    });

    it('should call loadDirectors method', () => {
      mockDirectorService.fetchDirectors.calls.reset();
      component.loadDirectors();
      expect(mockDirectorService.fetchDirectors).toHaveBeenCalled();
    });

    it('should reload data when refreshList is called', () => {
      mockDirectorService.fetchDirectors.calls.reset();
      component.refreshList();
      expect(mockDirectorService.fetchDirectors).toHaveBeenCalled();
    });
  });

  describe('Table Display', () => {
    it('should render table with correct columns', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const headers = compiled.querySelectorAll('th');

      expect(headers.length).toBe(2);
      expect(headers[0].textContent?.trim()).toBe('Name');
      expect(headers[1].textContent?.trim()).toBe('Title');
    });

    it('should render correct number of rows', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('tr.mat-mdc-row');

      expect(rows.length).toBe(3); // mockDirectors has 3 items
    });

    // it('should display director names correctly', () => {
    //   const name = component.getDirectorName(mockDirectors[0]);
    //   expect(name).toBe('John Smith');
    // });

    it('should display titles in table cells', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent).toContain('Board President');
      expect(compiled.textContent).toContain('Vice President');
      expect(compiled.textContent).toContain('Treasurer');
    });

    it('should display "N/A" for missing titles', () => {
      const directorWithoutTitle: Director = {
        ...mockDirectors[0],
        title: null as any,
      };
      component.directors = [directorWithoutTitle];
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('N/A');
    });
  });

  describe('Sorting Functionality', () => {
    beforeEach(() => {
      // Ensure AfterViewInit has been called
      fixture.detectChanges();
      component.ngAfterViewInit();
    });

    it('should bind sort to dataSource', () => {
      expect(component.dataSource.sort).toBe(component.sort);
    });

    it('should have default sort configured in template', () => {
      // The default sort is set via template attributes matSortActive and matSortDirection
      const compiled = fixture.nativeElement as HTMLElement;
      const table = compiled.querySelector('table[matSort]');

      expect(table?.getAttribute('matsortactive')).toBe('name');
      expect(table?.getAttribute('matsortdirection')).toBe('asc');
    });

    it('should have custom sortingDataAccessor for name', () => {
      const sortAccessor = component.dataSource.sortingDataAccessor;
      const result = sortAccessor(mockDirectors[0], 'name');

      expect(result).toBe('smith, john');
    });

    it('should sort by name correctly', () => {
      const sortAccessor = component.dataSource.sortingDataAccessor;

      const name1 = sortAccessor(mockDirectors[0], 'name'); // Smith, John
      const name2 = sortAccessor(mockDirectors[1], 'name'); // Johnson, Alice

      expect(name1 > name2).toBe(true); // Smith comes after Johnson
    });

    it('should sort by title correctly', () => {
      const sortAccessor = component.dataSource.sortingDataAccessor;

      const title1 = sortAccessor(mockDirectors[0], 'title'); // Board President
      const title2 = sortAccessor(mockDirectors[2], 'title'); // Treasurer

      expect(title1 < title2).toBe(true); // Board comes before Treasurer
    });

    it('should handle null titles in sorting', () => {
      const directorWithoutTitle: Director = {
        ...mockDirectors[0],
        title: null as any,
      };
      const sortAccessor = component.dataSource.sortingDataAccessor;
      const result = sortAccessor(directorWithoutTitle, 'title');

      expect(result).toBe('');
    });
  });

  describe('Pagination Functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.ngAfterViewInit();
    });

    it('should bind paginator to dataSource', () => {
      expect(component.dataSource.paginator).toBe(component.paginator);
    });

    it('should have correct page size', () => {
      expect(component.pageSize).toBe(25);
    });

    it('should show first/last buttons', () => {
      expect(component.showFirstLastButtons).toBe(true);
    });

    it('should render paginator element', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const paginator = compiled.querySelector('mat-paginator');

      expect(paginator).toBeTruthy();
    });

    it('should have correct paginator configuration', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const paginator = compiled.querySelector('mat-paginator');

      expect(paginator?.getAttribute('aria-label')).toBe(
        'Select page of directors'
      );
    });
  });

  describe('User Interactions', () => {
    it('should call editDirector when row is clicked', () => {
      spyOn(component, 'editDirector');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('tr.mat-mdc-row');
      (rows[0] as HTMLElement).click();

      expect(component.editDirector).toHaveBeenCalled();
    });

    it('should have TODO comment for navigation in editDirector', () => {
      // This test documents that navigation is not yet implemented
      component.editDirector(mockDirectors[0]);
      // Navigation should be implemented in future stories
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should call addDirector when Add button is clicked', () => {
      spyOn(component, 'addDirector');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const addButton = compiled.querySelector(
        'button[color="primary"]'
      ) as HTMLButtonElement;
      addButton.click();

      expect(component.addDirector).toHaveBeenCalled();
    });

    it('should have TODO comment for navigation in addDirector', () => {
      // This test documents that navigation is not yet implemented
      component.addDirector();
      // Navigation should be implemented in future stories
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should apply clickable-row class to table rows', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('tr.mat-mdc-row');

      rows.forEach((row) => {
        expect(row.classList.contains('clickable-row')).toBe(true);
      });
    });
  });

  describe('UI Elements', () => {
    it('should display page title', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('h2');

      expect(title?.textContent).toBe('Directors');
    });

    it('should display Add Director button', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector('button[color="primary"]');

      expect(button?.textContent?.trim()).toBe('Add Director');
    });

    it('should display error message when errorMessage is set', () => {
      component.errorMessage = 'Failed to load directors';
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorDiv = compiled.querySelector('.error-message');

      expect(errorDiv).toBeTruthy();
      expect(errorDiv?.textContent).toContain('Failed to load directors');
    });

    it('should not display error message when errorMessage is undefined', () => {
      component.errorMessage = undefined;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorDiv = compiled.querySelector('.error-message');

      expect(errorDiv).toBeFalsy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA label on paginator', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const paginator = compiled.querySelector('mat-paginator');

      expect(paginator?.getAttribute('aria-label')).toBe(
        'Select page of directors'
      );
    });

    it('should have role alert on error message', () => {
      component.errorMessage = 'Error occurred';
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorDiv = compiled.querySelector('.error-message');

      expect(errorDiv?.getAttribute('role')).toBe('alert');
    });

    it('should have semantic table structure', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('table')).toBeTruthy();
      expect(compiled.querySelector('thead')).toBeTruthy();
      expect(compiled.querySelector('tbody')).toBeTruthy();
    });
  });

  it('should handle null paginator gracefully', () => {
    component.paginator = null as any;
    expect(() => component.ngAfterViewInit()).not.toThrow();
  });

  describe('Integration with DirectorService', () => {
    it('should react to signal changes', () => {
      const newDirectors: Director[] = [
        {
          id: 5,
          companyId: 1,
          peopleId: 105,
          seq: 5,
          title: 'Board Member',
          name: 'Frank Wilson',
          // lastName: 'Wilson',
          // firstName: 'Frank',
          // photo: undefined,
          // phonePref: undefined,
          // emailPref: undefined,
          createdDate: new Date('2024-01-05'),
          createdUser: 'admin',
        },
      ];

      // Update the signal
      const directorsSignal = mockDirectorService.directorsSignal as any;
      directorsSignal.set(newDirectors);
      fixture.detectChanges();

      // The effect should update the dataSource
      expect(component.dataSource.data.length).toBeGreaterThan(0);
    });

    it('should handle empty signal', () => {
      const directorsSignal = mockDirectorService.directorsSignal as any;
      directorsSignal.set([]);
      fixture.detectChanges();

      // Should not throw errors
      expect(component.dataSource).toBeDefined();
    });
  });
});
