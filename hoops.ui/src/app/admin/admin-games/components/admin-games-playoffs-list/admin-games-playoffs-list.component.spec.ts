import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGamesPlayoffsListComponent } from './admin-games-playoffs-list.component';

describe('AdminGamesPlayoffsListComponent', () => {
  let component: AdminGamesPlayoffsListComponent;
  let fixture: ComponentFixture<AdminGamesPlayoffsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminGamesPlayoffsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGamesPlayoffsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});