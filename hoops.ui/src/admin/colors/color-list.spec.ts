import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ColorList } from './color-list';
import { ColorService } from '../admin-shared/services/color.service';
import { Color } from '@app/domain/color';

const makeColor = (id: number, name: string, discontinued = false): Color =>
  Object.assign(new Color(), { colorId: id, colorName: name, discontinued });

describe('ColorList', () => {
  let fixture: ComponentFixture<ColorList>;
  let component: ColorList;
  let colorServiceSpy: jasmine.SpyObj<ColorService> & {
    adminColors: jasmine.Spy;
    selectedColor: jasmine.Spy;
  };

  const activeColor = makeColor(1, 'Red');
  const discontinuedColor = makeColor(2, 'Blue', true);
  const adminColorsSignal = signal<Color[]>([activeColor, discontinuedColor]);

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ColorService', [
      'fetchAdminColors',
      'setSelectedColor',
    ]) as any;
    spy.adminColors = adminColorsSignal;
    spy.selectedColor = signal<Color | null>(null);

    await TestBed.configureTestingModule({
      imports: [ColorList, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ColorService, useValue: spy },
      ],
    }).compileComponents();

    colorServiceSpy = TestBed.inject(ColorService) as any;
    fixture = TestBed.createComponent(ColorList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchAdminColors on init', () => {
    expect(colorServiceSpy.fetchAdminColors).toHaveBeenCalledOnceWith();
  });

  it('should show only active colors by default', () => {
    expect(component.filteredColors()).toEqual([activeColor]);
  });

  it('should show all colors when showDiscontinued is true', () => {
    component.showDiscontinued.set(true);
    expect(component.filteredColors()).toEqual([activeColor, discontinuedColor]);
  });

  it('should call setSelectedColor when a row is clicked', () => {
    component.onSelect(activeColor);
    expect(colorServiceSpy.setSelectedColor).toHaveBeenCalledWith(activeColor);
  });

  it('should call setSelectedColor with a new Color(colorId=0) when addNew is called', () => {
    component.addNew();
    const arg = colorServiceSpy.setSelectedColor.calls.mostRecent().args[0] as Color;
    expect(arg.colorId).toBe(0);
    expect(arg.colorName).toBe('');
    expect(arg.discontinued).toBe(false);
  });
});
