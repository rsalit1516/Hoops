import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTypeSelectComponent } from './game-type-select.component';

describe('GameTypeSelectComponent', () => {
  let component: GameTypeSelectComponent;
  let fixture: ComponentFixture<GameTypeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameTypeSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameTypeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
