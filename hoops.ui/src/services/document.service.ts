import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentMetadata } from '@app/domain/document';
import { Constants } from '@app/shared/constants';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private readonly http = inject(HttpClient);

  /**
   * Uploads a PDF file and its metadata to the backend.
   * Sends multipart/form-data — do NOT set Content-Type manually;
   * the browser adds the boundary automatically.
   */
  uploadDocument(formData: FormData): Observable<DocumentMetadata> {
    return this.http.post<DocumentMetadata>(
      Constants.DOCUMENT_UPLOAD_URL,
      formData,
      { withCredentials: true }
    );
  }

  /** Returns all documents sorted by Section then SortOrder. */
  getDocuments(): Observable<DocumentMetadata[]> {
    return this.http.get<DocumentMetadata[]>(
      Constants.DOCUMENT_LIST_URL,
      { withCredentials: true }
    );
  }

  /**
   * Returns only active documents for public display.
   * BlobUrl is a 24-hour SAS URL generated server-side.
   * No auth cookie required.
   */
  getPublicDocuments(): Observable<DocumentMetadata[]> {
    return this.http.get<DocumentMetadata[]>(Constants.DOCUMENT_PUBLIC_URL);
  }

  /** Updates metadata (and optionally the file) for an existing document. */
  updateDocument(documentId: string, formData: FormData): Observable<DocumentMetadata> {
    return this.http.put<DocumentMetadata>(
      `${Constants.DOCUMENT_LIST_URL}/${documentId}`,
      formData,
      { withCredentials: true }
    );
  }
}
