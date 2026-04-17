using System;
using System.Collections.Generic;
using System.Linq;
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

    public async Task<IReadOnlyList<DocumentMetadata>> GetDocumentsAsync(
        CancellationToken cancellationToken = default)
    {
        var tableClient = _tableServiceClient.GetTableClient(TableName);
        await tableClient.CreateIfNotExistsAsync(cancellationToken);

        var results = new List<DocumentMetadata>();

        await foreach (var entity in tableClient.QueryAsync<DocumentTableEntity>(
            cancellationToken: cancellationToken))
        {
            results.Add(new DocumentMetadata
            {
                DocumentId = entity.RowKey,
                Title = entity.Title,
                BlobPath = entity.BlobPath,
                BlobUrl = entity.BlobUrl,
                SortOrder = entity.SortOrder,
                Description = entity.Description,
                IsActive = entity.IsActive,
                Season = entity.Season,
                Section = entity.Section,
                LastUpdatedUtc = entity.LastUpdatedUtc
            });
        }

        return results
            .OrderBy(d => d.Section, StringComparer.OrdinalIgnoreCase)
            .ThenBy(d => d.SortOrder)
            .ToList();
    }

    public async Task<DocumentMetadata> UpdateDocumentAsync(
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
        CancellationToken cancellationToken = default)
    {
        var tableClient = _tableServiceClient.GetTableClient(TableName);
        await tableClient.CreateIfNotExistsAsync(cancellationToken);

        // Load the existing entity to get blob references.
        var existing = await tableClient.GetEntityAsync<DocumentTableEntity>(
            oldSection, documentId, cancellationToken: cancellationToken);

        var blobPath = existing.Value.BlobPath;
        var blobUrl = existing.Value.BlobUrl;

        // ── Replace blob if a new file was supplied ────────────────────────────
        if (fileStream != null)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(BlobContainerName);
            await containerClient.CreateIfNotExistsAsync(
                PublicAccessType.None, cancellationToken: cancellationToken);

            var sectionSlug = section.ToLowerInvariant().Replace(" ", "-");
            blobPath = $"{sectionSlug}/{documentId}.pdf";

            var blobClient = containerClient.GetBlobClient(blobPath);
            await blobClient.UploadAsync(
                fileStream,
                new BlobHttpHeaders { ContentType = "application/pdf" },
                cancellationToken: cancellationToken);

            blobUrl = blobClient.Uri.ToString();
        }

        var now = DateTime.UtcNow;
        var updated = new DocumentTableEntity
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

        // When the section (PartitionKey) changes we must delete + re-insert
        // because Azure Table Storage does not support PartitionKey mutation.
        if (!string.Equals(oldSection, section, StringComparison.OrdinalIgnoreCase))
        {
            await tableClient.DeleteEntityAsync(oldSection, documentId,
                cancellationToken: cancellationToken);
            await tableClient.AddEntityAsync(updated, cancellationToken);
        }
        else
        {
            await tableClient.UpsertEntityAsync(updated,
                TableUpdateMode.Replace, cancellationToken);
        }

        _logger.LogInformation(
            "Document metadata updated: documentId={DocumentId} section={Section}", documentId, section);

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
