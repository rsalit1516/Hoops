using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Hoops.Functions.Functions
{
    public class DraftReportFunctions
    {
        private readonly IPlayerRepository _playerRepository;
        private readonly ILogger<DraftReportFunctions> _logger;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };

        public DraftReportFunctions(IPlayerRepository playerRepository, ILogger<DraftReportFunctions> logger)
        {
            _playerRepository = playerRepository;
            _logger = logger;
        }

        [Function("GetDraftReport")]
        public async Task<HttpResponseData> GetDraftReport(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "DraftReport/{seasonId:int}/{divisionId:int?}")] HttpRequestData req,
            int seasonId,
            int? divisionId = null)
        {
            try
            {
                var players = _playerRepository.GetDraftReportPlayers(seasonId, divisionId);
                var resp = req.CreateResponse(HttpStatusCode.OK);
                resp.Headers.Add("Content-Type", "application/json; charset=utf-8");
                await JsonSerializer.SerializeAsync(resp.Body, players, JsonOptions);
                return resp;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving draft report for season {SeasonId}", seasonId);
                var errorResp = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResp.WriteStringAsync($"Error retrieving draft report: {ex.Message}");
                return errorResp;
            }
        }
    }
}
