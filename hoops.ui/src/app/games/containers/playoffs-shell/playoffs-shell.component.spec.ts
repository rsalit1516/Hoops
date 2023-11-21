import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayoffsShellComponent } from './playoffs-shell.component';

describe('PlayoffsShellComponent', () => {
  let component: PlayoffsShellComponent;
  let fixture: ComponentFixture<PlayoffsShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayoffsShellComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayoffsShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
