using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Hoops.Functions.Utils;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Hoops.Functions.Functions;

public class AuthFunctions
{
    private readonly hoopsContext _context;

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
            await ResponseUtils.WriteJsonAsync(res, userVm);
            return res;
        }
        catch (Exception)
        {
            // UserRepository throws exception for invalid credentials
            // Return 401 Unauthorized for authentication failures
            return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.Unauthorized);
        }
    }

    [Function("Auth_Me")]
    public Task<HttpResponseData> Me(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "auth/me")] HttpRequestData req)
    {
        var res = ResponseUtils.CreateErrorResponse(req, HttpStatusCode.Unauthorized);
        return Task.FromResult(res);
    }

    [Function("Auth_Logout")]
    public Task<HttpResponseData> Logout(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "auth/logout")] HttpRequestData req)
    {
        var res = ResponseUtils.CreateResponse(req, HttpStatusCode.NoContent);
        return Task.FromResult(res);
    }
}
