import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleShellComponent } from './schedule-shell.component';

describe('ScheduleShellComponent', () => {
  let component: ScheduleShellComponent;
  let fixture: ComponentFixture<ScheduleShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
