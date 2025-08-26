using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Hoops.Functions.Functions
{
    public class DivisionFunctions
    {
        private readonly IDivisionRepository _repository;
        private readonly ISeasonService _seasonService;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };

        public DivisionFunctions(IDivisionRepository repository, ISeasonService seasonService)
        {
            _repository = repository;
            _seasonService = seasonService;
        }

        private static async Task WriteJsonAsync<T>(HttpResponseData resp, T payload, HttpStatusCode status = HttpStatusCode.OK)
        {
            resp.StatusCode = status;
            resp.Headers.Add("Content-Type", "application/json; charset=utf-8");
            await JsonSerializer.SerializeAsync(resp.Body, payload, JsonOptions);
        }

        [Function("GetDivisions")]
        public async Task<HttpResponseData> GetDivisions(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Division")] HttpRequestData req)
        {
            var divisions = await _repository.GetAllAsync();
            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, divisions);
            return resp;
        }

        [Function("GetDivisionById")]
        public async Task<HttpResponseData> GetDivisionById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Division/{id:int}")] HttpRequestData req,
            int id)
        {
            var division = await _repository.FindByAsync(id);
            if (division == null)
            {
                var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                return notFound;
            }
            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, division);
            return resp;
        }

        [Function("PutDivision")]
        public async Task<HttpResponseData> PutDivision(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = "Division/{id:int}")] HttpRequestData req,
            int id)
        {
            Division? body;
            using (var sr = new StreamReader(req.Body))
            {
                var json = await sr.ReadToEndAsync();
                body = JsonSerializer.Deserialize<Division>(json, JsonOptions);
            }
            if (body == null)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }
            if (id != body.DivisionId)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }

            if (body.DirectorId.HasValue && body.DirectorId.Value == 0)
            {
                body.DirectorId = null;
            }
            if (body.CoDirectorId.HasValue && body.CoDirectorId.Value == 0)
            {
                body.CoDirectorId = null;
            }

            try
            {
                _repository.Update(body);
                _repository.SaveChanges();
                var resp = req.CreateResponse();
                await WriteJsonAsync(resp, body);
                return resp;
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                var conflict = req.CreateResponse(HttpStatusCode.Conflict);
                await WriteJsonAsync(conflict, new
                {
                    title = "Failed to update division",
                    detail = ex.InnerException?.Message ?? ex.Message,
                    status = (int)HttpStatusCode.Conflict
                }, HttpStatusCode.Conflict);
                return conflict;
            }
            catch (Exception ex)
            {
                // Check existence
                var exists = await _repository.FindByAsync(id) != null;
                if (!exists)
                {
                    return req.CreateResponse(HttpStatusCode.NotFound);
                }
                var error = req.CreateResponse(HttpStatusCode.InternalServerError);
                await WriteJsonAsync(error, new
                {
                    title = "Unexpected error updating division",
                    detail = ex.Message,
                    status = (int)HttpStatusCode.InternalServerError
                }, HttpStatusCode.InternalServerError);
                return error;
            }
        }

        [Function("PostDivision")]
        public async Task<HttpResponseData> PostDivision(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "Division")] HttpRequestData req)
        {
            Division? body;
            using (var sr = new StreamReader(req.Body))
            {
                var json = await sr.ReadToEndAsync();
                body = JsonSerializer.Deserialize<Division>(json, JsonOptions);
            }
            if (body == null)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }

            if (body.DirectorId.HasValue && body.DirectorId.Value == 0)
            {
                body.DirectorId = null;
            }
            if (body.CoDirectorId.HasValue && body.CoDirectorId.Value == 0)
            {
                body.CoDirectorId = null;
            }

            await _repository.InsertAsync(body);
            await _repository.SaveChangesAsync();

            var created = req.CreateResponse(HttpStatusCode.Created);
            await WriteJsonAsync(created, body, HttpStatusCode.Created);
            return created;
        }

        [Function("DeleteDivision")]
        public async Task<HttpResponseData> DeleteDivision(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "Division/{id:int}")] HttpRequestData req,
            int id)
        {
            // Verify existence
            try
            {
                var _ = await _repository.FindByAsync(id);
            }
            catch
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            try
            {
                await _repository.DeleteAsync(id);
                return req.CreateResponse(HttpStatusCode.OK);
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException)
            {
                var conflict = req.CreateResponse(HttpStatusCode.Conflict);
                await WriteJsonAsync(conflict, new
                {
                    title = "Cannot delete division",
                    detail = "The division has related records (e.g., teams or games). Remove dependencies first.",
                    status = (int)HttpStatusCode.Conflict
                }, HttpStatusCode.Conflict);
                return conflict;
            }
            catch (Exception ex)
            {
                var error = req.CreateResponse(HttpStatusCode.InternalServerError);
                await WriteJsonAsync(error, new
                {
                    title = "Delete failed",
                    detail = ex.Message,
                    status = (int)HttpStatusCode.InternalServerError
                }, HttpStatusCode.InternalServerError);
                return error;
            }
        }

        [Function("GetSeasonDivisions")]
        public async Task<HttpResponseData> GetSeasonDivisions(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Division/GetSeasonDivisions/{seasonId:int}")] HttpRequestData req,
            int seasonId)
        {
            var divisions = await _repository.GetSeasonDivisionsAsync(seasonId) ?? Enumerable.Empty<Division>();
            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, divisions);
            return resp;
        }
    }
}
