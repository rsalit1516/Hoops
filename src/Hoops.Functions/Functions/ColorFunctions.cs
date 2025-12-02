using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Hoops.Functions.Functions;

public class ColorFunctions
{
    private readonly IColorRepository _repository;

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

    public ColorFunctions(IColorRepository repository)
    {
        _repository = repository;
    }

    [Function("Color_Get")]
    public async Task<HttpResponseData> Get(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "color")] HttpRequestData req)
    {
        var items = _repository
            .GetAll()
            .Where(c => c.Discontinued == false)
            .OrderBy(c => c.ColorName)
            .ToList();
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, items);
        return res;
    }
}
