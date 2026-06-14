using System.IO;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Functions.Utils;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Hoops.Functions.Functions;

public class ColorFunctions
{
    private readonly IColorRepository _repository;
    private readonly ILogger<ColorFunctions> _logger;
    private const int CompanyId = 1;

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        PropertyNameCaseInsensitive = true
    };

    private static async Task WriteJsonAsync<T>(HttpResponseData response, T value, HttpStatusCode status = HttpStatusCode.OK)
    {
        response.StatusCode = status;
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        await JsonSerializer.SerializeAsync(response.Body, value, JsonOptions);
    }

    public ColorFunctions(IColorRepository repository, ILogger<ColorFunctions> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    [Function("Color_Get")]
    public async Task<HttpResponseData> Get(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "color")] HttpRequestData req)
    {
        var items = _repository
            .GetAll(CompanyId)
            .Where(c => c.Discontinued != true)
            .OrderBy(c => c.ColorName)
            .ToList();
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, items);
        return res;
    }

    [Function("Color_GetAll")]
    [RequireAuth]
    public async Task<HttpResponseData> GetAll(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "color/all")] HttpRequestData req,
        FunctionContext context)
    {
        var authError = context.CheckAuthentication(req, _logger);
        if (authError != null) return authError;

        var items = _repository
            .GetAll(CompanyId)
            .OrderBy(c => c.ColorName)
            .ToList();
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, items);
        return res;
    }

    [Function("Color_Post")]
    [RequireAuth]
    public async Task<HttpResponseData> Post(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "color")] HttpRequestData req,
        FunctionContext context)
    {
        var authError = context.CheckAuthentication(req, _logger);
        if (authError != null) return authError;

        Color? body;
        using (var sr = new StreamReader(req.Body))
        {
            var json = await sr.ReadToEndAsync();
            body = JsonSerializer.Deserialize<Color>(json, JsonOptions);
        }
        if (body == null)
            return req.CreateResponse(HttpStatusCode.BadRequest);

        body.CompanyId = CompanyId;
        body.Discontinued ??= false;

        var created = _repository.Insert(body);
        await _repository.SaveChangesAsync();

        var res = req.CreateResponse(HttpStatusCode.Created);
        await WriteJsonAsync(res, created, HttpStatusCode.Created);
        return res;
    }

    [Function("Color_Put")]
    [RequireAuth]
    public async Task<HttpResponseData> Put(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "color/{id:int}")] HttpRequestData req,
        int id,
        FunctionContext context)
    {
        var authError = context.CheckAuthentication(req, _logger);
        if (authError != null) return authError;

        Color? body;
        using (var sr = new StreamReader(req.Body))
        {
            var json = await sr.ReadToEndAsync();
            body = JsonSerializer.Deserialize<Color>(json, JsonOptions);
        }
        if (body == null || id != body.ColorId)
            return req.CreateResponse(HttpStatusCode.BadRequest);

        body.CompanyId = CompanyId;

        _repository.Update(body);
        await _repository.SaveChangesAsync();

        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, body);
        return res;
    }
}
