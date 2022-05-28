import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorListingComponent } from './sponsor-listing.component';

describe('SponsorListingComponent', () => {
  let component: SponsorListingComponent;
  let fixture: ComponentFixture<SponsorListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponsorListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
