using Azure;
using Azure.Data.Tables;

namespace Hoops.Infrastructure.Models;

/// <summary>
/// Azure Table Storage entity for document metadata.
/// PartitionKey = Section (e.g. "Schedules")
/// RowKey       = DocumentId (GUID string)
/// </summary>
public class DocumentTableEntity : ITableEntity
{
    // ── ITableEntity ──────────────────────────────────────────────────────────
    public string PartitionKey { get; set; } = string.Empty;
    public string RowKey { get; set; } = string.Empty;
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }

    // ── Document fields ───────────────────────────────────────────────────────
    public string Title { get; set; } = string.Empty;
    public string BlobPath { get; set; } = string.Empty;
    public string BlobUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public int SectionSortOrder { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public string? Season { get; set; }

    /// <summary>Stored redundantly alongside PartitionKey for convenient reads.</summary>
    public string Section { get; set; } = string.Empty;

    public DateTime LastUpdatedUtc { get; set; }
}
