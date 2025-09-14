using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Security.Claims;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Hoops.Functions.Functions;

public class AuthFunctions
{
    private readonly hoopsContext _context;

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    private static void AddCorsHeaders(HttpResponseData response)
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

    private static async Task WriteJsonAsync<T>(HttpResponseData response, T value)
    {
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        AddCorsHeaders(response);
        await JsonSerializer.SerializeAsync(response.Body, value, JsonOptions);
    }

    public record LoginRequest(string userName, string password);

    public AuthFunctions(hoopsContext context)
    {
        _context = context;
    }

    [Function("Auth_Login")]
    public async Task<HttpResponseData> Login(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "auth/login")] HttpRequestData req)
    {
        var body = await JsonSerializer.DeserializeAsync<LoginRequest>(req.Body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        if (body is null)
        {
            var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            AddCorsHeaders(badResponse);
            return badResponse;
        }
        var repo = new UserRepository(_context);
        var user = repo.GetUser(body.userName, body.password);
        if (user == null)
        {
            var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
            AddCorsHeaders(unauthorizedResponse);
            return unauthorizedResponse;
        }
        var roles = _context.Roles.Where(s => s.UserId == user.UserId).Select(s => s.ScreenName);
        var divisions = _context.Divisions.Where(d => d.DirectorId == user.PersonId);
        var userVm = UserVm.ConvertToVm(user, roles, divisions);
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, userVm);
        return res;
    }

    [Function("Auth_Me")]
    public Task<HttpResponseData> Me(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "auth/me")] HttpRequestData req)
    {
        var res = req.CreateResponse(HttpStatusCode.Unauthorized);
        AddCorsHeaders(res);
        return Task.FromResult(res);
    }

    [Function("Auth_Logout")]
    public Task<HttpResponseData> Logout(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "auth/logout")] HttpRequestData req)
    {
        var res = req.CreateResponse(HttpStatusCode.NoContent);
        AddCorsHeaders(res);
        return Task.FromResult(res);
    }
}
