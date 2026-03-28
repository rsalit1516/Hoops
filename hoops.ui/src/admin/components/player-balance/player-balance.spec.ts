import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerBalance } from './player-balance';

describe('PlayerBalance', () => {
  let component: PlayerBalance;
  let fixture: ComponentFixture<PlayerBalance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
  imports: [PlayerBalance]
    })
    .compileComponents();

  fixture = TestBed.createComponent(PlayerBalance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
