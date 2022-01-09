import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorCarouselComponent } from './sponsor-carousel.component';

describe('SponsorCarouselComponent', () => {
  let component: SponsorCarouselComponent;
  let fixture: ComponentFixture<SponsorCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponsorCarouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
