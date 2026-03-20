using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Functions.Functions;

public class WebContentTypeFunctions
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

    public WebContentTypeFunctions(hoopsContext context)
    {
        _context = context;
    }

    [Function("WebContentType_Get")]
    public async Task<HttpResponseData> GetAll(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "webcontenttype")] HttpRequestData req)
    {
        var list = await _context.WebContentTypes.ToListAsync();
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, list);
        return res;
    }

    [Function("WebContentType_GetById")]
    public async Task<HttpResponseData> GetById(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "webcontenttype/{id:int}")] HttpRequestData req,
        int id)
    {
        var entity = await _context.WebContentTypes.FindAsync(id);
        if (entity is null)
        {
            return req.CreateResponse(HttpStatusCode.NotFound);
        }
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, entity);
        return res;
    }

    [Function("WebContentType_Put")]
    public async Task<HttpResponseData> Put(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "webcontenttype/{id:int}")] HttpRequestData req,
        int id)
    {
        var body = await JsonSerializer.DeserializeAsync<WebContentType>(req.Body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        if (body is null || id != body.WebContentTypeId)
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
            var exists = await _context.WebContentTypes.AnyAsync(e => e.WebContentTypeId == id);
            if (!exists)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }
            throw;
        }
        return req.CreateResponse(HttpStatusCode.NoContent);
    }

    [Function("WebContentType_Post")]
    public async Task<HttpResponseData> Post(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "webcontenttype")] HttpRequestData req)
    {
        var body = await JsonSerializer.DeserializeAsync<WebContentType>(req.Body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        if (body is null)
        {
            return req.CreateResponse(HttpStatusCode.BadRequest);
        }
        await _context.WebContentTypes.AddAsync(body);
        await _context.SaveChangesAsync();
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, body);
        return res;
    }

    [Function("WebContentType_Delete")]
    public async Task<HttpResponseData> Delete(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "webcontenttype/{id:int}")] HttpRequestData req,
        int id)
    {
        var entity = await _context.WebContentTypes.FindAsync(id);
        if (entity is null)
        {
            return req.CreateResponse(HttpStatusCode.NotFound);
        }
        _context.WebContentTypes.Remove(entity);
        await _context.SaveChangesAsync();
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, entity);
        return res;
    }
}
