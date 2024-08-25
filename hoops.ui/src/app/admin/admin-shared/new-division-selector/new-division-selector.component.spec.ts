import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDivisionSelectorComponent } from './new-division-selector.component';

describe('NewDivisionSelectorComponent', () => {
  let component: NewDivisionSelectorComponent;
  let fixture: ComponentFixture<NewDivisionSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDivisionSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewDivisionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
