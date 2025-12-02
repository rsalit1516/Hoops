import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorForm } from './director-form';

describe('DirectorForm', () => {
  let component: DirectorForm;
  let fixture: ComponentFixture<DirectorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectorForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
