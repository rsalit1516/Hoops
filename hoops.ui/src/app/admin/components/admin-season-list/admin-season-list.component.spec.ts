import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSeasonListComponent } from './admin-season-list.component';

describe('AdminSeasonListComponent', () => {
  let component: AdminSeasonListComponent;
  let fixture: ComponentFixture<AdminSeasonListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSeasonListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSeasonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
