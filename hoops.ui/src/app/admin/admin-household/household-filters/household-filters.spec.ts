import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HouseholdFilters } from './household-filters';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HouseholdFilters', () => {
  let component: HouseholdFilters;
  let fixture: ComponentFixture<HouseholdFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseholdFilters, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HouseholdFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with letter A', () => {
    expect(component.selectedLetter()).toBe('A');
  });

  it('should emit filters on letter change', (done) => {
    component.filterChange.subscribe((filters) => {
      expect(filters.letter).toBe('B');
      done();
    });

    component.selectedLetter.set('B');
    fixture.detectChanges();
  });

  it('should clear filters', () => {
    component.filterForm.patchValue({
      searchText: 'test',
      email: 'test@test.com',
      phone: '123-456-7890',
    });
    component.selectedLetter.set('Z');

    component.clearFilters();

    expect(component.filterForm.value.searchText).toBe('');
    expect(component.filterForm.value.email).toBe('');
    expect(component.filterForm.value.phone).toBe('');
    expect(component.selectedLetter()).toBe('A');
  });
});
