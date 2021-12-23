import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionSelectComponent } from './division-select.component';

describe('DivisionSelectComponent', () => {
  let component: DivisionSelectComponent;
  let fixture: ComponentFixture<DivisionSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivisionSelectComponent ]
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
