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
    private readonly UserRepository _userRepository;

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
        _userRepository = new UserRepository(context);
    }

    [Function("User_GetAll")]
    public async Task<HttpResponseData> GetAll(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "user")] HttpRequestData req)
    {
        try
        {
            var list = await _userRepository.GetAllUsersAsync();
            var res = req.CreateResponse(HttpStatusCode.OK);
            await WriteJsonAsync(res, list);
            return res;
        }
        catch (Exception ex)
        {
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync($"Error retrieving users: {ex.Message}");
            return errorResponse;
        }
    }

    [Function("User_GetById")]
    public async Task<HttpResponseData> GetById(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "user/{id:int}")] HttpRequestData req,
        int id)
    {
        try
        {
            var entity = await _userRepository.GetUserByIdAsync(id);
            if (entity is null) return req.CreateResponse(HttpStatusCode.NotFound);
            var res = req.CreateResponse(HttpStatusCode.OK);
            await WriteJsonAsync(res, entity);
            return res;
        }
        catch (Exception ex)
        {
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync($"Error retrieving user {id}: {ex.Message}");
            return errorResponse;
        }
    }

    [Function("User_Put")]
    public async Task<HttpResponseData> Put(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "user/{id:int}")] HttpRequestData req,
        int id)
    {
        try
        {
            var body = await JsonSerializer.DeserializeAsync<User>(req.Body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            if (body is null || id != body.UserId)
            {
                var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequest.WriteStringAsync("Invalid user data or ID mismatch");
                return badRequest;
            }

            // Check if user exists
            var existingUser = await _userRepository.GetUserByIdAsync(id);
            if (existingUser is null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            await _userRepository.UpdateUserAsync(body);
            return req.CreateResponse(HttpStatusCode.NoContent);
        }
        catch (DbUpdateConcurrencyException)
        {
            var exists = await _userRepository.UserExistsAsync(id);
            if (!exists) return req.CreateResponse(HttpStatusCode.NotFound);

            var conflictResponse = req.CreateResponse(HttpStatusCode.Conflict);
            await conflictResponse.WriteStringAsync("User was modified by another process");
            return conflictResponse;
        }
        catch (Exception ex)
        {
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync($"Error updating user {id}: {ex.Message}");
            return errorResponse;
        }
    }

    [Function("User_Post")]
    public async Task<HttpResponseData> Post(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "user")] HttpRequestData req)
    {
        try
        {
            var body = await JsonSerializer.DeserializeAsync<User>(req.Body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            if (body is null)
            {
                var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequest.WriteStringAsync("Invalid user data");
                return badRequest;
            }

            // Use repository pattern for insertion - it handles auto-increment properly
            var createdUser = await _userRepository.InsertUserAsync(body);

            var res = req.CreateResponse(HttpStatusCode.Created);
            await WriteJsonAsync(res, createdUser);
            return res;
        }
        catch (DbUpdateException ex)
        {
            var errorResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            await errorResponse.WriteStringAsync($"Error creating user: {ex.Message}");
            return errorResponse;
        }
        catch (Exception ex)
        {
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync($"Unexpected error creating user: {ex.Message}");
            return errorResponse;
        }
    }

    [Function("User_Delete")]
    public async Task<HttpResponseData> Delete(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "user/{id:int}")] HttpRequestData req,
        int id)
    {
        try
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user is null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            await _userRepository.DeleteUserAsync(id);

            var res = req.CreateResponse(HttpStatusCode.OK);
            await WriteJsonAsync(res, user);
            return res;
        }
        catch (Exception ex)
        {
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync($"Error deleting user {id}: {ex.Message}");
            return errorResponse;
        }
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
