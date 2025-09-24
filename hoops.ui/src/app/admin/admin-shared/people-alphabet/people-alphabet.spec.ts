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
      imports: [PeopleAlphabet],
      providers: [
        {
          provide: PeopleService,
          useValue: {
            updateCriteria: jasmine.createSpy('updateCriteria'),
            clearCriteria: jasmine.createSpy('clearCriteria'),
            updateSelectedCriteria: jasmine.createSpy('updateSelectedCriteria'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleAlphabet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should highlight selected letter', () => {
    component.selectLetter('B');
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const bButton = buttons.find(
      (btn) => btn.nativeElement.textContent.trim() === 'B'
    );
    expect(bButton?.nativeElement.classList.contains('bg-blue-500')).toBe(true);
    expect(bButton?.nativeElement.classList.contains('text-white')).toBe(true);
  });

  it('should default to A on clear', () => {
    component.selectLetter('C');
    component.clearSelection();
    fixture.detectChanges();
    expect(component.selectedLetter()).toBe('A'); // Call the signal function
  });

  it('should update criteria in PeopleService when letter is selected', () => {
    const service = TestBed.inject(PeopleService);
    component.selectLetter('D');
    expect(service.updateSelectedCriteria).toHaveBeenCalledWith(
      jasmine.objectContaining({ lastName: 'D' })
    );
  });
});
