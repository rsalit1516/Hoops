import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { FilterCard } from './filter-card';

describe('FilterCard', () => {
  let component: FilterCard;
  let fixture: ComponentFixture<FilterCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterCard, NoopAnimationsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(FilterCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the clear button when hasActiveFilters is false', fakeAsync(() => {
    fixture.componentRef.setInput('hasActiveFilters', false);
    tick();
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(btn.disabled).toBeTrue();
  }));

  it('should enable the clear button when hasActiveFilters is true', fakeAsync(() => {
    fixture.componentRef.setInput('hasActiveFilters', true);
    tick();
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(btn.disabled).toBeFalse();
  }));

  it('should render the clearLabel text', fakeAsync(() => {
    fixture.componentRef.setInput('clearLabel', 'Reset');
    tick();
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(btn.textContent.trim()).toBe('Reset');
  }));

  it('should emit clearClicked when button is clicked', fakeAsync(() => {
    fixture.componentRef.setInput('hasActiveFilters', true);
    tick();
    fixture.detectChanges();
    spyOn(component.clearClicked, 'emit');
    fixture.debugElement.query(By.css('button')).nativeElement.click();
    expect(component.clearClicked.emit).toHaveBeenCalled();
  }));

  // Content projection requires a host component
  describe('content projection', () => {
    @Component({
      template: `
        <csbc-filter-card>
          <span class="projected">content</span>
        </csbc-filter-card>
      `,
      imports: [FilterCard],
    })
    class TestHost {}

    it('should project content into the filter row', async () => {
      const hostFixture = TestBed.createComponent(TestHost);
      hostFixture.detectChanges();
      await hostFixture.whenStable();
      const projected = hostFixture.debugElement.query(By.css('.projected'));
      expect(projected).toBeTruthy();
    });
  });
});
