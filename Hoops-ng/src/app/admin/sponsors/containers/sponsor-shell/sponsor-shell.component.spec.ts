import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorShellComponent } from './sponsor-shell.component';

describe('SponsorShellComponent', () => {
  let component: SponsorShellComponent;
  let fixture: ComponentFixture<SponsorShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsorShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
