import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPlayoffScheduleComponent } from './daily-playoff-schedule.component';

describe('DailyPlayoffScheduleComponent', () => {
  let component: DailyPlayoffScheduleComponent;
  let fixture: ComponentFixture<DailyPlayoffScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DailyPlayoffScheduleComponent]
    });
    fixture = TestBed.createComponent(DailyPlayoffScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
