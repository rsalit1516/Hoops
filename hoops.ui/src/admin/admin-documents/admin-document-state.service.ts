import { inject, Injectable, signal } from '@angular/core';
import { DocumentMetadata } from '@app/domain/document';
import { DocumentService } from '@app/services/document.service';

@Injectable({ providedIn: 'root' })
export class AdminDocumentStateService {
  private readonly documentService = inject(DocumentService);

  readonly documents = signal<DocumentMetadata[]>([]);
  readonly selectedDocument = signal<DocumentMetadata | null>(null);
  readonly isLoading = signal(false);

  fetchDocuments(): void {
    this.isLoading.set(true);
    this.documentService.getDocuments().subscribe({
      next: (docs) => {
        this.documents.set(docs);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  selectDocument(doc: DocumentMetadata | null): void {
    this.selectedDocument.set(doc);
  }
}
