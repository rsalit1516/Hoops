import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeopleFilters } from './people-filters';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PeopleFilters', () => {
  let component: PeopleFilters;
  let fixture: ComponentFixture<PeopleFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleFilters, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleFilters);
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
      expect(filters.lastName).toBe('B');
      done();
    });

    component.selectedLetter.set('B');
  });

  it('should clear filters', () => {
    component.filterForm.patchValue({
      firstName: 'John',
      playerOnly: true,
    });
    component.selectedLetter.set('Z');

    component.clearFilters();

    expect(component.filterForm.value.firstName).toBe('');
    expect(component.filterForm.value.playerOnly).toBe(false);
    expect(component.selectedLetter()).toBe('A');
  });
});
