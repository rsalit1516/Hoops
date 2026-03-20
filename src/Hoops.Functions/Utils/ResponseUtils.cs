using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Azure.Functions.Worker.Http;

namespace Hoops.Functions.Utils;

public static class ResponseUtils
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    /// <summary>
    /// Adds CORS headers for credentialed requests to the response
    /// </summary>
    public static void AddCorsHeaders(HttpResponseData response)
    {
        // Enable credentialed CORS responses when allowed at the app level
        if (!response.Headers.Contains("Access-Control-Allow-Credentials"))
        {
            response.Headers.Add("Access-Control-Allow-Credentials", "true");
        }
        if (!response.Headers.Contains("Vary"))
        {
            response.Headers.Add("Vary", "Origin");
        }
    }

    /// <summary>
    /// Creates a JSON response with proper CORS headers
    /// </summary>
    public static async Task WriteJsonAsync<T>(HttpResponseData response, T value, HttpStatusCode statusCode = HttpStatusCode.OK)
    {
        response.StatusCode = statusCode;
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        AddCorsHeaders(response);
        await JsonSerializer.SerializeAsync(response.Body, value, JsonOptions);
    }

    /// <summary>
    /// Creates an error response with proper CORS headers
    /// </summary>
    public static HttpResponseData CreateErrorResponse(HttpRequestData request, HttpStatusCode statusCode, string? message = null)
    {
        var response = request.CreateResponse(statusCode);
        AddCorsHeaders(response);

        if (!string.IsNullOrEmpty(message))
        {
            response.WriteString(message);
        }

        return response;
    }

    /// <summary>
    /// Creates a success response with proper CORS headers
    /// </summary>
    public static HttpResponseData CreateResponse(HttpRequestData request, HttpStatusCode statusCode = HttpStatusCode.OK)
    {
        var response = request.CreateResponse(statusCode);
        AddCorsHeaders(response);
        return response;
    }
}