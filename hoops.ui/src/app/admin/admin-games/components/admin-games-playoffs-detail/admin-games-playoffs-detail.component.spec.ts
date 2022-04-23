import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGamesPlayoffsDetailComponent } from './admin-games-playoffs-detail.component';

describe('AdminGamesPlayoffsDetailComponent', () => {
  let component: AdminGamesPlayoffsDetailComponent;
  let fixture: ComponentFixture<AdminGamesPlayoffsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminGamesPlayoffsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGamesPlayoffsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
