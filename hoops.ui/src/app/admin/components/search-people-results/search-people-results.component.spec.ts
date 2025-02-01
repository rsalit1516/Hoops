import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPeopleResultsComponent } from './search-people-results.component';

describe('SearchPeopleResultsComponent', () => {
  let component: SearchPeopleResultsComponent;
  let fixture: ComponentFixture<SearchPeopleResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPeopleResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPeopleResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
