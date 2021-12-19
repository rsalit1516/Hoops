import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContentListComponent } from './admin-content-list.component';

describe('AdminContentListComponent', () => {
  let component: AdminContentListComponent;
  let fixture: ComponentFixture<AdminContentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminContentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminContentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
