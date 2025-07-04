import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleAlphabetComponent } from './people-alphabet.component';

describe('PeopleAlphabetComponent', () => {
  let component: PeopleAlphabetComponent;
  let fixture: ComponentFixture<PeopleAlphabetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleAlphabetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleAlphabetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
