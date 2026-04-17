import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DocumentMetadata } from '@app/domain/document';
import { DocumentService } from '@app/services/document.service';

interface DocumentSection {
  name: string;
  documents: DocumentMetadata[];
}

@Component({
  selector: 'csbc-club-docs',
  templateUrl: './csbc-club-docs.html',
  styleUrls: [
    './club-docs.scss',
    '../shared/scss/cards.scss',
    '../shared/scss/tables.scss',
  ],
  imports: [MatCardModule, MatProgressSpinnerModule],
})
export class CsbcClubDocs implements OnInit {
  private readonly documentService = inject(DocumentService);

  readonly isLoading = signal(true);
  readonly hasError = signal(false);
  private readonly documents = signal<DocumentMetadata[]>([]);

  /** Documents grouped by section, sections sorted alphabetically. */
  readonly sections = computed<DocumentSection[]>(() => {
    const map = new Map<string, DocumentMetadata[]>();
    for (const doc of this.documents()) {
      const list = map.get(doc.section) ?? [];
      list.push(doc);
      map.set(doc.section, list);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, docs]) => ({
        name,
        documents: [...docs].sort((a, b) => a.sortOrder - b.sortOrder),
      }));
  });

  ngOnInit(): void {
    this.documentService.getPublicDocuments().subscribe({
      next: (docs) => {
        this.documents.set(docs);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  open(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
