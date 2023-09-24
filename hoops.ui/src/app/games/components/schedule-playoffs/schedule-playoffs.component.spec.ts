import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePlayoffsComponent } from './schedule-playoffs.component';

describe('SchedulePlayoffsComponent', () => {
  let component: SchedulePlayoffsComponent;
  let fixture: ComponentFixture<SchedulePlayoffsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SchedulePlayoffsComponent]
    });
    fixture = TestBed.createComponent(SchedulePlayoffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
