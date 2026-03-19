import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DirectorDetail } from './director-detail';

describe('DirectorDetail', () => {
  let component: DirectorDetail;
  let fixture: ComponentFixture<DirectorDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorDetail],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectorDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
