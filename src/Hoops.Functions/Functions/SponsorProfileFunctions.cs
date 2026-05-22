using System.Net;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Functions.Utils;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Hoops.Functions.Functions
{
    public class SponsorProfileFunctions
    {
        private readonly ISponsorProfileRepository _repository;
        private readonly ILogger<SponsorProfileFunctions> _logger;
        private const int DefaultCompanyId = 1;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        };

        public SponsorProfileFunctions(ISponsorProfileRepository repository, ILogger<SponsorProfileFunctions> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        [Function("SponsorProfile_GetAll")]
        [RequireAuth]
        public async Task<HttpResponseData> GetSponsorProfiles(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "SponsorProfile")] HttpRequestData req,
            FunctionContext context,
            CancellationToken cancellationToken)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            var sponsors = await _repository.GetAllWithLastSeasonAsync(DefaultCompanyId);
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, sponsors);
            return resp;
        }

        [Function("SponsorProfile_GetById")]
        [RequireAuth]
        public async Task<HttpResponseData> GetSponsorProfileById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "SponsorProfile/{id:int}")] HttpRequestData req,
            int id,
            FunctionContext context,
            CancellationToken cancellationToken)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            var profile = await _repository.GetDetailByIdAsync(id);
            if (profile == null)
                return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.NotFound);

            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, profile);
            return resp;
        }

        [Function("SponsorProfile_Create")]
        [RequireAuth]
        public async Task<HttpResponseData> CreateSponsorProfile(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "SponsorProfile")] HttpRequestData req,
            FunctionContext context,
            CancellationToken cancellationToken)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            SponsorProfile? profile;
            try
            {
                profile = await JsonSerializer.DeserializeAsync<SponsorProfile>(req.Body, JsonOptions, cancellationToken);
            }
            catch (JsonException ex)
            {
                _logger.LogWarning(ex, "Invalid JSON body for SponsorProfile create");
                return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.BadRequest, "Invalid request body");
            }

            if (profile == null)
                return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.BadRequest, "Missing request body");

            profile.CompanyId = DefaultCompanyId;
            SponsorProfile created;
            try
            {
                created = await _repository.CreateProfileAsync(profile);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database update failed while creating SponsorProfile");
                var detail = ex.InnerException?.Message ?? ex.Message;
                return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.InternalServerError, detail);
            }
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, created, HttpStatusCode.Created);
            return resp;
        }

        [Function("SponsorProfile_Update")]
        [RequireAuth]
        public async Task<HttpResponseData> UpdateSponsorProfile(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "SponsorProfile/{id:int}")] HttpRequestData req,
            int id,
            FunctionContext context,
            CancellationToken cancellationToken)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            SponsorProfile? profile;
            try
            {
                profile = await JsonSerializer.DeserializeAsync<SponsorProfile>(req.Body, JsonOptions, cancellationToken);
            }
            catch (JsonException ex)
            {
                _logger.LogWarning(ex, "Invalid JSON body for SponsorProfile update");
                return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.BadRequest, "Invalid request body");
            }

            if (profile == null)
                return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.BadRequest, "Missing request body");

            profile.SponsorProfileId = id;
            SponsorProfile updated;
            try
            {
                updated = await _repository.UpdateProfileAsync(profile);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database update failed while updating SponsorProfile {SponsorProfileId}", id);
                var detail = ex.InnerException?.Message ?? ex.Message;
                return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.InternalServerError, detail);
            }
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, updated);
            return resp;
        }
    }
}
