import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { AdminSeasonDetail } from './admin-season-detail';

describe('AdminSeasonDetail', () => {
  let component: AdminSeasonDetail;
  let fixture: ComponentFixture<AdminSeasonDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSeasonDetail, HttpClientTestingModule],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSeasonDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
