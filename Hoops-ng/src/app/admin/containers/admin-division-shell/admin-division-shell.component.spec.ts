import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDivisionShellComponent } from './admin-division-shell.component';

describe('AdminDivisionShellComponent', () => {
  let component: AdminDivisionShellComponent;
  let fixture: ComponentFixture<AdminDivisionShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDivisionShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDivisionShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
