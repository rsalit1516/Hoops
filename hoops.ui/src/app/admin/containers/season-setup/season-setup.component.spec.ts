import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonSetupComponent } from './season-setup.component';

describe('SeasonSetupComponent', () => {
  let component: SeasonSetupComponent;
  let fixture: ComponentFixture<SeasonSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
