import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminShellSidebarComponent } from './admin-shell-sidebar.component';

describe('AdminShellSidebarComponent', () => {
  let component: AdminShellSidebarComponent;
  let fixture: ComponentFixture<AdminShellSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminShellSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminShellSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
