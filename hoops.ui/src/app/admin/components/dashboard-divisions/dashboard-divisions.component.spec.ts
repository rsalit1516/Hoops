import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDivisionsComponent } from './dashboard-divisions.component';

describe('DashboardDivisionsComponent', () => {
  let component: DashboardDivisionsComponent;
  let fixture: ComponentFixture<DashboardDivisionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDivisionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardDivisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
