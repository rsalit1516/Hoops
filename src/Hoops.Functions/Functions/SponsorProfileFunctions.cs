using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Hoops.Functions.Functions
{
    public class SponsorProfileFunctions
    {
        private readonly ISponsorProfileRepository _repository;
        private const int DefaultCompanyId = 1;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        };

        public SponsorProfileFunctions(ISponsorProfileRepository repository)
        {
            _repository = repository;
        }

        private static async Task WriteJsonAsync<T>(HttpResponseData resp, T payload, HttpStatusCode status = HttpStatusCode.OK)
        {
            resp.StatusCode = status;
            resp.Headers.Add("Content-Type", "application/json; charset=utf-8");
            await JsonSerializer.SerializeAsync(resp.Body, payload!, JsonOptions);
        }

        [Function("SponsorProfile_Get")]
        public async Task<HttpResponseData> GetSponsorProfiles(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "SponsorProfile")] HttpRequestData req)
        {
            var sponsors = _repository
                .GetAll(DefaultCompanyId)
                .Select(s => new
                {
                    s.SponsorProfileId,
                    s.SpoName,
                    s.ContactName,
                    s.Email,
                    s.Phone
                })
                .ToList();

            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, sponsors);
            return resp;
        }
    }
}
