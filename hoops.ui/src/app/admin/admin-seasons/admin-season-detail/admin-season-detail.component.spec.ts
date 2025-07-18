import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSeasonDetailComponent } from './admin-season-detail.component';

describe('AdminSeasonDetailComponent', () => {
  let component: AdminSeasonDetailComponent;
  let fixture: ComponentFixture<AdminSeasonDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSeasonDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSeasonDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
