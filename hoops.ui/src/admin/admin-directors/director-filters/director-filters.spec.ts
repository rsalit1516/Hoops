import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorFilters } from './director-filters';

describe('DirectorFiltersComponent', () => {
  let component: DirectorFilters;
  let fixture: ComponentFixture<DirectorFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectorFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
