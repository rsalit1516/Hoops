import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonsToolbarComponent } from './seasons-toolbar.component';

describe('AdminSeasonsToolbarComponent', () => {
  let component: SeasonsToolbarComponent;
  let fixture: ComponentFixture<SeasonsToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonsToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeasonsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
