import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSeasonDetail } from './admin-season-detail';

describe('AdminSeasonDetailComponent', () => {
  let component: AdminSeasonDetail;
  let fixture: ComponentFixture<AdminSeasonDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSeasonDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSeasonDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
