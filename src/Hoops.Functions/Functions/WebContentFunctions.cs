using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Hoops.Functions.Functions;

public class WebContentFunctions
{
    private readonly ILogger<WebContentFunctions> _logger;
    private readonly IWebContentRepository _repository;

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

    public WebContentFunctions(ILogger<WebContentFunctions> logger, IWebContentRepository repository)
    {
        _logger = logger;
        _repository = repository;
    }

    [Function("WebContent_Get")]
    public async Task<HttpResponseData> GetAll(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "webcontent")] HttpRequestData req)
    {
        var list = await _repository.GetAllAsync(1);
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, list);
        return res;
    }

    [Function("WebContent_GetById")]
    public async Task<HttpResponseData> GetById(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "webcontent/{id:int}")] HttpRequestData req,
        int id)
    {
        // Note: original controller returned Active list here; preserve behavior
        var list = await _repository.GetActiveWebContentAsync(1);
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, list);
        return res;
    }

    [Function("WebContent_GetActive")]
    public async Task<HttpResponseData> GetActive(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "webcontent/getActiveWebContent")] HttpRequestData req)
    {
        var list = await _repository.GetActiveWebContentAsync(1);
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, list);
        return res;
    }

    [Function("WebContent_Put")]
    public async Task<HttpResponseData> Put(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "webcontent")] HttpRequestData req)
    {
        var patch = await JsonSerializer.DeserializeAsync<WebContent>(req.Body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        if (patch is null)
        {
            return req.CreateResponse(HttpStatusCode.BadRequest);
        }
        _repository.Update(patch);
        _repository.SaveChanges();

        var entity = _repository.GetById((int)patch.WebContentId);
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, entity);
        return res;
    }

    [Function("WebContent_PutById")]
    public async Task<HttpResponseData> PutById(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "webcontent/{id:int}")] HttpRequestData req,
        int id)
    {
        var body = await JsonSerializer.DeserializeAsync<WebContent>(req.Body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        if (body is null || id != body.WebContentId)
        {
            return req.CreateResponse(HttpStatusCode.BadRequest);
        }
        _repository.Update(body);
        _repository.SaveChanges();
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, body);
        return res;
    }

    [Function("WebContent_Post")]
    public async Task<HttpResponseData> Post(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "webcontent")] HttpRequestData req)
    {
        var body = await JsonSerializer.DeserializeAsync<WebContent>(req.Body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        if (body is null)
        {
            return req.CreateResponse(HttpStatusCode.BadRequest);
        }
        _logger.LogInformation("Creating WebContent: {Title}", body.Title);
        var content = _repository.Insert(body);
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, content);
        return res;
    }

    [Function("WebContent_Delete")]
    public async Task<HttpResponseData> Delete(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "webcontent/{id:int}")] HttpRequestData req,
        int id)
    {
        var entity = _repository.GetById(id);
        if (entity is null)
        {
            return req.CreateResponse(HttpStatusCode.NotFound);
        }
        await _repository.DeleteAsync(entity.WebContentId);
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, entity);
        return res;
    }
}
