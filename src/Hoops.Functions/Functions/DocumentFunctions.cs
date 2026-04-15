using System.Net;
using Hoops.Core.Interface;
using Hoops.Functions.Utils;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Hoops.Functions.Functions;

/// <summary>
/// HTTP triggers for document management (PDF upload + metadata).
/// All endpoints require an authenticated admin session (hoops.auth cookie).
/// </summary>
public class DocumentFunctions
{
    private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB

    private readonly IDocumentStorageService _documentStorage;
    private readonly ILogger<DocumentFunctions> _logger;

    public DocumentFunctions(
        IDocumentStorageService documentStorage,
        ILogger<DocumentFunctions> logger)
    {
        _documentStorage = documentStorage;
        _logger = logger;
    }

    /// <summary>
    /// POST /api/documents/upload
    ///
    /// Accepts multipart/form-data with:
    ///   file        — PDF file (required, field name must be "file")
    ///   title       — display name (required, max 200 chars)
    ///   section     — category / partition key (required, max 100 chars)
    ///   description — optional
    ///   season      — optional (e.g. "2024-25")
    ///   sortOrder   — optional integer, defaults to 0
    ///   isActive    — optional bool, defaults to true
    ///
    /// Returns 201 Created with DocumentMetadata JSON on success.
    /// Returns 400 Bad Request with { errors: [...] } on validation failure.
    /// Returns 401 Unauthorized if no valid auth cookie is present.
    /// </summary>
    [Function("Document_Upload")]
    public async Task<HttpResponseData> Upload(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "documents/upload")]
        HttpRequestData req,
        FunctionContext context)
    {
        // ── Auth check ────────────────────────────────────────────────────────
        var authError = context.CheckAuthentication(req, _logger);
        if (authError != null)
            return authError;

        // ── Validate Content-Type ─────────────────────────────────────────────
        if (!req.Headers.TryGetValues("Content-Type", out var contentTypeValues))
            return await SingleErrorResponse(req, "Content-Type header is missing.");

        var contentType = contentTypeValues.FirstOrDefault() ?? string.Empty;
        if (!contentType.Contains("multipart/form-data", StringComparison.OrdinalIgnoreCase))
            return await SingleErrorResponse(req, "Request must be multipart/form-data.");

        var boundary = ExtractBoundary(contentType);
        if (string.IsNullOrWhiteSpace(boundary))
            return await SingleErrorResponse(req, "multipart boundary is missing from Content-Type.");

        // ── Parse multipart sections ──────────────────────────────────────────
        string? title = null;
        string? section = null;
        string? description = null;
        string? season = null;
        int sortOrder = 0;
        bool isActive = true;
        Stream? fileStream = null;
        string? fileName = null;

        try
        {
            var reader = new MultipartReader(boundary, req.Body);
            MultipartSection? part;

            while ((part = await reader.ReadNextSectionAsync()) != null)
            {
                if (part.Headers == null || !part.Headers.TryGetValue("Content-Disposition", out var cdValues))
                    continue;

                var cd = cdValues.FirstOrDefault() ?? string.Empty;
                var fieldName = ExtractCdParam(cd, "name");
                if (string.IsNullOrEmpty(fieldName)) continue;

                var partFileName = ExtractCdParam(cd, "filename");
                bool isFilePart = !string.IsNullOrEmpty(partFileName);

                if (isFilePart && fieldName.Equals("file", StringComparison.OrdinalIgnoreCase))
                {
                    fileName = partFileName;
                    var ms = new MemoryStream();
                    await part.Body.CopyToAsync(ms);

                    if (ms.Length > MaxFileSizeBytes)
                    {
                        ms.Dispose();
                        return await SingleErrorResponse(req,
                            $"File exceeds the maximum allowed size of {MaxFileSizeBytes / 1024 / 1024} MB.");
                    }

                    ms.Position = 0;
                    fileStream = ms;
                }
                else if (!isFilePart)
                {
                    using var sr = new StreamReader(part.Body);
                    var value = await sr.ReadToEndAsync();

                    switch (fieldName.ToLowerInvariant())
                    {
                        case "title":       title = value; break;
                        case "section":     section = value; break;
                        case "description": description = string.IsNullOrWhiteSpace(value) ? null : value; break;
                        case "season":      season = string.IsNullOrWhiteSpace(value) ? null : value; break;
                        case "sortorder":
                            if (int.TryParse(value, out var so)) sortOrder = so;
                            break;
                        case "isactive":
                            if (bool.TryParse(value, out var ia)) isActive = ia;
                            break;
                    }
                }
            }
        }
        catch (Exception ex)
        {
            fileStream?.Dispose();
            _logger.LogError(ex, "Failed to parse multipart form data");
            return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.BadRequest,
                "Could not parse request body.");
        }

        // ── Field validation ──────────────────────────────────────────────────
        var errors = new List<string>();

        if (fileStream == null)
            errors.Add("A PDF file is required (field name: 'file').");

        if (!string.IsNullOrEmpty(fileName) &&
            !Path.GetExtension(fileName).Equals(".pdf", StringComparison.OrdinalIgnoreCase))
        {
            errors.Add("Only PDF files are accepted.");
        }

        if (string.IsNullOrWhiteSpace(title))
            errors.Add("'title' is required.");
        else if (title.Length > 200)
            errors.Add("'title' must be 200 characters or fewer.");

        if (string.IsNullOrWhiteSpace(section))
            errors.Add("'section' is required.");
        else if (section.Length > 100)
            errors.Add("'section' must be 100 characters or fewer.");

        if (errors.Count > 0)
        {
            fileStream?.Dispose();
            var errRes = ResponseUtils.CreateResponse(req, HttpStatusCode.BadRequest);
            await ResponseUtils.WriteJsonAsync(errRes, new { errors }, HttpStatusCode.BadRequest);
            return errRes;
        }

        // ── Upload ────────────────────────────────────────────────────────────
        try
        {
            var metadata = await _documentStorage.UploadDocumentAsync(
                fileStream!,
                fileName ?? "upload.pdf",
                title!,
                section!,
                description,
                season,
                sortOrder,
                isActive,
                context.CancellationToken);

            _logger.LogInformation(
                "Document uploaded: documentId={DocumentId} title={Title} section={Section}",
                metadata.DocumentId, metadata.Title, metadata.Section);

            var res = ResponseUtils.CreateResponse(req, HttpStatusCode.Created);
            await ResponseUtils.WriteJsonAsync(res, metadata, HttpStatusCode.Created);
            return res;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Document upload failed: title={Title} section={Section}", title, section);
            return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.InternalServerError,
                "An error occurred while uploading the document. Please try again.");
        }
        finally
        {
            fileStream?.Dispose();
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /// <summary>
    /// Extracts the boundary value from a Content-Type header string.
    /// e.g. "multipart/form-data; boundary=----WebKitFormBoundaryXyz" → "----WebKitFormBoundaryXyz"
    /// </summary>
    private static string? ExtractBoundary(string contentType)
    {
        foreach (var segment in contentType.Split(';'))
        {
            var trimmed = segment.Trim();
            if (trimmed.StartsWith("boundary=", StringComparison.OrdinalIgnoreCase))
                return trimmed["boundary=".Length..].Trim('"');
        }
        return null;
    }

    /// <summary>
    /// Extracts a named parameter value from a Content-Disposition header string.
    /// e.g. ExtractCdParam("form-data; name=\"file\"; filename=\"doc.pdf\"", "name") → "file"
    /// </summary>
    private static string? ExtractCdParam(string cd, string paramName)
    {
        var search = paramName + "=";
        foreach (var segment in cd.Split(';'))
        {
            var trimmed = segment.Trim();
            if (trimmed.StartsWith(search, StringComparison.OrdinalIgnoreCase))
                return trimmed[search.Length..].Trim('"');
        }
        return null;
    }

    private static async Task<HttpResponseData> SingleErrorResponse(HttpRequestData req, string message)
    {
        var res = ResponseUtils.CreateResponse(req, HttpStatusCode.BadRequest);
        await ResponseUtils.WriteJsonAsync(res, new { errors = new[] { message } }, HttpStatusCode.BadRequest);
        return res;
    }
}
