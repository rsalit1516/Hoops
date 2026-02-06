using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Hoops.Functions.Utils;

/// <summary>
/// Attribute to mark Azure Functions that require authentication.
/// Functions with this attribute will return 401 if no valid authentication cookie is present.
/// </summary>
[AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
public class RequireAuthAttribute : Attribute
{
    /// <summary>
    /// Optional comma-separated list of required roles (e.g., "Admin,Director")
    /// If specified, user must have at least one of these roles.
    /// </summary>
    public string? Roles { get; set; }
}

/// <summary>
/// Extension methods to check authentication in Azure Functions.
/// </summary>
public static class AuthorizationExtensions
{
    /// <summary>
    /// Checks if the current request is authenticated by looking for the User in context.
    /// Returns an Unauthorized response if not authenticated.
    /// </summary>
    public static HttpResponseData? CheckAuthentication(this FunctionContext context, HttpRequestData req, ILogger logger)
    {
        if (!context.Items.TryGetValue("User", out var userObj) || userObj == null)
        {
            logger.LogWarning("Unauthorized access attempt to {FunctionName}", context.FunctionDefinition.Name);
            var response = req.CreateResponse(HttpStatusCode.Unauthorized);
            response.Headers.Add("Content-Type", "application/json");
            response.WriteString("{\"error\":\"Unauthorized\",\"message\":\"Authentication required. Please log in.\"}");
            return response;
        }
        
        return null; // Authentication successful
    }

    /// <summary>
    /// Checks if the current request is authenticated.
    /// </summary>
    public static bool IsAuthenticated(this FunctionContext context)
    {
        return context.Items.TryGetValue("User", out var userObj) && userObj != null;
    }
}
