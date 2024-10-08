import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSeasonsToolbarComponent } from './admin-seasons-toolbar.component';

describe('AdminSeasonsToolbarComponent', () => {
  let component: AdminSeasonsToolbarComponent;
  let fixture: ComponentFixture<AdminSeasonsToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSeasonsToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSeasonsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
