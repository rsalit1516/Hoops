import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGamesShellComponent } from './admin-games-shell.component';

describe('AdminGamesShellComponent', () => {
  let component: AdminGamesShellComponent;
  let fixture: ComponentFixture<AdminGamesShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGamesShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGamesShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
