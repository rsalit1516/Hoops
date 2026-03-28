import {
  Injectable,
  OnDestroy,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { FormValidationService } from './form-validation.service';

/**
 * Abstract base class for form components with standardized save button behavior
 * Provides common form validation, state management, and user experience patterns
 */
@Injectable()
export abstract class BaseFormComponent implements OnDestroy {
  protected destroy$ = new Subject<void>();

  abstract form: FormGroup;
  abstract isSaving: WritableSignal<boolean>;

  protected formValidation = inject(FormValidationService);

  constructor() {}

  /**
   * Whether the save button should be enabled
   * Button is enabled only when form has changes (dirty) and is valid
   */
  get isSaveEnabled(): boolean {
    return this.formValidation.isSaveEnabled(this.form, this.isSaving());
  }

  /**
   * Dynamic text for the save button based on form state
   */
  get saveButtonText(): string {
    return this.formValidation.getSaveButtonText(
      this.form,
      this.isSaving(),
      this.isNewRecord
    );
  }

  /**
   * Whether form has validation errors that should be displayed
   */
  get hasValidationErrors(): boolean {
    return this.formValidation.hasValidationErrors(this.form);
  }

  /**
   * CSS classes for save button styling
   */
  get saveButtonClasses(): { [key: string]: boolean } {
    return this.formValidation.getSaveButtonClasses(this.form, this.isSaving());
  }

  /**
   * Tooltip text for disabled save button to guide user
   */
  get saveButtonTooltip(): string {
    if (!this.form) return '';

    if (this.isSaving()) return 'Saving...';
    if (!this.form.dirty) return 'Make changes to enable save';
    if (!this.form.valid) return 'Please fill all required fields correctly';

    return '';
  }

  /**
   * Override in child components to indicate if this is a new record
   */
  protected get isNewRecord(): boolean {
    return false;
  }

  /**
   * Template method for save operation - override in child components
   */
  abstract save(): void;

  /**
   * Check if form can be saved (has changes and is valid)
   */
  protected canSave(): boolean {
    return this.isSaveEnabled;
  }

  /**
   * Mark form as pristine after successful save
   */
  protected markFormAsPristine(): void {
    if (this.form) {
      this.form.markAsPristine();
    }
  }

  /**
   * Check if form has unsaved changes (for navigation guards)
   */
  hasUnsavedChanges(): boolean {
    return this.form?.dirty ?? false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
