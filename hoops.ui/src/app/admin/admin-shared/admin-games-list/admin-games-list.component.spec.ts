import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGamesListComponent } from './admin-games-list.component';

describe('AdminGamesListComponent', () => {
  let component: AdminGamesListComponent;
  let fixture: ComponentFixture<AdminGamesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGamesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGamesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
