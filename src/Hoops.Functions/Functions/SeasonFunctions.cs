using System.Net;
using System.Text.Json;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Functions.Mapping;
using Hoops.Functions.Models;
using Hoops.Functions.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Configuration;

namespace Hoops.Functions.Functions;

public class SeasonFunctions
{
    private readonly ILogger<SeasonFunctions> _logger;
    private readonly ISeasonService _seasonService;
    private readonly ISeasonRepository _seasonRepository;
    private readonly IConfiguration _configuration;

    public SeasonFunctions(ILogger<SeasonFunctions> logger, ISeasonService seasonService, ISeasonRepository seasonRepository, IConfiguration configuration)
    {
        _logger = logger;
        _seasonService = seasonService;
        _seasonRepository = seasonRepository;
        _configuration = configuration;
    }

    [Function("Season_GetAll")]
    [OpenApiOperation(operationId: "Season_GetAll", tags: new[] { "Season" }, Summary = "Get all seasons", Description = "Returns all seasons for a company.")]
    [OpenApiParameter(name: "companyId", In = ParameterLocation.Path, Required = false, Type = typeof(int), Summary = "Company identifier (optional; defaults to 1)")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(IEnumerable<SeasonDto>), Description = "List of seasons.")]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.NotFound, Description = "No seasons found.")]
    public async Task<HttpResponseData> GetAll(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Season/GetAll/{companyId:int?}")] HttpRequestData req,
        int? companyId)
    {
        var defaultCompanyId = _configuration.GetValue<int?>("CompanySettings:DefaultCompanyId") ?? 1;
        var cid = companyId ?? defaultCompanyId;
        var seasons = await _seasonService.GetAllSeasonsAsync(cid);
        var res = req.CreateResponse();
        if (seasons == null || !seasons.Any())
        {
            res.StatusCode = HttpStatusCode.NotFound;
            return res;
        }
        var dto = seasons.Select(EntityMapper.ToDto);
        await ResponseUtils.WriteJsonAsync(res, dto);
        return res;
    }

    [Function("Season_GetCurrentSeason")]
    [OpenApiOperation(operationId: "Season_GetCurrentSeason", tags: new[] { "Season" }, Summary = "Get current season", Description = "Returns the current active season for a company.")]
    [OpenApiParameter(name: "companyId", In = ParameterLocation.Path, Required = false, Type = typeof(int), Summary = "Company identifier (optional; defaults to 1)")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(SeasonDto), Description = "Current season.")]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.NotFound, Description = "Current season not found.")]
    public async Task<HttpResponseData> GetCurrentSeason(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Season/GetCurrentSeason/{companyId:int?}")] HttpRequestData req,
        int? companyId)
    {
        try
        {
            var defaultCompanyId = _configuration.GetValue<int?>("CompanySettings:DefaultCompanyId") ?? 1;
            var cid = companyId ?? defaultCompanyId;
            var season = await _seasonService.GetCurrentSeasonAsync(cid);
            if (season == null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }
            var res = req.CreateResponse(HttpStatusCode.OK);
            await ResponseUtils.WriteJsonAsync(res, EntityMapper.ToDto(season));
            return res;
        }
        catch (InvalidOperationException)
        {
            return req.CreateResponse(HttpStatusCode.NotFound);
        }
    }

    [Function("Season_GetById")]
    [OpenApiOperation(operationId: "Season_GetById", tags: new[] { "Season" }, Summary = "Get season by id", Description = "Returns a season by its identifier.")]
    [OpenApiParameter(name: "id", In = Microsoft.OpenApi.Models.ParameterLocation.Path, Required = true, Type = typeof(int), Summary = "Season identifier")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(SeasonDto), Description = "Season detail.")]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.NotFound, Description = "Season not found.")]
    public async Task<HttpResponseData> GetById(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Season/{id:int}")] HttpRequestData req,
        int id)
    {
        var season = await _seasonRepository.GetByIdAsync(id);
        if (season == null)
        {
            return req.CreateResponse(HttpStatusCode.NotFound);
        }
        var res = req.CreateResponse(HttpStatusCode.OK);
        await ResponseUtils.WriteJsonAsync(res, EntityMapper.ToDto(season));
        return res;
    }

    [Function("Season_Put")]
    [OpenApiOperation(operationId: "Season_Put", tags: new[] { "Season" }, Summary = "Update a season", Description = "Updates an existing season by id.")]
    [OpenApiParameter(name: "id", In = Microsoft.OpenApi.Models.ParameterLocation.Path, Required = true, Type = typeof(int), Summary = "Season identifier")]
    [OpenApiRequestBody(contentType: "application/json", bodyType: typeof(SeasonDto), Required = true, Description = "Season payload")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(SeasonDto), Description = "Updated season.")]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.BadRequest, Description = "Invalid payload.")]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.NotFound, Description = "Season not found.")]
    public async Task<HttpResponseData> Put(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "Season/{id:int}")] HttpRequestData req,
        int id)
    {
        var seasonDto = await JsonSerializer.DeserializeAsync<SeasonDto>(req.Body, ResponseUtils.JsonOptions);
        if (seasonDto == null || id != seasonDto.SeasonId)
            return req.CreateResponse(HttpStatusCode.BadRequest);

        var season = EntityMapper.ToEntity(seasonDto);
        var updated = await _seasonRepository.UpdateAsync(season);
        if (!updated)
            return req.CreateResponse(HttpStatusCode.NotFound);

        await _seasonRepository.SaveChangesAsync();
        var res = req.CreateResponse(HttpStatusCode.OK);
        await ResponseUtils.WriteJsonAsync(res, EntityMapper.ToDto(season));
        return res;
    }

    [Function("Season_Post")]
    [OpenApiOperation(operationId: "Season_Post", tags: new[] { "Season" }, Summary = "Create a season", Description = "Creates a new season.")]
    [OpenApiRequestBody(contentType: "application/json", bodyType: typeof(SeasonDto), Required = true, Description = "Season payload")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(SeasonDto), Description = "Created season.")]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.BadRequest, Description = "Invalid payload.")]
    public async Task<HttpResponseData> Post(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Season")] HttpRequestData req)
    {
        var seasonDto = await JsonSerializer.DeserializeAsync<SeasonDto>(req.Body, ResponseUtils.JsonOptions);
        if (seasonDto == null)
            return req.CreateResponse(HttpStatusCode.BadRequest);

        var season = EntityMapper.ToEntity(seasonDto);
        var created = await _seasonRepository.InsertAsync(season);
        await _seasonRepository.SaveChangesAsync();
        var res = req.CreateResponse(HttpStatusCode.OK);
        await ResponseUtils.WriteJsonAsync(res, EntityMapper.ToDto(created));
        return res;
    }

    [Function("Season_Delete")]
    [OpenApiOperation(operationId: "Season_Delete", tags: new[] { "Season" }, Summary = "Delete a season", Description = "Deletes a season by id.")]
    [OpenApiParameter(name: "id", In = Microsoft.OpenApi.Models.ParameterLocation.Path, Required = true, Type = typeof(int), Summary = "Season identifier")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(SeasonDto), Description = "Deleted season.")]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.NotFound, Description = "Season not found.")]
    public async Task<HttpResponseData> Delete(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "Season/{id:int}")] HttpRequestData req,
        int id)
    {
        var season = await _seasonRepository.GetByIdAsync(id);
        if (season == null)
            return req.CreateResponse(HttpStatusCode.NotFound);

        await _seasonRepository.DeleteAsync(id);
        await _seasonRepository.SaveChangesAsync();
        var res = req.CreateResponse(HttpStatusCode.OK);
        await ResponseUtils.WriteJsonAsync(res, EntityMapper.ToDto(season));
        return res;
    }
}
