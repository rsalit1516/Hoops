import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPeopleShellComponent } from './admin-people-shell';

describe('AdminPeopleShellComponent', () => {
  let component: AdminPeopleShellComponent;
  let fixture: ComponentFixture<AdminPeopleShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPeopleShellComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminPeopleShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
