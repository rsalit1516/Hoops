// alphabet-filter.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeopleAlphabet } from './people-alphabet';
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

});
