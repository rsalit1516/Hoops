import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonRegistrationsComponent } from './season-registrations.component';

describe('SeasonRegistrationsComponent', () => {
  let component: SeasonRegistrationsComponent;
  let fixture: ComponentFixture<SeasonRegistrationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonRegistrationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
