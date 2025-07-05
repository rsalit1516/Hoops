import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleAlphabet } from './people-alphabet';

// alphabet-filter.spec.ts

import { By } from '@angular/platform-browser';
import { PeopleService } from '@app/services/people.service';

describe('PeopleAlphabet', () => {
  let component: PeopleAlphabet;
  let fixture: ComponentFixture<PeopleAlphabet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeopleAlphabet],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleAlphabet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should highlight selected letter', () => {
    component.selectLetter('B');
    fixture.detectChanges();
    const active = fixture.debugElement.query(By.css('.active'));
    expect(active.nativeElement.textContent).toBe('B');
  });

  it('should default to A on clear', () => {
    component.selectLetter('C');
    component.clearSelection();
    fixture.detectChanges();
    expect(component.selectedLetter).toBe('A');
  });

  it('should update criteria in PeopleService when letter is selected', () => {
    const service = TestBed.inject(PeopleService);
    spyOn(service, 'updateSelectedCriteria');
    component.selectLetter('D');
    expect(service.updateSelectedCriteria).toHaveBeenCalledWith(jasmine.objectContaining({ lastName: 'D' }));
  });

  // it('should emit filter event when a letter is selected', () => {
  //   spyOn(component.letterSelected, 'emit');
  //   component.selectLetter('D');
  //   expect(component.letterSelected.emit).toHaveBeenCalledWith('D');
  // });
});

describe('PeopleAlphabetComponent', () => {
  let component: PeopleAlphabet;
  let fixture: ComponentFixture<PeopleAlphabet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleAlphabet]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PeopleAlphabet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
