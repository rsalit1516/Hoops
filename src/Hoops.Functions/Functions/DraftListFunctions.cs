using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Hoops.Functions.Functions
{
    public class DraftListFunctions
    {
        private readonly IPlayerRepository _playerRepository;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };

        public DraftListFunctions(IPlayerRepository playerRepository)
        {
            _playerRepository = playerRepository;
        }

        private static async Task WriteJsonAsync<T>(HttpResponseData resp, T payload, HttpStatusCode status = HttpStatusCode.OK)
        {
            resp.StatusCode = status;
            resp.Headers.Add("Content-Type", "application/json; charset=utf-8");
            await JsonSerializer.SerializeAsync(resp.Body, payload!, JsonOptions);
        }

        [Function("GetDraftList")]
        public async Task<HttpResponseData> GetDraftList(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "DraftList/{seasonId:int}/{divisionId:int?}")] HttpRequestData req,
            int seasonId,
            int? divisionId = null)
        {
            try
            {
                var draftList = _playerRepository.GetDraftListPlayers(seasonId, divisionId);
                var resp = req.CreateResponse();
                await WriteJsonAsync(resp, draftList);
                return resp;
            }
            catch (Exception ex)
            {
                var errorResp = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResp.WriteStringAsync($"Error retrieving draft list: {ex.Message}");
                return errorResp;
            }
        }
    }
}
