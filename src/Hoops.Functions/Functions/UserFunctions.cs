using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Functions.Functions;

public class UserFunctions
{
    private readonly hoopsContext _context;

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    private static async Task WriteJsonAsync<T>(HttpResponseData response, T value)
    {
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        await JsonSerializer.SerializeAsync(response.Body, value, JsonOptions);
    }

    public UserFunctions(hoopsContext context)
    {
        _context = context;
    }

    [Function("User_GetAll")]
    public async Task<HttpResponseData> GetAll(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "user")] HttpRequestData req)
    {
        var list = await _context.Users.ToListAsync();
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, list);
        return res;
    }

    [Function("User_GetById")]
    public async Task<HttpResponseData> GetById(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "user/{id:int}")] HttpRequestData req,
        int id)
    {
        var entity = await _context.Users.FindAsync(id);
        if (entity is null) return req.CreateResponse(HttpStatusCode.NotFound);
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, entity);
        return res;
    }

    [Function("User_Put")]
    public async Task<HttpResponseData> Put(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "user/{id:int}")] HttpRequestData req,
        int id)
    {
        var body = await JsonSerializer.DeserializeAsync<User>(req.Body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        if (body is null || id != body.UserId)
        {
            return req.CreateResponse(HttpStatusCode.BadRequest);
        }
        _context.Entry(body).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            var exists = await _context.Users.AnyAsync(e => e.UserId == id);
            if (!exists) return req.CreateResponse(HttpStatusCode.NotFound);
            throw;
        }
        return req.CreateResponse(HttpStatusCode.NoContent);
    }

    [Function("User_Post")]
    public async Task<HttpResponseData> Post(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "user")] HttpRequestData req)
    {
        var body = await JsonSerializer.DeserializeAsync<User>(req.Body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        if (body is null)
        {
            return req.CreateResponse(HttpStatusCode.BadRequest);
        }
        await _context.Users.AddAsync(body);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            var exists = await _context.Users.AnyAsync(e => e.UserId == body.UserId);
            if (exists) return req.CreateResponse(HttpStatusCode.Conflict);
            throw;
        }
        var res = req.CreateResponse(HttpStatusCode.Created);
        await WriteJsonAsync(res, body);
        return res;
    }

    [Function("User_Delete")]
    public async Task<HttpResponseData> Delete(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "user/{id:int}")] HttpRequestData req,
        int id)
    {
        var entity = await _context.Users.FindAsync(id);
        if (entity is null) return req.CreateResponse(HttpStatusCode.NotFound);
        _context.Users.Remove(entity);
        await _context.SaveChangesAsync();
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, entity);
        return res;
    }

    // Legacy: GET api/User/login/{userName}/{password}
    [Function("User_Login_Legacy")]
    public async Task<HttpResponseData> LoginLegacy(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "user/login/{userName}/{password}")] HttpRequestData req,
        string userName, string password)
    {
        var repo = new UserRepository(_context);
        var user = repo.GetUser(userName, password);
        if (user == null)
        {
            var bad = req.CreateResponse(HttpStatusCode.BadRequest);
            await bad.WriteStringAsync("Invalid username or password.");
            return bad;
        }
        var roles = _context.Roles.Where(s => s.UserId == user.UserId).Select(s => s.ScreenName);
        var divisions = _context.Divisions.Where(d => d.DirectorId == user.PersonId);
        var userVm = UserVm.ConvertToVm(user, roles, divisions);
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, userVm);
        return res;
    }
}
