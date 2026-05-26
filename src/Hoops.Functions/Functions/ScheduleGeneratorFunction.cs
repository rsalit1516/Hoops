using System.Net;
using System.Text.Json;
using Hoops.Core.Interface;
using Hoops.Core.ViewModels;
using Hoops.Functions.Utils;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Hoops.Functions.Functions;

public class ScheduleGeneratorFunction
{
    private readonly IScheduleGeneratorService _schedulerService;
    private readonly ILogger<ScheduleGeneratorFunction> _logger;

    public ScheduleGeneratorFunction(IScheduleGeneratorService schedulerService, ILogger<ScheduleGeneratorFunction> logger)
    {
        _schedulerService = schedulerService;
        _logger = logger;
    }

    [Function("ScheduleGenerator_Preview")]
    public async Task<HttpResponseData> Preview(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "schedule-generator/preview")] HttpRequestData req,
        FunctionContext context)
    {
        var authError = context.CheckAuthentication(req, _logger);
        if (authError != null) return authError;

        ScheduleGeneratorRequest? request;
        try
        {
            request = await JsonSerializer.DeserializeAsync<ScheduleGeneratorRequest>(
                req.Body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "Invalid request body for schedule preview");
            return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.BadRequest, "Invalid request body.");
        }

        if (request == null)
            return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.BadRequest, "Request body is required.");

        ScheduleGeneratorResult result;
        try
        {
            result = await _schedulerService.PreviewAsync(request);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception in PreviewAsync");
            var errRes = ResponseUtils.CreateResponse(req, HttpStatusCode.InternalServerError);
            await ResponseUtils.WriteJsonAsync(errRes, new ScheduleGeneratorResult
            {
                Success = false,
                ErrorMessage = $"Internal error: {ex.Message}",
            }, HttpStatusCode.InternalServerError);
            return errRes;
        }

        var statusCode = result.Success ? HttpStatusCode.OK : HttpStatusCode.UnprocessableEntity;
        var res = ResponseUtils.CreateResponse(req, statusCode);
        await ResponseUtils.WriteJsonAsync(res, result, statusCode);
        return res;
    }

    [Function("ScheduleGenerator_Commit")]
    public async Task<HttpResponseData> Commit(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "schedule-generator/commit")] HttpRequestData req,
        FunctionContext context)
    {
        var authError = context.CheckAuthentication(req, _logger);
        if (authError != null) return authError;

        ScheduleCommitRequest? request;
        try
        {
            request = await JsonSerializer.DeserializeAsync<ScheduleCommitRequest>(
                req.Body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "Invalid request body for schedule commit");
            return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.BadRequest, "Invalid request body.");
        }

        if (request == null || request.Games == null || request.Games.Count == 0)
            return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.BadRequest, "Request must include games to commit.");

        _logger.LogInformation("Committing {Count} games for season {SeasonId}", request.Games.Count, request.SeasonId);

        ScheduleCommitResult result;
        try
        {
            result = await _schedulerService.CommitAsync(request);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception in CommitAsync");
            var errRes = ResponseUtils.CreateResponse(req, HttpStatusCode.InternalServerError);
            await ResponseUtils.WriteJsonAsync(errRes, new ScheduleCommitResult
            {
                Errors = new List<string> { $"Internal error: {ex.Message}" },
            }, HttpStatusCode.InternalServerError);
            return errRes;
        }

        var statusCode = result.Errors.Count == 0 ? HttpStatusCode.OK : HttpStatusCode.MultiStatus;
        var res = ResponseUtils.CreateResponse(req, statusCode);
        await ResponseUtils.WriteJsonAsync(res, result, statusCode);
        return res;
    }
}
