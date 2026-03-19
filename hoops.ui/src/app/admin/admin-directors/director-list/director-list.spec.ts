import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DirectorList } from './director-list';

describe('DirectorList', () => {
  let component: DirectorList;
  let fixture: ComponentFixture<DirectorList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorList],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectorList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
