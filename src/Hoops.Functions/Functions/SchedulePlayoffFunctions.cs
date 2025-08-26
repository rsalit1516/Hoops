using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Hoops.Functions.Functions
{
    public class SchedulePlayoffFunctions
    {
        private readonly ISchedulePlayoffRepository _repository;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };

        public SchedulePlayoffFunctions(ISchedulePlayoffRepository repository)
        {
            _repository = repository;
        }

        private static async Task WriteJsonAsync<T>(HttpResponseData resp, T payload, HttpStatusCode status = HttpStatusCode.OK)
        {
            resp.StatusCode = status;
            resp.Headers.Add("Content-Type", "application/json; charset=utf-8");
            await JsonSerializer.SerializeAsync(resp.Body, payload!, JsonOptions);
        }

        [Function("GetSeasonPlayoffGames")]
        public async Task<HttpResponseData> GetSeasonPlayoffGames(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "SchedulePlayoff/GetSeasonPlayoffGames")] HttpRequestData req)
        {
            // Accept seasonId via query string: ?seasonId=123
            var seasonId = 0;
            var query = req.Url.Query; // e.g. ?seasonId=123
            if (!string.IsNullOrWhiteSpace(query))
            {
                var kvps = query.TrimStart('?').Split('&', StringSplitOptions.RemoveEmptyEntries);
                foreach (var kv in kvps)
                {
                    var parts = kv.Split('=');
                    if (parts.Length == 2 && parts[0].Equals("seasonId", StringComparison.OrdinalIgnoreCase))
                    {
                        int.TryParse(Uri.UnescapeDataString(parts[1]), out seasonId);
                    }
                }
            }
            if (seasonId <= 0)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }
            var games = _repository.GetGamesBySeasonId(seasonId) ?? Enumerable.Empty<PlayoffGameVm>();
            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, games.ToList());
            return resp;
        }

        [Function("PostSchedulePlayoff")]
        public async Task<HttpResponseData> PostSchedulePlayoff(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "SchedulePlayoff")] HttpRequestData req)
        {
            SchedulePlayoff? body;
            using (var sr = new StreamReader(req.Body))
            {
                var json = await sr.ReadToEndAsync();
                body = JsonSerializer.Deserialize<SchedulePlayoff>(json, JsonOptions);
            }
            if (body == null)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }
            var created = _repository.Insert(body);
            await _repository.SaveChangesAsync();
            var resp = req.CreateResponse(HttpStatusCode.Created);
            await WriteJsonAsync(resp, created, HttpStatusCode.Created);
            return resp;
        }

        [Function("PutSchedulePlayoffById")]
        public async Task<HttpResponseData> PutSchedulePlayoffById(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = "SchedulePlayoff/by-id/{schedulePlayoffId:int}")] HttpRequestData req,
            int schedulePlayoffId)
        {
            SchedulePlayoff? body;
            using (var sr = new StreamReader(req.Body))
            {
                var json = await sr.ReadToEndAsync();
                body = JsonSerializer.Deserialize<SchedulePlayoff>(json, JsonOptions);
            }
            if (body == null)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }

            // Load existing by PK
            var existing = _repository.GetAll().FirstOrDefault(x => x.SchedulePlayoffId == schedulePlayoffId);
            if (existing == null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            existing.ScheduleNumber = body.ScheduleNumber;
            existing.GameNumber = body.GameNumber;
            existing.LocationNumber = body.LocationNumber;
            existing.GameDate = body.GameDate;
            existing.GameTime = body.GameTime;
            existing.VisitingTeam = body.VisitingTeam;
            existing.HomeTeam = body.HomeTeam;
            existing.Descr = body.Descr;
            existing.VisitingTeamScore = body.VisitingTeamScore;
            existing.HomeTeamScore = body.HomeTeamScore;
            existing.DivisionId = body.DivisionId;

            await _repository.SaveChangesAsync();
            return req.CreateResponse(HttpStatusCode.NoContent);
        }

        [Function("PutSchedulePlayoffByKeys")]
        public async Task<HttpResponseData> PutSchedulePlayoffByKeys(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = "SchedulePlayoff/{scheduleNumber:int}/{gameNumber:int}")] HttpRequestData req,
            int scheduleNumber, int gameNumber)
        {
            SchedulePlayoff? body;
            using (var sr = new StreamReader(req.Body))
            {
                var json = await sr.ReadToEndAsync();
                body = JsonSerializer.Deserialize<SchedulePlayoff>(json, JsonOptions);
            }
            if (body == null)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }

            var existing = _repository.GetByScheduleAndGameNo(scheduleNumber, gameNumber);
            if (existing == null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            existing.LocationNumber = body.LocationNumber;
            existing.GameDate = body.GameDate;
            existing.GameTime = body.GameTime;
            existing.VisitingTeam = body.VisitingTeam;
            existing.HomeTeam = body.HomeTeam;
            existing.Descr = body.Descr;
            existing.VisitingTeamScore = body.VisitingTeamScore;
            existing.HomeTeamScore = body.HomeTeamScore;
            existing.DivisionId = body.DivisionId;

            await _repository.SaveChangesAsync();
            return req.CreateResponse(HttpStatusCode.NoContent);
        }

        [Function("DeleteSchedulePlayoff")]
        public async Task<HttpResponseData> DeleteSchedulePlayoff(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "SchedulePlayoff/{scheduleNumber:int}/{gameNumber:int}")] HttpRequestData req,
            int scheduleNumber, int gameNumber)
        {
            var existing = _repository.GetByScheduleAndGameNo(scheduleNumber, gameNumber);
            if (existing == null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }
            _repository.Delete(existing);
            await _repository.SaveChangesAsync();
            return req.CreateResponse(HttpStatusCode.NoContent);
        }
    }
}
