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
using Hoops.Functions.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Functions.Functions
{
    public class ScheduleGameFunctions
    {
        private readonly IScheduleGameRepository _repository;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };

        public ScheduleGameFunctions(IScheduleGameRepository repository)
        {
            _repository = repository;
        }

        private static async Task WriteJsonAsync<T>(HttpResponseData resp, T payload, HttpStatusCode status = HttpStatusCode.OK)
        {
            resp.StatusCode = status;
            resp.Headers.Add("Content-Type", "application/json; charset=utf-8");
            await JsonSerializer.SerializeAsync(resp.Body, payload!, JsonOptions);
        }

        [Function("GetSeasonGames")]
        public async Task<HttpResponseData> GetSeasonGames(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "ScheduleGame/GetSeasonGames")] HttpRequestData req)
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

            var games = _repository.GetGames(seasonId) ?? new List<vmGameSchedule>();
            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, games.ToList());
            return resp;
        }

        [Function("GetStandings")]
        public async Task<HttpResponseData> GetStandings(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "ScheduleGame/GetStandings/{seasonId:int}/{divisionId:int}")] HttpRequestData req,
            int seasonId, int divisionId)
        {
            if (seasonId <= 0 || divisionId <= 0)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }
            var standings = _repository.GetStandings(seasonId, divisionId) ?? new List<ScheduleStandingsVM>();
            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, standings.ToList());
            return resp;
        }

        [Function("PutScheduleGame")]
        public async Task<HttpResponseData> PutScheduleGame(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = "ScheduleGame/{id:int}")] HttpRequestData req,
            int id)
        {
            ScheduleGame? body;
            using (var sr = new StreamReader(req.Body))
            {
                var json = await sr.ReadToEndAsync();
                body = JsonSerializer.Deserialize<ScheduleGame>(json, JsonOptions);
            }
            if (body == null || id != body.ScheduleGamesId)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }

            // Basic score validation
            if (body.HomeTeamScore.HasValue && (body.HomeTeamScore < 0 || body.HomeTeamScore > 150))
                return req.CreateResponse(HttpStatusCode.BadRequest);
            if (body.VisitingTeamScore.HasValue && (body.VisitingTeamScore < 0 || body.VisitingTeamScore > 150))
                return req.CreateResponse(HttpStatusCode.BadRequest);

            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            existing.HomeTeamScore = body.HomeTeamScore;
            existing.VisitingTeamScore = body.VisitingTeamScore;
            existing.HomeForfeited = body.HomeForfeited;
            existing.VisitingForfeited = body.VisitingForfeited;
            existing.GameDate = body.GameDate;
            existing.GameTime = body.GameTime;
            existing.LocationNumber = body.LocationNumber;
            existing.HomeTeamNumber = body.HomeTeamNumber;
            existing.VisitingTeamNumber = body.VisitingTeamNumber;

            _repository.Update(existing);
            try
            {
                await _repository.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                var stillExists = await _repository.GetByIdAsync(id) != null;
                if (!stillExists) return req.CreateResponse(HttpStatusCode.NotFound);
                throw;
            }
            return req.CreateResponse(HttpStatusCode.NoContent);
        }

        [Function("PutScheduleGameScores")]
        public async Task<HttpResponseData> PutScheduleGameScores(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = "ScheduleGame/{id:int}/scores")] HttpRequestData req,
            int id)
        {
            UpdateGameScoresDto? dto;
            using (var sr = new StreamReader(req.Body))
            {
                var json = await sr.ReadToEndAsync();
                dto = JsonSerializer.Deserialize<UpdateGameScoresDto>(json, JsonOptions);
            }
            if (dto == null || id != dto.ScheduleGamesId)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }
            if (dto.HomeTeamScore.HasValue && (dto.HomeTeamScore < 0 || dto.HomeTeamScore > 150))
                return req.CreateResponse(HttpStatusCode.BadRequest);
            if (dto.VisitingTeamScore.HasValue && (dto.VisitingTeamScore < 0 || dto.VisitingTeamScore > 150))
                return req.CreateResponse(HttpStatusCode.BadRequest);

            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            existing.HomeTeamScore = dto.HomeTeamScore;
            existing.VisitingTeamScore = dto.VisitingTeamScore;
            existing.HomeForfeited = dto.HomeForfeited;
            existing.VisitingForfeited = dto.VisitingForfeited;

            _repository.Update(existing);
            try
            {
                await _repository.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                var stillExists = await _repository.GetByIdAsync(id) != null;
                if (!stillExists) return req.CreateResponse(HttpStatusCode.NotFound);
                throw;
            }
            return req.CreateResponse(HttpStatusCode.NoContent);
        }

        [Function("PostScheduleGame")]
        public async Task<HttpResponseData> PostScheduleGame(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "ScheduleGame")] HttpRequestData req)
        {
            ScheduleGame? body;
            using (var sr = new StreamReader(req.Body))
            {
                var json = await sr.ReadToEndAsync();
                body = JsonSerializer.Deserialize<ScheduleGame>(json, JsonOptions);
            }
            if (body == null)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }
            _repository.Insert(body);
            await _repository.SaveChangesAsync();
            var created = req.CreateResponse(HttpStatusCode.Created);
            await WriteJsonAsync(created, body, HttpStatusCode.Created);
            return created;
        }

        [Function("DeleteScheduleGame")]
        public async Task<HttpResponseData> DeleteScheduleGame(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "ScheduleGame/{id:int}")] HttpRequestData req,
            int id)
        {
            var scheduleGame = await _repository.GetByIdAsync(id);
            if (scheduleGame == null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }
            _repository.Delete(scheduleGame);
            await _repository.SaveChangesAsync();
            return req.CreateResponse(HttpStatusCode.NoContent);
        }
    }
}
