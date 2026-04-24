using System.Security.Claims;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Middleware;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Hoops.Functions.Utils;

/// <summary>
/// Middleware to validate the hoops.auth cookie and populate user claims.
/// The cookie value is the userId (set by AuthFunctions.Login).
/// On every authenticated request the cookie is re-issued with a fresh Max-Age,
/// implementing a sliding expiration: the session times out after 20 minutes of
/// inactivity rather than 20 minutes from initial login.
/// </summary>
public class AuthenticationMiddleware : IFunctionsWorkerMiddleware
{
    private readonly ILogger<AuthenticationMiddleware> _logger;
    private readonly IHostEnvironment _env;
    private const string CookieName = "hoops.auth";
    private const int MaxAgeSeconds = 20 * 60;

    public AuthenticationMiddleware(ILogger<AuthenticationMiddleware> logger, IHostEnvironment env)
    {
        _logger = logger;
        _env = env;
    }

    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        var requestData = await context.GetHttpRequestDataAsync();
        int? authenticatedUserId = null;

        if (requestData != null)
        {
            var cookieValue = GetCookie(requestData, CookieName);

            if (!string.IsNullOrEmpty(cookieValue))
            {
                try
                {
                    var userId = ParseUserIdFromCookie(cookieValue);
                    if (userId.HasValue)
                    {
                        // Populate AuthContext so Auth_Me and other functions can identify the caller
                        var authCtx = context.InstanceServices.GetRequiredService<AuthContext>();
                        authCtx.UserId = userId;

                        // Keep context.Items["User"] so CheckAuthentication() continues to work
                        var claims = new List<Claim>
                        {
                            new Claim(ClaimTypes.Name, userId.Value.ToString()),
                            new Claim("AuthenticationMethod", "Cookie")
                        };
                        var identity = new ClaimsIdentity(claims, "Cookie");
                        context.Items["User"] = new ClaimsPrincipal(identity);

                        authenticatedUserId = userId.Value;
                        _logger.LogInformation("User authenticated: userId={UserId}", userId.Value);
                    }
                    else
                    {
                        _logger.LogWarning("hoops.auth cookie present but could not parse userId from value");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to validate authentication cookie");
                }
            }
        }

        await next(context);

        // Sliding expiration: re-issue the cookie with a fresh Max-Age after every
        // authenticated request so the session clock resets on each activity.
        if (authenticatedUserId.HasValue)
        {
            var response = context.GetHttpResponseData();
            if (response != null)
            {
                var isLocalDev = _env.IsDevelopment();
                var cookie = isLocalDev
                    ? $"{CookieName}={authenticatedUserId.Value}; HttpOnly; Path=/; Max-Age={MaxAgeSeconds}; SameSite=Lax"
                    : $"{CookieName}={authenticatedUserId.Value}; HttpOnly; Path=/; Max-Age={MaxAgeSeconds}; SameSite=None; Secure";
                response.Headers.TryAddWithoutValidation("Set-Cookie", cookie);
            }
        }
    }

    private static string? GetCookie(HttpRequestData request, string cookieName)
    {
        if (request.Headers.TryGetValues("Cookie", out var cookies))
        {
            foreach (var cookieHeader in cookies)
            {
                foreach (var pair in cookieHeader.Split(';'))
                {
                    var trimmed = pair.Trim();
                    if (trimmed.StartsWith($"{cookieName}=", StringComparison.OrdinalIgnoreCase))
                    {
                        return trimmed.Substring(cookieName.Length + 1);
                    }
                }
            }
        }
        return null;
    }

    private static int? ParseUserIdFromCookie(string cookieValue) =>
        int.TryParse(cookieValue, out var id) ? id : (int?)null;
}
