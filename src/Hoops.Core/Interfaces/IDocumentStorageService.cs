#nullable enable
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Hoops.Core.Models;

namespace Hoops.Core.Interface;

/// <summary>
/// Manages PDF storage in Azure Blob Storage and document metadata in Azure Table Storage.
/// </summary>
public interface IDocumentStorageService
{
    Task<DocumentMetadata> UploadDocumentAsync(
        Stream fileStream,
        string fileName,
        string title,
        string section,
        string? description = null,
        string? season = null,
        int sortOrder = 0,
        int sectionSortOrder = 0,
        bool isActive = true,
        CancellationToken cancellationToken = default);

    /// <summary>Returns all documents sorted by Section then SortOrder.</summary>
    Task<IReadOnlyList<DocumentMetadata>> GetDocumentsAsync(
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes the document's table entity and its associated blob.
    /// </summary>
    Task DeleteDocumentAsync(
        string documentId,
        string section,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns only active documents for public display.
    /// BlobUrl is replaced with a short-lived SAS URL so blobs can be
    /// opened directly in the browser without making the container public.
    /// </summary>
    Task<IReadOnlyList<DocumentMetadata>> GetPublicDocumentsAsync(
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates metadata for an existing document.
    /// If <paramref name="fileStream"/> is not null a new blob is uploaded
    /// and the blob references are updated.
    /// If the section changes the old table entity is replaced with a new one
    /// (Azure Table Storage does not allow PartitionKey mutation in place).
    /// </summary>
    Task<DocumentMetadata> UpdateDocumentAsync(
        string documentId,
        string oldSection,
        string title,
        string section,
        string? description = null,
        string? season = null,
        int sortOrder = 0,
        int sectionSortOrder = 0,
        bool isActive = true,
        Stream? fileStream = null,
        string? fileName = null,
        CancellationToken cancellationToken = default);
}
