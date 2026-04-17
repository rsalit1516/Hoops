export interface DocumentMetadata {
  documentId: string;
  title: string;
  blobPath: string;
  blobUrl: string;
  sortOrder: number;
  description?: string;
  isActive: boolean;
  season?: string;
  section: string;
  lastUpdatedUtc: string;
}
