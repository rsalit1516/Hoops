import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSeasonShellComponent } from './admin-season-shell.component';

describe('AdminSeasonShellComponent', () => {
  let component: AdminSeasonShellComponent;
  let fixture: ComponentFixture<AdminSeasonShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSeasonShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSeasonShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
