import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdMembersComponent } from './household-members.component';

describe('HouseholdMembersComponent', () => {
  let component: HouseholdMembersComponent;
  let fixture: ComponentFixture<HouseholdMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseholdMembersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
