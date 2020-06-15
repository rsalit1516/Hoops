import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesTopMenuComponent } from './games-top-menu.component';

describe('GamesTopMenuComponent', () => {
  let component: GamesTopMenuComponent;
  let fixture: ComponentFixture<GamesTopMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamesTopMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesTopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
