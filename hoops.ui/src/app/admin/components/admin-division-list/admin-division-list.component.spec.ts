import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDivisionListComponent } from './admin-division-list.component';

describe('AdminDivisionListComponent', () => {
  let component: AdminDivisionListComponent;
  let fixture: ComponentFixture<AdminDivisionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDivisionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDivisionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
