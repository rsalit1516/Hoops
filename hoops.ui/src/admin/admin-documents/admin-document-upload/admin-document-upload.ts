import {
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { catchError, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SeasonService } from '@app/services/season.service';
import { DocumentService } from '@app/services/document.service';
import { AdminDocumentStateService } from '../admin-document-state.service';
import { ConfirmDialog } from '@app/admin/shared/confirm-dialog/confirm-dialog';

interface DocumentUploadModel {
  title: string;
  section: string;
  season: string;
  sortOrder: number | null;
  description: string;
  isActive: boolean;
}

const EMPTY_MODEL: DocumentUploadModel = {
  title: '',
  section: '',
  season: '',
  sortOrder: null,
  description: '',
  isActive: true,
};

@Component({
  selector: 'app-admin-document-upload',
  standalone: true,
  imports: [
    ConfirmDialog,
    FormField,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin-document-upload.html',
  styleUrls: ['../../../shared/scss/forms.scss', '../../admin.scss', './admin-document-upload.scss'],
})
export class AdminDocumentUpload {
  private readonly documentService = inject(DocumentService);
  private readonly stateService = inject(AdminDocumentStateService);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  // ── Seasons dropdown ───────────────────────────────────────────────────────
  private readonly seasonService = inject(SeasonService);
  readonly seasons = toSignal(
    this.seasonService.seasons$.pipe(catchError(() => of([]))),
    { initialValue: [] }
  );

  // ── Edit mode detection ────────────────────────────────────────────────────
  readonly isEditMode = computed(() => this.stateService.selectedDocument() !== null);

  // ── Form model (Signal Forms) ──────────────────────────────────────────────
  readonly model = signal<DocumentUploadModel>({ ...EMPTY_MODEL });
  readonly uploadForm = form(this.model);

  // Snapshot of the model at load time — used for dirty detection in edit mode.
  private readonly initialModel = signal<DocumentUploadModel | null>(null);

  // Pre-populate form when a document is selected for editing
  private readonly populateEffect = effect(() => {
    const doc = this.stateService.selectedDocument();
    if (doc) {
      const snapshot: DocumentUploadModel = {
        title: doc.title,
        section: doc.section,
        season: doc.season ?? '',
        sortOrder: doc.sortOrder,
        description: doc.description ?? '',
        isActive: doc.isActive,
      };
      this.model.set({ ...snapshot });
      this.initialModel.set({ ...snapshot });
    } else {
      this.model.set({ ...EMPTY_MODEL });
      this.initialModel.set(null);
    }
  });

  // ── File state (managed outside Signal Forms) ──────────────────────────────
  readonly selectedFile = signal<File | null>(null);
  readonly selectedFileName = computed(() => this.selectedFile()?.name ?? '');
  readonly fileError = signal<string | null>(null);

  // ── Derived state ──────────────────────────────────────────────────────────
  readonly isSaving = signal(false);
  readonly isDeleting = signal(false);

  readonly isValid = computed(() => {
    const m = this.model();
    const fileOk = this.isEditMode()
      ? this.fileError() === null   // file optional on edit
      : this.selectedFile() !== null && this.fileError() === null;
    return (
      m.title.trim().length > 0 &&
      m.title.length <= 200 &&
      m.section.trim().length > 0 &&
      m.section.length <= 100 &&
      fileOk
    );
  });

  /** True when at least one field differs from the snapshot, or a new file has been chosen. */
  readonly hasChanges = computed(() => {
    const initial = this.initialModel();
    if (!initial) return true; // new form — no baseline to compare against
    const m = this.model();
    return (
      m.title !== initial.title ||
      m.section !== initial.section ||
      m.season !== initial.season ||
      m.sortOrder !== initial.sortOrder ||
      m.description !== initial.description ||
      m.isActive !== initial.isActive ||
      this.selectedFile() !== null
    );
  });

  readonly canSave = computed(() =>
    !this.isSaving() && this.isValid() && this.hasChanges()
  );

  // ── File input handler ─────────────────────────────────────────────────────
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.selectedFile.set(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      this.fileError.set('Only PDF files are accepted.');
      this.selectedFile.set(null);
      input.value = '';
      return;
    }

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      this.fileError.set('File exceeds the maximum allowed size of 10 MB.');
      this.selectedFile.set(null);
      input.value = '';
      return;
    }

    this.fileError.set(null);
    this.selectedFile.set(file);
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  submit(): void {
    if (!this.canSave()) return;

    this.isSaving.set(true);
    const m = this.model();

    const formData = new FormData();
    formData.append('title', m.title.trim());
    formData.append('section', m.section.trim());
    if (m.description.trim()) formData.append('description', m.description.trim());
    if (m.season) formData.append('season', m.season);
    if (m.sortOrder !== null) formData.append('sortOrder', String(m.sortOrder));
    formData.append('isActive', String(m.isActive));

    const existingDoc = this.stateService.selectedDocument();

    if (existingDoc) {
      // Edit mode
      formData.append('oldSection', existingDoc.section);
      if (this.selectedFile()) formData.append('file', this.selectedFile()!);

      this.documentService.updateDocument(existingDoc.documentId, formData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.snack.open('Document updated successfully', 'Close', { duration: 2500 });
          this.stateService.fetchDocuments();
          this.router.navigate(['/admin/documents']);
        },
        error: (err) => {
          this.isSaving.set(false);
          const apiError = err?.error?.errors?.[0];
          const msg = apiError ?? 'Update failed. Please try again.';
          this.snack.open(msg, 'Close', { duration: 4000 });
        },
      });
    } else {
      // New upload
      formData.append('file', this.selectedFile()!);

      this.documentService.uploadDocument(formData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.snack.open('Document uploaded successfully', 'Close', { duration: 2500 });
          this.stateService.fetchDocuments();
          this.router.navigate(['/admin/documents']);
        },
        error: (err) => {
          this.isSaving.set(false);
          const apiError = err?.error?.errors?.[0];
          const msg = apiError ?? 'Upload failed. Please try again.';
          this.snack.open(msg, 'Close', { duration: 4000 });
        },
      });
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  deleteDocument(): void {
    const doc = this.stateService.selectedDocument();
    if (!doc) return;

    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete Document',
        message: `Are you sure you want to permanently delete "${doc.title}"? This cannot be undone.`,
      },
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.isDeleting.set(true);
      this.documentService.deleteDocument(doc.documentId, doc.section).subscribe({
        next: () => {
          this.isDeleting.set(false);
          this.snack.open('Document deleted', 'Close', { duration: 2500 });
          this.stateService.selectDocument(null);
          this.stateService.fetchDocuments();
          this.router.navigate(['/admin/documents']);
        },
        error: (err) => {
          this.isDeleting.set(false);
          const apiError = err?.error?.errors?.[0];
          const msg = apiError ?? 'Delete failed. Please try again.';
          this.snack.open(msg, 'Close', { duration: 4000 });
        },
      });
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/documents']);
  }
}
