#nullable enable
using System;

namespace Hoops.Core.Models;

/// <summary>
/// Domain model representing a PDF document stored in Azure Blob Storage
/// with metadata persisted in Azure Table Storage.
/// </summary>
public class DocumentMetadata
{
    /// <summary>GUID assigned at upload time; serves as the Table Storage RowKey.</summary>
    public string DocumentId { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    /// <summary>Relative path within the blob container, e.g. "schedules/&lt;guid&gt;.pdf".</summary>
    public string BlobPath { get; set; } = string.Empty;

    /// <summary>Full HTTPS URL to the blob.</summary>
    public string BlobUrl { get; set; } = string.Empty;

    /// <summary>Controls the display order of documents within a section.</summary>
    public int SortOrder { get; set; }

    /// <summary>
    /// Controls the display order of sections on the public page.
    /// All documents in the same section should share the same value.
    /// </summary>
    public int SectionSortOrder { get; set; }

    public string? Description { get; set; }

    public bool IsActive { get; set; }

    public string? Season { get; set; }

    /// <summary>Document category / Table Storage PartitionKey (e.g. "Schedules", "Rules").</summary>
    public string Section { get; set; } = string.Empty;

    public DateTime LastUpdatedUtc { get; set; }
}
