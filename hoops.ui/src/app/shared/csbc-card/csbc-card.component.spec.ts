import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsbcCardComponent } from './csbc-card.component';

describe('CsbcCardComponent', () => {
  let component: CsbcCardComponent;
  let fixture: ComponentFixture<CsbcCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsbcCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsbcCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
