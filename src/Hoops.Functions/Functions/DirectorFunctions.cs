using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Hoops.Functions.Functions
{
    public class DirectorFunctions
    {
        private readonly IDirectorRepository _repository;
        private const int CompanyId = 1;
        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        };

        public DirectorFunctions(IDirectorRepository repository)
        {
            _repository = repository;
        }

        private static async Task WriteJsonAsync<T>(HttpResponseData resp, T payload, HttpStatusCode status = HttpStatusCode.OK)
        {
            resp.StatusCode = status;
            resp.Headers.Add("Content-Type", "application/json; charset=utf-8");
            await System.Text.Json.JsonSerializer.SerializeAsync(resp.Body, payload!, JsonOptions);
        }

        [Function("GetDirectors")]
        public HttpResponseData Get(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Director")] HttpRequestData req)
        {
            var list = _repository.GetAll(CompanyId) ?? [];
            var resp = req.CreateResponse();
            WriteJsonAsync(resp, list).GetAwaiter().GetResult();
            return resp;
        }
    }
}
