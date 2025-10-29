import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorFormComponent } from './director-form.component';

describe('DirectorFormComponent', () => {
  let component: DirectorFormComponent;
  let fixture: ComponentFixture<DirectorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
