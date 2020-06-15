import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesShellComponent } from './games-shell.component';

describe('GamesShellComponent', () => {
  let component: GamesShellComponent;
  let fixture: ComponentFixture<GamesShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamesShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
