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
        bool isActive = true,
        CancellationToken cancellationToken = default);

    /// <summary>Returns all documents sorted by Section then SortOrder.</summary>
    Task<IReadOnlyList<DocumentMetadata>> GetDocumentsAsync(
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
        bool isActive = true,
        Stream? fileStream = null,
        string? fileName = null,
        CancellationToken cancellationToken = default);
}
