import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdSearchComponent } from './household-search.component';

describe('HouseholdSearchComponent', () => {
  let component: HouseholdSearchComponent;
  let fixture: ComponentFixture<HouseholdSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseholdSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
