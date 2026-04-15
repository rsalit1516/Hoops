using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Data.Tables;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Infrastructure.Models;
using Microsoft.Extensions.Logging;

namespace Hoops.Infrastructure.Services;

/// <summary>
/// Uploads PDFs to Azure Blob Storage and persists metadata to Azure Table Storage.
///
/// Blob container : "documents"  (private; blobs served via signed URL or backend proxy)
/// Table name     : "DocumentMetadata"
/// Partition key  : Section  (e.g. "Schedules", "Rules")
/// Row key        : DocumentId (new GUID per upload)
/// </summary>
public class DocumentStorageService : IDocumentStorageService
{
    private const string BlobContainerName = "documents";
    private const string TableName = "DocumentMetadata";

    private readonly BlobServiceClient _blobServiceClient;
    private readonly TableServiceClient _tableServiceClient;
    private readonly ILogger<DocumentStorageService> _logger;

    public DocumentStorageService(
        BlobServiceClient blobServiceClient,
        TableServiceClient tableServiceClient,
        ILogger<DocumentStorageService> logger)
    {
        _blobServiceClient = blobServiceClient;
        _tableServiceClient = tableServiceClient;
        _logger = logger;
    }

    public async Task<DocumentMetadata> UploadDocumentAsync(
        Stream fileStream,
        string fileName,
        string title,
        string section,
        string? description = null,
        string? season = null,
        int sortOrder = 0,
        bool isActive = true,
        CancellationToken cancellationToken = default)
    {
        var documentId = Guid.NewGuid().ToString();
        var sectionSlug = section.ToLowerInvariant().Replace(" ", "-");
        var blobPath = $"{sectionSlug}/{documentId}.pdf";

        // ── 1. Blob Storage ───────────────────────────────────────────────────
        var containerClient = _blobServiceClient.GetBlobContainerClient(BlobContainerName);
        await containerClient.CreateIfNotExistsAsync(
            PublicAccessType.None, cancellationToken: cancellationToken);

        var blobClient = containerClient.GetBlobClient(blobPath);
        await blobClient.UploadAsync(
            fileStream,
            new BlobHttpHeaders { ContentType = "application/pdf" },
            cancellationToken: cancellationToken);

        var blobUrl = blobClient.Uri.ToString();
        _logger.LogInformation(
            "Document blob uploaded: documentId={DocumentId} path={BlobPath}", documentId, blobPath);

        // ── 2. Table Storage ─────────────────────────────────────────────────
        var tableClient = _tableServiceClient.GetTableClient(TableName);
        await tableClient.CreateIfNotExistsAsync(cancellationToken);

        var now = DateTime.UtcNow;
        var entity = new DocumentTableEntity
        {
            PartitionKey = section,
            RowKey = documentId,
            Title = title,
            BlobPath = blobPath,
            BlobUrl = blobUrl,
            SortOrder = sortOrder,
            Description = description,
            IsActive = isActive,
            Season = season,
            Section = section,
            LastUpdatedUtc = now
        };

        await tableClient.AddEntityAsync(entity, cancellationToken);
        _logger.LogInformation(
            "Document metadata written to table: documentId={DocumentId} section={Section}", documentId, section);

        return new DocumentMetadata
        {
            DocumentId = documentId,
            Title = title,
            BlobPath = blobPath,
            BlobUrl = blobUrl,
            SortOrder = sortOrder,
            Description = description,
            IsActive = isActive,
            Season = season,
            Section = section,
            LastUpdatedUtc = now
        };
    }
}
