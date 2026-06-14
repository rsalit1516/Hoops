import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { ColorDetail } from './color-detail';
import { ColorService } from '../../admin-shared/services/color.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { Color } from '@app/domain/color';

const makeColor = (id: number, name: string, discontinued = false): Color =>
  Object.assign(new Color(), { colorId: id, colorName: name, discontinued });

describe('ColorDetail', () => {
  let fixture: ComponentFixture<ColorDetail>;
  let component: ColorDetail;
  let colorServiceSpy: jasmine.SpyObj<ColorService> & {
    selectedColor: ReturnType<typeof signal<Color | null>>;
    adminColors: ReturnType<typeof signal<Color[]>>;
  };
  let notifySpy: jasmine.SpyObj<NotificationService>;

  const selectedColorSignal = signal<Color | null>(null);

  beforeEach(async () => {
    const colorSpy = jasmine.createSpyObj('ColorService', [
      'saveColor',
      'setSelectedColor',
      'fetchAdminColors',
    ]) as any;
    colorSpy.selectedColor = selectedColorSignal;
    colorSpy.adminColors = signal<Color[]>([]);

    const notifySpyObj = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ColorDetail, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ColorService, useValue: colorSpy },
        { provide: NotificationService, useValue: notifySpyObj },
      ],
    }).compileComponents();

    colorServiceSpy = TestBed.inject(ColorService) as any;
    notifySpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    fixture = TestBed.createComponent(ColorDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    selectedColorSignal.set(null);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('new color (colorId = 0)', () => {
    beforeEach(() => {
      selectedColorSignal.set(makeColor(0, ''));
      fixture.detectChanges();
    });

    it('should disable Save when colorName is empty', () => {
      expect(component.isSaveEnabled()).toBe(false);
    });

    it('should enable Save when colorName is provided', () => {
      component.colorForm.colorName().value.set('Teal');
      expect(component.isSaveEnabled()).toBe(true);
    });

    it('should not show Delete button', () => {
      expect(component.isExistingColor()).toBe(false);
    });

    it('should call saveColor and show success notification on save', () => {
      const saved = makeColor(5, 'Teal');
      colorServiceSpy.saveColor.and.returnValue(of(saved));
      component.colorForm.colorName().value.set('Teal');
      component.save();
      expect(colorServiceSpy.saveColor).toHaveBeenCalled();
      expect(notifySpy.success).toHaveBeenCalledWith('Color saved');
    });
  });

  describe('existing color', () => {
    const existing = makeColor(3, 'Green');

    beforeEach(() => {
      selectedColorSignal.set(existing);
      fixture.detectChanges();
    });

    it('should populate form with existing color name', () => {
      expect(component.colorForm.colorName().value()).toBe('Green');
    });

    it('should disable Save when no changes made', () => {
      expect(component.isSaveEnabled()).toBe(false);
    });

    it('should enable Save when colorName changes', () => {
      component.colorForm.colorName().value.set('Dark Green');
      expect(component.isSaveEnabled()).toBe(true);
    });

    it('should enable Save when discontinued changes', () => {
      component.onDiscontinuedChange(true);
      expect(component.isSaveEnabled()).toBe(true);
    });

    it('should show Delete button for existing colors', () => {
      expect(component.isExistingColor()).toBe(true);
    });

    it('should call saveColor with discontinued=true when discontinue() is called', () => {
      const saved = makeColor(3, 'Green', true);
      colorServiceSpy.saveColor.and.returnValue(of(saved));
      component.discontinue();
      const arg: Color = colorServiceSpy.saveColor.calls.mostRecent().args[0];
      expect(arg.discontinued).toBe(true);
      expect(arg.colorId).toBe(3);
    });

    it('should show success notification and clear selection after discontinue', () => {
      colorServiceSpy.saveColor.and.returnValue(of(makeColor(3, 'Green', true)));
      component.discontinue();
      expect(notifySpy.success).toHaveBeenCalledWith('Color discontinued');
      expect(colorServiceSpy.setSelectedColor).toHaveBeenCalledWith(null);
    });

    it('should restore original values on cancel', () => {
      component.colorForm.colorName().value.set('Changed Name');
      component.cancel();
      expect(component.colorForm.colorName().value()).toBe('Green');
    });
  });
});
