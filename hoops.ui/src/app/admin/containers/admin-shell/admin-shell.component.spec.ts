import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminState } from '@app/admin/state/admin.reducer';
import { Store } from '@ngrx/store';
import { AdminShellComponent } from './admin-shell.component';

describe('AdminShellComponent', () => {
  let component: AdminShellComponent;
  let fixture: ComponentFixture<AdminShellComponent>;
  let store: Store<AdminState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminShellComponent ],
      providers: [ Store]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
