import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DivisionTemplateSetup, SetupRow, DIVISION_TEMPLATES } from './division-template-setup';

function makeRows(): SetupRow[] {
  return DIVISION_TEMPLATES.map((t) => ({
    template: t,
    selected: signal(true),
    teamCount: signal(6),
  }));
}

describe('DivisionTemplateSetup', () => {
  let component: DivisionTemplateSetup;
  let fixture: ComponentFixture<DivisionTemplateSetup>;
  let rows: SetupRow[];

  beforeEach(async () => {
    rows = makeRows();

    await TestBed.configureTestingModule({
      imports: [DivisionTemplateSetup, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DivisionTemplateSetup);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('rows', rows);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders one row per template (10 rows)', () => {
    const trs = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(trs.length).toBe(10);
  });

  it('shows each division template name', () => {
    const cells = fixture.nativeElement.querySelectorAll('tbody td:nth-child(2)');
    DIVISION_TEMPLATES.forEach((t, i) => {
      expect(cells[i].textContent.trim()).toBe(t.name);
    });
  });

  describe('setTeamCount()', () => {
    it('sets the team count to the parsed integer', () => {
      component.setTeamCount(rows[0], '8');
      expect(rows[0].teamCount()).toBe(8);
    });

    it('clamps non-numeric input to 1', () => {
      component.setTeamCount(rows[0], 'abc');
      expect(rows[0].teamCount()).toBe(1);
    });

    it('clamps zero to 1', () => {
      component.setTeamCount(rows[0], '0');
      expect(rows[0].teamCount()).toBe(1);
    });

    it('clamps negative to 1', () => {
      component.setTeamCount(rows[0], '-3');
      expect(rows[0].teamCount()).toBe(1);
    });
  });

  it('checkbox change updates row.selected', () => {
    rows[0].selected.set(true);
    rows[0].selected.set(false);
    expect(rows[0].selected()).toBeFalse();
  });
});
