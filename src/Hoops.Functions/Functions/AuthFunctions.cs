using System.Net;
using System.Text.Json;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Hoops.Functions.Utils;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Hosting;

namespace Hoops.Functions.Functions;

public class AuthFunctions
{
    private readonly hoopsContext _context;
    private readonly AuthContext _authContext;
    private readonly IHostEnvironment _env;

    public record LoginRequest(string userName, string password);

    public AuthFunctions(hoopsContext context, AuthContext authContext, IHostEnvironment env)
    {
        _context = context;
        _authContext = authContext;
        _env = env;
    }

    [Function("Auth_Login")]
    public async Task<HttpResponseData> Login(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "auth/login")] HttpRequestData req)
    {
        var body = await JsonSerializer.DeserializeAsync<LoginRequest>(req.Body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        if (body is null)
        {
            return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.BadRequest);
        }

        var repo = new UserRepository(_context);
        try
        {
            var user = repo.GetUser(body.userName, body.password);
            if (user == null)
            {
                return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.Unauthorized);
            }
            var roles = _context.Roles.Where(s => s.UserId == user.UserId).Select(s => s.ScreenName);
            var divisions = _context.Divisions.Where(d => d.DirectorId == user.PersonId);
            var userVm = UserVm.ConvertToVm(user, roles, divisions);

            var res = ResponseUtils.CreateResponse(req, HttpStatusCode.OK);

            // Set the hoops.auth cookie so the browser sends it on subsequent requests.
            // Cookie value is the userId — validated by AuthenticationMiddleware on each request.
            // SameSite=None is required for cross-origin credentialed requests (Angular → Functions).
            // Secure is required when SameSite=None; relaxed in local development over HTTP.
            SetAuthCookie(res, user.UserId.ToString(), maxAgeSeconds: 20 * 60);

            await ResponseUtils.WriteJsonAsync(res, userVm);
            return res;
        }
        catch (Exception)
        {
            // UserRepository throws exception for invalid credentials
            return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.Unauthorized);
        }
    }

    [Function("Auth_Me")]
    public async Task<HttpResponseData> Me(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "auth/me")] HttpRequestData req)
    {
        var userId = _authContext.UserId;
        if (userId == null)
        {
            return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.Unauthorized);
        }

        var user = await _context.Users.FindAsync(userId.Value);
        if (user == null)
        {
            return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.Unauthorized);
        }

        var roles = _context.Roles.Where(r => r.UserId == user.UserId).Select(r => r.ScreenName);
        var divisions = _context.Divisions.Where(d => d.DirectorId == user.PersonId);
        var userVm = UserVm.ConvertToVm(user, roles, divisions);

        var res = ResponseUtils.CreateResponse(req, HttpStatusCode.OK);
        await ResponseUtils.WriteJsonAsync(res, userVm);
        return res;
    }

    [Function("Auth_Logout")]
    public Task<HttpResponseData> Logout(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "auth/logout")] HttpRequestData req)
    {
        var res = ResponseUtils.CreateResponse(req, HttpStatusCode.NoContent);
        // Clear the cookie by setting Max-Age=0 — browser deletes it immediately
        SetAuthCookie(res, "", maxAgeSeconds: 0);
        return Task.FromResult(res);
    }

    /// <summary>
    /// Writes the Set-Cookie header for hoops.auth directly to avoid SDK version differences
    /// in the HttpCookie API (SameSiteCookieValue enum availability, MaxAge type).
    /// In production: SameSite=None; Secure (required for cross-origin credentialed requests).
    /// In local development: SameSite=Lax without Secure (HTTP on localhost).
    /// </summary>
    private void SetAuthCookie(HttpResponseData response, string value, int maxAgeSeconds)
    {
        var isLocalDev = _env.IsDevelopment();
        var cookie = isLocalDev
            ? $"hoops.auth={value}; HttpOnly; Path=/; Max-Age={maxAgeSeconds}; SameSite=Lax"
            : $"hoops.auth={value}; HttpOnly; Path=/; Max-Age={maxAgeSeconds}; SameSite=None; Secure";

        response.Headers.Add("Set-Cookie", cookie);
    }
}
