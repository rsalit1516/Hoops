import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGamesFilterComponent } from './admin-games-filter.component';

describe('AdminGamesFilterComponent', () => {
  let component: AdminGamesFilterComponent;
  let fixture: ComponentFixture<AdminGamesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGamesFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminGamesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
