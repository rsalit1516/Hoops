import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { AdminState } from '@app/admin/state/admin.reducer';
import { AdminTeamDetailComponent } from './admin-team-detail.component';

describe('AdminTeamDetailComponent', () => {
  let component: AdminTeamDetailComponent;
  let fixture: ComponentFixture<AdminTeamDetailComponent>;
  let store: Store<AdminState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminTeamDetailComponent ],
      providers: [
        Store
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTeamDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
