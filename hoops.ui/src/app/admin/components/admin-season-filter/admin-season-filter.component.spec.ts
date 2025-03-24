import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSeasonFilterComponent } from './admin-season-filter.component';

describe('AdminSeasonFilterComponent', () => {
  let component: AdminSeasonFilterComponent;
  let fixture: ComponentFixture<AdminSeasonFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSeasonFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSeasonFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
