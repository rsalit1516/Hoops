using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Hoops.Functions.Functions
{
    public class SponsorFunctions
    {
        private readonly ISponsorRepository _repository;
        private readonly ISeasonService _seasonService;
        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        };

        public SponsorFunctions(ISponsorRepository repository, ISeasonService seasonService)
        {
            _repository = repository;
            _seasonService = seasonService;
        }

        private static async Task WriteJsonAsync<T>(HttpResponseData resp, T payload, HttpStatusCode status = HttpStatusCode.OK)
        {
            resp.StatusCode = status;
            resp.Headers.Add("Content-Type", "application/json; charset=utf-8");
            await System.Text.Json.JsonSerializer.SerializeAsync(resp.Body, payload!, JsonOptions);
        }

        [Function("GetSeasonSponsors")]
        public async Task<HttpResponseData> GetSeasonSponsors(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Sponsor/GetSeasonSponsors/{seasonId:int}")] HttpRequestData req,
            int seasonId)
        {
            if (seasonId <= 0)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }
            var sponsors = await _repository.GetSeasonSponsorsAsync(seasonId);
            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, sponsors);
            return resp;
        }

        [Function("GetCurrentSeasonSponsors")]
        public async Task<HttpResponseData> GetCurrentSeasonSponsors(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Sponsor")] HttpRequestData req)
        {
            // Default companyId = 1 (matches rest of app)
            const int companyId = 1;
            var current = await _seasonService.GetCurrentSeasonAsync(companyId);
            if (current == null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            var sponsors = await _repository.GetSeasonSponsorsAsync(current.SeasonId);
            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, sponsors);
            return resp;
        }
    }
}
