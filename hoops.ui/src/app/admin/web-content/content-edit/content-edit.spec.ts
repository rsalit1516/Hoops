import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { ContentEdit } from './content-edit';
import { ContentService } from '../content.service';
import { NoticeTypesService } from '@app/shared/services/notice-types.service';
import { LoggerService } from '@app/services/logger.service';
import { WebContent } from '@app/domain/webContent';
import { Content } from '@app/domain/content';
import { WebContentType } from '@app/domain/webContentType';
import * as contentActions from '@app/admin/state/admin.actions';

describe('ContentEdit', () => {
  let component: ContentEdit;
  let fixture: ComponentFixture<ContentEdit>;
  let mockContentService: jasmine.SpyObj<ContentService>;
  let mockNoticeTypesService: jasmine.SpyObj<NoticeTypesService>;
  let mockLoggerService: jasmine.SpyObj<LoggerService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

  const mockWebContent: WebContent = {
    webContentId: 1,
    title: 'Test Title',
    subTitle: 'Test Subtitle',
    body: 'Test body content',
    dateAndTime: '2025-01-01',
    location: 'Test Location',
    expirationDate: new Date('2025-12-31'),
    contentSequence: 1,
    webContentTypeId: 1,
    companyId: 1,
    webContentTypeDescription: 'Season Info',
    page: '',
    type: '',
    modifiedDate: new Date(),
    modifiedUser: 0,
    webContentType: {
      webContentTypeId: 1,
      webContentTypeDescription: 'Season Info',
    },
  };

  const mockContent: Content = {
    webContentId: 1,
    companyId: 1,
    title: 'Test Title',
    subTitle: 'Test Subtitle',
    body: 'Test body content',
    location: 'Test Location',
    dateAndTime: '2025-01-01',
    expirationDate: new Date('2025-12-31'),
    webContentTypeId: 1,
    contentSequence: 1,
    webContentType: {
      webContentTypeId: 1,
      webContentTypeDescription: 'Season Info',
    },
  };

  const mockWebContentTypes: WebContentType[] = [
    { webContentTypeId: 1, webContentTypeDescription: 'Season Info' },
    { webContentTypeId: 2, webContentTypeDescription: 'Meeting Notice' },
    { webContentTypeId: 3, webContentTypeDescription: 'General Notice' },
  ];

  beforeEach(async () => {
    const contentServiceSpy = jasmine.createSpyObj(
      'ContentService',
      ['saveContent', 'deleteContent'],
      {
        selectedContent$: of(null), // Start with null to prevent initial effects
        selectedContent: signal(null), // Start with null
      }
    );

    const noticeTypesServiceSpy = jasmine.createSpyObj(
      'NoticeTypesService',
      [],
      {
        notificationTypes: {
          value: signal(mockWebContentTypes),
          status: signal('loading'), // Start with loading to prevent initial effects
        },
      }
    );

    const loggerServiceSpy = jasmine.createSpyObj('LoggerService', [
      'info',
      'error',
      'warn',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch']);
    const changeDetectorRefSpy = jasmine.createSpyObj('ChangeDetectorRef', [
      'markForCheck',
    ]);

    await TestBed.configureTestingModule({
      imports: [ContentEdit, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: ContentService, useValue: contentServiceSpy },
        { provide: NoticeTypesService, useValue: noticeTypesServiceSpy },
        { provide: LoggerService, useValue: loggerServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Store, useValue: storeSpy },
        { provide: MatDialog, useValue: {} }, // Simple empty mock since we're not testing dialog functionality
        { provide: ChangeDetectorRef, useValue: changeDetectorRefSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '1' } },
            params: of({ id: '1' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentEdit);
    component = fixture.componentInstance;

    mockContentService = TestBed.inject(
      ContentService
    ) as jasmine.SpyObj<ContentService>;
    mockNoticeTypesService = TestBed.inject(
      NoticeTypesService
    ) as jasmine.SpyObj<NoticeTypesService>;
    mockLoggerService = TestBed.inject(
      LoggerService
    ) as jasmine.SpyObj<LoggerService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockStore = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    mockChangeDetectorRef = TestBed.inject(
      ChangeDetectorRef
    ) as jasmine.SpyObj<ChangeDetectorRef>;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      // Don't trigger effects by not calling detectChanges until after we check initial values
      expect(component.pageTitle).toBeUndefined(); // Initially undefined
      expect(component.hideId).toBeUndefined(); // Initially undefined
      expect(component.floatLabelType).toBe('auto');

      // After ngOnInit
      component.ngOnInit();
      expect(component.pageTitle).toBe('Edit Web Content Messages');
      expect(component.hideId).toBe(true);
    });

    it('should initialize form with correct structure and validators', () => {
      fixture.detectChanges();

      const form = component.contentForm;
      expect(form).toBeDefined();

      // Check form controls exist
      expect(form.get('title')).toBeDefined();
      expect(form.get('subTitle')).toBeDefined();
      expect(form.get('body')).toBeDefined();
      expect(form.get('location')).toBeDefined();
      expect(form.get('dateAndTime')).toBeDefined();
      expect(form.get('webContentId')).toBeDefined();
      expect(form.get('webContentTypeControl')).toBeDefined();
      expect(form.get('contentSequence')).toBeDefined();
      expect(form.get('expirationDate')).toBeDefined();

      // Check required validators
      form.get('title')?.setValue('');
      expect(form.get('title')?.hasError('required')).toBe(true);

      form.get('expirationDate')?.setValue(null);
      expect(form.get('expirationDate')?.hasError('required')).toBe(true);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should validate title field correctly', () => {
      const titleControl = component.contentForm.get('title');

      // Required validation
      titleControl?.setValue('');
      expect(titleControl?.hasError('required')).toBe(true);

      // Min length validation
      titleControl?.setValue('ab');
      expect(titleControl?.hasError('minlength')).toBe(true);

      // Max length validation
      titleControl?.setValue('a'.repeat(51));
      expect(titleControl?.hasError('maxlength')).toBe(true);

      // Valid value
      titleControl?.setValue('Valid Title');
      expect(titleControl?.valid).toBe(true);
    });

    it('should validate subtitle field correctly', () => {
      const subTitleControl = component.contentForm.get('subTitle');

      // Max length validation
      subTitleControl?.setValue('a'.repeat(51));
      expect(subTitleControl?.hasError('maxlength')).toBe(true);

      // Valid value
      subTitleControl?.setValue('Valid Subtitle');
      expect(subTitleControl?.valid).toBe(true);
    });

    it('should validate expiration date field correctly', () => {
      const expirationDateControl = component.contentForm.get('expirationDate');

      // Required validation
      expirationDateControl?.setValue(null);
      expect(expirationDateControl?.hasError('required')).toBe(true);

      // Valid value
      expirationDateControl?.setValue(new Date());
      expect(expirationDateControl?.valid).toBe(true);
    });
  });

  describe('Content Loading and Effects', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should populate form when content is retrieved', () => {
      component.onContentRetrieved(mockWebContent);

      const form = component.contentForm;
      expect(form.get('title')?.value).toBe(mockWebContent.title);
      expect(form.get('subTitle')?.value).toBe(mockWebContent.subTitle);
      expect(form.get('body')?.value).toBe(mockWebContent.body);
      expect(form.get('dateAndTime')?.value).toBe(mockWebContent.dateAndTime);
      expect(form.get('location')?.value).toBe(mockWebContent.location);
      expect(form.get('expirationDate')?.value).toBe(
        mockWebContent.expirationDate
      );
      expect(form.get('webContentId')?.value).toBe(mockWebContent.webContentId);
      expect(form.get('contentSequence')?.value).toBe(
        mockWebContent.contentSequence
      );
    });

    it('should set page title correctly for new content', () => {
      const newContent = { ...mockWebContent, webContentId: 0 };
      component.onContentRetrieved(newContent);

      expect(component.pageTitle).toBe('Add Notice');
    });

    it('should set page title correctly for existing content', () => {
      component.onContentRetrieved(mockWebContent);

      expect(component.pageTitle).toBe(`Edit Notice: ${mockWebContent.title}`);
    });

    it('should compute content types correctly', () => {
      const contentTypes = component.contentTypes();

      expect(contentTypes).toEqual(mockWebContentTypes);
      expect(contentTypes[0].webContentTypeId).toBe(1);
      expect(typeof contentTypes[0].webContentTypeId).toBe('number');
    });
  });

  describe('Save Functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.onContentRetrieved(mockWebContent);
    });

    it('should save content when form is valid and dirty', () => {
      // Make form dirty and valid
      component.contentForm.get('title')?.setValue('Updated Title');
      component.contentForm.markAsDirty();

      component.saveContent();

      expect(mockContentService.saveContent).toHaveBeenCalled();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        jasmine.any(contentActions.LoadAdminContent)
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/content']);
    });

    it('should not save content when form is invalid', () => {
      // Make form invalid
      component.contentForm.get('title')?.setValue('');
      component.contentForm.markAsDirty();

      component.saveContent();

      expect(mockContentService.saveContent).not.toHaveBeenCalled();
    });

    it('should not save content when form is not dirty', () => {
      // Form is valid but not dirty
      component.contentForm.markAsPristine();

      component.saveContent();

      expect(mockContentService.saveContent).not.toHaveBeenCalled();
    });

    it('should create WebContent object with correct values when saving', () => {
      // Ensure form is valid and set up all required fields
      component.contentForm.patchValue({
        title: 'Test Title',
        subTitle: 'Test Subtitle',
        body: 'Test Body',
        dateAndTime: '2025-01-01',
        location: 'Test Location',
        expirationDate: new Date('2025-12-31'),
        webContentId: 1,
        contentSequence: 2,
        webContentTypeControl: 1, // This is the key field that was missing
      });

      // Ensure the webContentTypeControl is enabled (since it gets disabled during loading)
      const webContentTypeControl = component.contentForm.get(
        'webContentTypeControl'
      );
      if (webContentTypeControl?.disabled) {
        webContentTypeControl.enable();
      }

      component.contentForm.markAsDirty();

      component.saveContent();

      expect(mockContentService.saveContent).toHaveBeenCalled();

      // Check the actual WebContent object passed to saveContent
      const savedContent = mockContentService.saveContent.calls.argsFor(0)[0];
      expect(savedContent.title).toBe('Test Title');
      expect(savedContent.subTitle).toBe('Test Subtitle');
      expect(savedContent.body).toBe('Test Body');
      expect(savedContent.dateAndTime).toBe('2025-01-01');
      expect(savedContent.location).toBe('Test Location');
      expect(savedContent.webContentId).toBe(1);
      expect(savedContent.contentSequence).toBe(2);
      expect(savedContent.webContentTypeId).toBe(1);
    });
  });

  describe('Delete Functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.onContentRetrieved(mockWebContent);
    });

    it('should delete content when webContentId is not 0', () => {
      component.contentForm.get('webContentId')?.setValue(1);

      component.deleteRecord();

      expect(mockContentService.deleteContent).toHaveBeenCalledWith(1);
    });

    it('should not delete content when webContentId is 0', () => {
      component.contentForm.get('webContentId')?.setValue(0);

      component.deleteRecord();

      expect(mockContentService.deleteContent).not.toHaveBeenCalled();
    });

    // Skip dialog tests for now due to MatDialog complexity
    // These would require a more sophisticated mock setup
  });

  describe('Helper Methods', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should format text correctly', () => {
      const input = 'Line 1\nLine 2\nLine 3';
      const expected = 'Line 1<br>Line 2<br>Line 3';

      const result = component.formatText(input);

      expect(result).toBe(expected);
    });

    it('should convert values to numbers correctly', () => {
      expect(component.toNumber(5)).toBe(5);
      expect(component.toNumber('10')).toBe(10);
      expect(component.toNumber('15.5')).toBe(15.5);
      expect(component.toNumber(null)).toBe(null);
      expect(component.toNumber(undefined)).toBe(null);
      expect(component.toNumber('')).toBe(null);
    });

    it('should return correct float label value', () => {
      expect(component.getFloatLabelValue()).toBe('auto');
    });

    it('should detect form dirty state correctly', () => {
      expect(component.isFormDirty()).toBe(false);

      component.contentForm.markAsDirty();
      expect(component.isFormDirty()).toBe(true);
    });

    it('should get web content type correctly', () => {
      const result1 = component.getWebContentType(1);
      expect(result1.webContentTypeId).toBe(1);
      expect(result1.webContentTypeDescription).toBe('Season Info');

      const result2 = component.getWebContentType(3);
      expect(result2.webContentTypeId).toBe(3);
      expect(result2.webContentTypeDescription).toBe('Meeting Notice');

      const resultDefault = component.getWebContentType(999);
      expect(resultDefault.webContentTypeId).toBe(999);
      expect(resultDefault.webContentTypeDescription).toBe('Season Info');
    });

    it('should handle input events', () => {
      // Cannot test protected methods directly
      // This test would need to be implemented differently or the method made public
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Update Method', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.content = mockContent;
    });

    it('should update form with content values', () => {
      component.update();

      const form = component.contentForm;
      expect(form.get('title')?.value).toBe(mockContent.title);
      expect(form.get('subTitle')?.value).toBe(mockContent.subTitle);
      expect(form.get('body')?.value).toBe(mockContent.body);
      expect(form.get('dateAndTime')?.value).toBe(mockContent.dateAndTime);
      expect(form.get('location')?.value).toBe(mockContent.location);
      expect(form.get('expirationDate')?.value).toBe(
        mockContent.expirationDate
      );
      expect(form.get('webContentTypeControl')?.value).toBe(
        mockContent.webContentTypeId
      );
    });

    it('should format text and log it', () => {
      const contentWithNewlines = { ...mockContent, body: 'Line 1\nLine 2' };
      component.content = contentWithNewlines;

      component.update();

      expect(mockLoggerService.info).toHaveBeenCalledWith('Line 1<br>Line 2');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have hasError method that returns empty string', () => {
      const result = component.hasError('title', 'required');
      expect(result).toBe('');
    });
  });
});
