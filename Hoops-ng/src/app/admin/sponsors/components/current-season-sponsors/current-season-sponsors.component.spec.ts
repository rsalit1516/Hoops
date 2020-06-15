import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentSeasonSponsorsComponent } from './current-season-sponsors.component';

describe('CurrentSeasonSponsorsComponent', () => {
  let component: CurrentSeasonSponsorsComponent;
  let fixture: ComponentFixture<CurrentSeasonSponsorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentSeasonSponsorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentSeasonSponsorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
