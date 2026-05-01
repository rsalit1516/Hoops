import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SponsorFilters, SponsorFilterCriteria } from './sponsor-filters';

describe('SponsorFilters', () => {
  let component: SponsorFilters;
  let fixture: ComponentFixture<SponsorFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SponsorFilters, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SponsorFilters);
    component = fixture.componentInstance;
  });

  // ── Creation ──────────────────────────────────────────────────────────────

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // ── Initial emission ──────────────────────────────────────────────────────

  it('should emit initial filter values synchronously on init', () => {
    const emitted: SponsorFilterCriteria[] = [];
    component.filterChange.subscribe((f) => emitted.push(f));

    fixture.detectChanges(); // triggers ngOnInit → emitFilters()

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({ name: '', currentSeasonOnly: false });
  });

  it('should emit initial values reflecting the filters input', () => {
    component.filters = { name: 'Acme', currentSeasonOnly: true };
    const emitted: SponsorFilterCriteria[] = [];
    component.filterChange.subscribe((f) => emitted.push(f));

    fixture.detectChanges();

    expect(emitted[0]).toEqual({ name: 'Acme', currentSeasonOnly: true });
  });

  // ── Debounce ──────────────────────────────────────────────────────────────

  it('should not emit for form changes before 300 ms', fakeAsync(() => {
    // Component created inside fakeAsync so the debounce timer registers in this zone
    const localFixture = TestBed.createComponent(SponsorFilters);
    const localComponent = localFixture.componentInstance;

    const emitted: SponsorFilterCriteria[] = [];
    localComponent.filterChange.subscribe((f) => emitted.push(f));

    localFixture.detectChanges(); // initial synchronous emission → emitted.length === 1

    localComponent.filterForm.patchValue({ name: 'Sunrise' });
    localFixture.detectChanges();
    tick(299);

    expect(emitted.length).toBe(1); // no second emission yet
  }));

  it('should emit after 300 ms debounce when form value changes', fakeAsync(() => {
    const localFixture = TestBed.createComponent(SponsorFilters);
    const localComponent = localFixture.componentInstance;

    const emitted: SponsorFilterCriteria[] = [];
    localComponent.filterChange.subscribe((f) => emitted.push(f));

    localFixture.detectChanges(); // initial emission

    localComponent.filterForm.patchValue({ name: 'Sunrise' });
    localFixture.detectChanges();
    tick(300);

    expect(emitted.length).toBe(2);
    expect(emitted[1]).toEqual({ name: 'Sunrise', currentSeasonOnly: false });
  }));

  it('should emit only once when multiple rapid changes occur within 300 ms', fakeAsync(() => {
    const localFixture = TestBed.createComponent(SponsorFilters);
    const localComponent = localFixture.componentInstance;

    const emitted: SponsorFilterCriteria[] = [];
    localComponent.filterChange.subscribe((f) => emitted.push(f));

    localFixture.detectChanges(); // initial emission

    localComponent.filterForm.patchValue({ name: 'S' });
    tick(100);
    localComponent.filterForm.patchValue({ name: 'Su' });
    tick(100);
    localComponent.filterForm.patchValue({ name: 'Sun' });
    tick(300);

    expect(emitted.length).toBe(2); // init + one debounced emission
    expect(emitted[1].name).toBe('Sun');
  }));

  // ── clearFilters ──────────────────────────────────────────────────────────

  it('should reset name and currentSeasonOnly when clearFilters() is called', () => {
    fixture.detectChanges();
    component.filterForm.patchValue({ name: 'Gold', currentSeasonOnly: true });

    component.clearFilters();

    expect(component.filterForm.value.name).toBe('');
    expect(component.filterForm.value.currentSeasonOnly).toBe(false);
  });

  // ── hasActiveFilters ──────────────────────────────────────────────────────

  it('should return false for hasActiveFilters when form is empty', () => {
    fixture.detectChanges();
    expect(component.hasActiveFilters).toBeFalse();
  });

  it('should return true for hasActiveFilters when name is non-empty', () => {
    fixture.detectChanges();
    component.filterForm.patchValue({ name: 'Pizza' });
    expect(component.hasActiveFilters).toBeTrue();
  });

  it('should return true for hasActiveFilters when currentSeasonOnly is true', () => {
    fixture.detectChanges();
    component.filterForm.patchValue({ currentSeasonOnly: true });
    expect(component.hasActiveFilters).toBeTrue();
  });

  it('should return false for hasActiveFilters after clearFilters()', () => {
    fixture.detectChanges();
    component.filterForm.patchValue({ name: 'Gold', currentSeasonOnly: true });
    component.clearFilters();
    expect(component.hasActiveFilters).toBeFalse();
  });

  // ── ngOnChanges ───────────────────────────────────────────────────────────

  it('should patch the form when filters input changes after first render', () => {
    fixture.detectChanges(); // first change handled by ngOnInit

    component.filters = { name: 'Updated', currentSeasonOnly: true };
    component.ngOnChanges({
      filters: {
        currentValue: component.filters,
        previousValue: { name: '', currentSeasonOnly: false },
        firstChange: false,
        isFirstChange: () => false,
      },
    });

    expect(component.filterForm.value.name).toBe('Updated');
    expect(component.filterForm.value.currentSeasonOnly).toBe(true);
  });

  it('should not patch the form on the first ngOnChanges (ngOnInit handles first patch)', () => {
    component.filters = { name: 'ShouldNotApply', currentSeasonOnly: false };
    component.ngOnChanges({
      filters: {
        currentValue: component.filters,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.filterForm.value.name).toBe('');
  });
});
