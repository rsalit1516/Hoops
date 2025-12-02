using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Hoops.Core.Interface;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Hoops.Functions.Functions;

public class LocationFunctions
{
    private readonly ILocationRepository _repository;

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

    public LocationFunctions(ILocationRepository repository)
    {
        _repository = repository;
    }

    [Function("Location_Get")]
    public async Task<HttpResponseData> GetAll(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "location")] HttpRequestData req)
    {
        var items = await _repository.GetAll();
        var res = req.CreateResponse(HttpStatusCode.OK);
        await WriteJsonAsync(res, items);
        return res;
    }
}
