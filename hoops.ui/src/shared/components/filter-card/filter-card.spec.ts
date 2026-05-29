import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { FilterCard } from './filter-card';

@Component({
  template: `
    <csbc-filter-card
      [hasActiveFilters]="active"
      [clearLabel]="label"
      (clearClicked)="onClear()"
    >
      <span class="projected">content</span>
    </csbc-filter-card>
  `,
  imports: [FilterCard],
})
class TestHost {
  active = false;
  label = 'Clear Filters';
  cleared = false;
  onClear() {
    this.cleared = true;
  }
}

describe('FilterCard', () => {
  let host: TestHost;
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost, NoopAnimationsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should project content into the filter row', () => {
    const projected = fixture.debugElement.query(By.css('.projected'));
    expect(projected).toBeTruthy();
  });

  it('should disable the clear button when hasActiveFilters is false', () => {
    host.active = false;
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(btn.disabled).toBeTrue();
  });

  it('should enable the clear button when hasActiveFilters is true', () => {
    host.active = true;
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(btn.disabled).toBeFalse();
  });

  it('should render the clearLabel text', () => {
    host.label = 'Reset';
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(btn.textContent.trim()).toBe('Reset');
  });

  it('should emit clearClicked when button is clicked', () => {
    host.active = true;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('button')).nativeElement.click();
    expect(host.cleared).toBeTrue();
  });
});
