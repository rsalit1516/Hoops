import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationPaymentsComponent } from './registration-payments.component';

describe('RegistrationPaymentsComponent', () => {
  let component: RegistrationPaymentsComponent;
  let fixture: ComponentFixture<RegistrationPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
