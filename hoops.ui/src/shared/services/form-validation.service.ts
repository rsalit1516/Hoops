import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

/**
 * Service providing common form validation and state management utilities
 */
@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  /**
   * Determines if a save button should be enabled based on form state
   * @param form The FormGroup to check
   * @param isSaving Whether a save operation is currently in progress
   * @returns true if the save button should be enabled
   */
  isSaveEnabled(form: FormGroup | null, isSaving: boolean = false): boolean {
    if (!form || isSaving) return false;

    // Button should be enabled only if:
    // 1. Form has changes (is dirty)
    // 2. Form is valid (all required fields are properly filled)
    return form.dirty && form.valid;
  }

  /**
   * Gets the appropriate save button text based on form state
   * @param form The FormGroup to check
   * @param isSaving Whether a save operation is currently in progress
   * @param isNewRecord Whether this is a new record (create) vs existing (update)
   * @returns The text to display on the save button
   */
  getSaveButtonText(
    form: FormGroup | null,
    isSaving: boolean,
    isNewRecord: boolean = false
  ): string {
    if (isSaving) return 'Saving...';

    if (!form || !form.dirty) {
      return isNewRecord ? 'Create' : 'No Changes';
    }

    return isNewRecord ? 'Create' : 'Save Changes';
  }

  /**
   * Gets CSS classes for the save button based on form state
   * @param form The FormGroup to check
   * @param isSaving Whether a save operation is currently in progress
   * @returns Object with CSS classes
   */
  getSaveButtonClasses(
    form: FormGroup | null,
    isSaving: boolean
  ): { [key: string]: boolean } {
    const isEnabled = this.isSaveEnabled(form, isSaving);

    return {
      'save-enabled': isEnabled,
      'save-disabled': !isEnabled,
      'save-saving': isSaving,
    };
  }

  /**
   * Checks if form has validation errors for display purposes
   * @param form The FormGroup to check
   * @returns true if form has validation errors
   */
  hasValidationErrors(form: FormGroup | null): boolean {
    return form ? form.invalid && form.dirty : false;
  }
}
