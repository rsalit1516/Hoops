
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsbcDashboardComponent } from './csbc-dashboard.component';

describe('CsbcDashboardComponent', () => {
  let component: CsbcDashboardComponent;
  let fixture: ComponentFixture<CsbcDashboardComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CsbcDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsbcDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
