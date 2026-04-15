#nullable enable
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Hoops.Core.Models;

namespace Hoops.Core.Interface;

/// <summary>
/// Uploads a PDF to blob storage and writes the corresponding metadata row
/// to Azure Table Storage.
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
}
