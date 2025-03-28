import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionToolbarComponent } from './division-toolbar.component';

describe('DivisionToolbarComponent', () => {
  let component: DivisionToolbarComponent;
  let fixture: ComponentFixture<DivisionToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DivisionToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivisionToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
