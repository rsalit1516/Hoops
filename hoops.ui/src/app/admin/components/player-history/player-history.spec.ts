import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerHistory } from './player-history';

describe('PlayerHistory', () => {
  let component: PlayerHistory;
  let fixture: ComponentFixture<PlayerHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
