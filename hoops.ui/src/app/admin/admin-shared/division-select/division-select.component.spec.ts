import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminState } from '@app/admin/state/admin.reducer';
import { Store } from '@ngrx/store';
import { DivisionSelectComponent } from './division-select.component';

describe('DivisionSelectComponent', () => {
  let component: DivisionSelectComponent;
  let fixture: ComponentFixture<DivisionSelectComponent>;
  let store: Store<AdminState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivisionSelectComponent ],
      providers: [
        {
          provide: Store
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
