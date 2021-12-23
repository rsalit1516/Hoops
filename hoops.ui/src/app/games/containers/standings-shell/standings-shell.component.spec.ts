import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandingsShellComponent } from './standings-shell.component';

describe('StandingsShellComponent', () => {
  let component: StandingsShellComponent;
  let fixture: ComponentFixture<StandingsShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandingsShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandingsShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
