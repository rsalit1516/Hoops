import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonAddComponent } from './season-add.component';

describe('SeasonAddComponent', () => {
  let component: SeasonAddComponent;
  let fixture: ComponentFixture<SeasonAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeasonAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
