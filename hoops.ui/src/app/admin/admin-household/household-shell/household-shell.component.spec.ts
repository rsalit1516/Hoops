import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdShellComponent } from './household-shell.component';

describe('HouseholdShellComponent', () => {
  let component: HouseholdShellComponent;
  let fixture: ComponentFixture<HouseholdShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseholdShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
