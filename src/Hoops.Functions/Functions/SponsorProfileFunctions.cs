using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Functions.Utils;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
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

        private static async Task WriteJsonAsync<T>(HttpResponseData resp, T payload, HttpStatusCode status = HttpStatusCode.OK)
        {
            resp.StatusCode = status;
            resp.Headers.Add("Content-Type", "application/json; charset=utf-8");
            await JsonSerializer.SerializeAsync(resp.Body, payload!, JsonOptions);
        }

        [Function("SponsorProfile_Get")]
        [RequireAuth]
        public async Task<HttpResponseData> GetSponsorProfiles(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "SponsorProfile")] HttpRequestData req,
            FunctionContext context)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            var sponsors = await _repository.GetAllWithLastSeasonAsync(DefaultCompanyId);

            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, sponsors);
            return resp;
        }
    }
}
