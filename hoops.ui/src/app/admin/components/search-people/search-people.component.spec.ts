import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPeopleComponent } from './search-people.component';

describe('SearchPeopleComponent', () => {
  let component: SearchPeopleComponent;
  let fixture: ComponentFixture<SearchPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPeopleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
