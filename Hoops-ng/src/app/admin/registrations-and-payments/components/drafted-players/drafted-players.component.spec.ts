import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftedPlayersComponent } from './drafted-players.component';

describe('DraftedPlayersComponent', () => {
  let component: DraftedPlayersComponent;
  let fixture: ComponentFixture<DraftedPlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftedPlayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftedPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
