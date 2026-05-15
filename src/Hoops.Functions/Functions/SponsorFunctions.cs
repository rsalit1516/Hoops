using System.Net;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Functions.Utils;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Hoops.Functions.Functions
{
    public class SponsorFunctions
    {
        private readonly ISponsorRepository _repository;
        private readonly ISeasonService _seasonService;
        private readonly ILogger<SponsorFunctions> _logger;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        };

        public SponsorFunctions(ISponsorRepository repository, ISeasonService seasonService, ILogger<SponsorFunctions> logger)
        {
            _repository = repository;
            _seasonService = seasonService;
            _logger = logger;
        }

        [Function("GetSeasonSponsors")]
        public async Task<HttpResponseData> GetSeasonSponsors(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Sponsor/GetSeasonSponsors/{seasonId:int}")] HttpRequestData req,
            int seasonId,
            CancellationToken cancellationToken)
        {
            if (seasonId <= 0)
                return req.CreateResponse(HttpStatusCode.BadRequest);

            var sponsors = await _repository.GetSeasonSponsorsAsync(seasonId);
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, sponsors);
            return resp;
        }

        [Function("GetCurrentSeasonSponsors")]
        public async Task<HttpResponseData> GetCurrentSeasonSponsors(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Sponsor")] HttpRequestData req,
            CancellationToken cancellationToken)
        {
            const int companyId = 1;
            var current = await _seasonService.GetCurrentSeasonAsync(companyId);
            if (current == null)
                return req.CreateResponse(HttpStatusCode.NotFound);

            var sponsors = await _repository.GetSeasonSponsorsAsync(current.SeasonId);
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, sponsors);
            return resp;
        }

        [Function("Sponsor_GetByProfile")]
        [RequireAuth]
        public async Task<HttpResponseData> GetSponsorsByProfile(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Sponsor/ByProfile/{sponsorProfileId:int}")] HttpRequestData req,
            int sponsorProfileId,
            FunctionContext context,
            CancellationToken cancellationToken)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            var seasons = await _repository.GetByProfileIdAsync(sponsorProfileId);
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, seasons);
            return resp;
        }

        [Function("Sponsor_Create")]
        [RequireAuth]
        public async Task<HttpResponseData> CreateSponsor(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Sponsor")] HttpRequestData req,
            FunctionContext context,
            CancellationToken cancellationToken)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            Sponsor? sponsor;
            try
            {
                sponsor = await JsonSerializer.DeserializeAsync<Sponsor>(req.Body, JsonOptions, cancellationToken);
            }
            catch (JsonException ex)
            {
                _logger.LogWarning(ex, "Invalid JSON body for Sponsor create");
                return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.BadRequest, "Invalid request body");
            }

            if (sponsor == null)
                return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.BadRequest, "Missing request body");

            var created = await _repository.CreateSeasonEntryAsync(sponsor);
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, created, HttpStatusCode.Created);
            return resp;
        }

        [Function("Sponsor_Update")]
        [RequireAuth]
        public async Task<HttpResponseData> UpdateSponsor(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "Sponsor/{id:int}")] HttpRequestData req,
            int id,
            FunctionContext context,
            CancellationToken cancellationToken)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            Sponsor? sponsor;
            try
            {
                sponsor = await JsonSerializer.DeserializeAsync<Sponsor>(req.Body, JsonOptions, cancellationToken);
            }
            catch (JsonException ex)
            {
                _logger.LogWarning(ex, "Invalid JSON body for Sponsor update");
                return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.BadRequest, "Invalid request body");
            }

            if (sponsor == null)
                return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.BadRequest, "Missing request body");

            sponsor.SponsorId = id;
            var updated = await _repository.UpdateSeasonEntryAsync(sponsor);
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, updated);
            return resp;
        }
    }
}
