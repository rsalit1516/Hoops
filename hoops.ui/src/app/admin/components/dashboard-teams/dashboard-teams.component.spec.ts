import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTeamsComponent } from './dashboard-teams.component';

describe('DashboardTeamsComponent', () => {
  let component: DashboardTeamsComponent;
  let fixture: ComponentFixture<DashboardTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTeamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
