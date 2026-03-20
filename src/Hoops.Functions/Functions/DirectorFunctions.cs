using System.IO;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Functions.Utils;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Hoops.Functions.Functions
{
    public class DirectorFunctions
    {
        private readonly IDirectorRepository _repository;
        private readonly ILogger<DirectorFunctions> _logger;
        private const int CompanyId = 1;
        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        };

        public DirectorFunctions(IDirectorRepository repository, ILogger<DirectorFunctions> logger)
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

        [Function("GetDirectors")]
        public HttpResponseData Get(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Director")] HttpRequestData req)
        {
            var list = _repository.GetAll(CompanyId) ?? [];
            var resp = req.CreateResponse();
            WriteJsonAsync(resp, list).GetAwaiter().GetResult();
            return resp;
        }

        [Function("GetDirectorVolunteers")]
        public HttpResponseData GetDirectorVolunteers(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Director/volunteers")] HttpRequestData req)
        {
            var volunteers = _repository.GetDirectorVolunteers(CompanyId) ?? [];
            var resp = req.CreateResponse();
            WriteJsonAsync(resp, volunteers).GetAwaiter().GetResult();
            return resp;
        }

        [Function("GetDirectorById")]
        public async Task<HttpResponseData> GetDirectorById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Director/{id:int}")] HttpRequestData req,
            int id)
        {
            var director = await _repository.FindByAsync(id);
            if (director == null)
                return req.CreateResponse(HttpStatusCode.NotFound);

            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, director);
            return resp;
        }

        [Function("PostDirector")]
        [RequireAuth]
        public async Task<HttpResponseData> PostDirector(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Director")] HttpRequestData req,
            FunctionContext context)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            Director? body;
            using (var sr = new StreamReader(req.Body))
            {
                var json = await sr.ReadToEndAsync();
                body = JsonSerializer.Deserialize<Director>(json, JsonOptions);
            }
            if (body == null)
                return req.CreateResponse(HttpStatusCode.BadRequest);

            var created = _repository.Insert(body);
            await _repository.SaveChangesAsync();

            var resp = req.CreateResponse(HttpStatusCode.Created);
            await WriteJsonAsync(resp, created, HttpStatusCode.Created);
            return resp;
        }

        [Function("PutDirector")]
        [RequireAuth]
        public async Task<HttpResponseData> PutDirector(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "Director/{id:int}")] HttpRequestData req,
            int id,
            FunctionContext context)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            Director? body;
            using (var sr = new StreamReader(req.Body))
            {
                var json = await sr.ReadToEndAsync();
                body = JsonSerializer.Deserialize<Director>(json, JsonOptions);
            }
            if (body == null || id != body.DirectorId)
                return req.CreateResponse(HttpStatusCode.BadRequest);

            _repository.Update(body);
            await _repository.SaveChangesAsync();

            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, body);
            return resp;
        }

        [Function("DeleteDirector")]
        [RequireAuth]
        public async Task<HttpResponseData> DeleteDirector(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "Director/{id:int}")] HttpRequestData req,
            int id,
            FunctionContext context)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            var director = await _repository.FindByAsync(id);
            if (director == null)
                return req.CreateResponse(HttpStatusCode.NotFound);

            _repository.Delete(director);
            await _repository.SaveChangesAsync();

            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, director);
            return resp;
        }
    }
}
