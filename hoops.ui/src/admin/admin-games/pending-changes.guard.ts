import { Injectable, inject } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialog } from '@app/admin/shared/confirm-dialog/confirm-dialog';

// Components can implement this to participate in unsaved-change prompts
export interface HasUnsavedChanges {
  isFormDirty(): boolean;
}

@Injectable({ providedIn: 'root' })
export class PendingChangesGuard implements CanDeactivate<HasUnsavedChanges> {
  private dialog = inject(MatDialog);

  canDeactivate(component: HasUnsavedChanges): Observable<boolean> | boolean {
    try {
      if (!component || !component.isFormDirty || !component.isFormDirty()) {
        return true;
      }
    } catch {
      // If anything unexpected happens, allow navigation
      return true;
    }

    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Discard changes?',
        message:
          'You have unsaved changes. Do you want to leave this page and discard them?',
      },
    });
    return ref.afterClosed();
  }
}
