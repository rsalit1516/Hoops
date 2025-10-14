using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Functions.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Hoops.Functions.Functions
{
    public class TeamFunctions
    {
        private readonly ITeamRepository _repository;
        private readonly IScheduleDivTeamsRepository _scheduleDivTeamsRepository;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };

        public TeamFunctions(ITeamRepository repository, IScheduleDivTeamsRepository scheduleDivTeamsRepository)
        {
            _repository = repository;
            _scheduleDivTeamsRepository = scheduleDivTeamsRepository;
        }

        private static async Task WriteJsonAsync<T>(HttpResponseData resp, T payload, HttpStatusCode status = HttpStatusCode.OK)
        {
            resp.StatusCode = status;
            resp.Headers.Add("Content-Type", "application/json; charset=utf-8");
            await JsonSerializer.SerializeAsync(resp.Body, payload, JsonOptions);
        }

        [Function("GetTeams")]
        public async Task<HttpResponseData> GetTeams(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Team")] HttpRequestData req)
        {
            var teams = await _repository.GetAllAsync();
            var dtos = teams.Select(ToDto).ToList();
            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, dtos);
            return resp;
        }

        [Function("GetTeamById")]
        public async Task<HttpResponseData> GetTeamById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Team/{id:int}")] HttpRequestData req,
            int id)
        {
            var team = await _repository.GetByIdAsync(id);
            if (team == null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }
            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, ToDto(team));
            return resp;
        }

        [Function("PutTeam")]
        public async Task<HttpResponseData> PutTeam(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = "Team/{id:int}")] HttpRequestData req,
            int id)
        {
            Team? body;
            using (var sr = new StreamReader(req.Body))
            {
                var json = await sr.ReadToEndAsync();
                body = JsonSerializer.Deserialize<Team>(json, JsonOptions);
            }
            if (body == null)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }
            if (id != body.TeamId)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }

            _repository.Update(body);
            try
            {
                await _repository.SaveChangesAsync();
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException)
            {
                var exists = await _repository.GetByIdAsync(id) != null;
                if (!exists)
                {
                    return req.CreateResponse(HttpStatusCode.NotFound);
                }
                throw;
            }
            return req.CreateResponse(HttpStatusCode.NoContent);
        }

        [Function("PostTeam")]
        public async Task<HttpResponseData> PostTeam(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "Team")] HttpRequestData req)
        {
            Team? body;
            using (var sr = new StreamReader(req.Body))
            {
                var json = await sr.ReadToEndAsync();
                body = JsonSerializer.Deserialize<Team>(json, JsonOptions);
            }
            if (body == null)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }
            _repository.Insert(body);
            await _repository.SaveChangesAsync();
            var created = req.CreateResponse(HttpStatusCode.Created);
            await WriteJsonAsync(created, ToDto(body), HttpStatusCode.Created);
            return created;
        }

        [Function("DeleteTeam")]
        public async Task<HttpResponseData> DeleteTeam(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "Team/{id:int}")] HttpRequestData req,
            int id)
        {
            var team = await _repository.GetByIdAsync(id);
            if (team == null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }
            _repository.Delete(team);
            await _repository.SaveChangesAsync();
            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, ToDto(team));
            return resp;
        }

        [Function("GetSeasonTeams")]
        public HttpResponseData GetSeasonTeams(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Team/GetSeasonTeams/{seasonId:int}")] HttpRequestData req,
            int seasonId)
        {
            if (seasonId <= 0)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }
            var teams = _repository.GetSeasonTeams(seasonId) ?? new List<Team>();
            var dtos = teams.Select(ToDto).ToList();
            var resp = req.CreateResponse();
            WriteJsonAsync(resp, dtos).GetAwaiter().GetResult();
            return resp;
        }

        [Function("GetMappedTeamNumber")]
        public HttpResponseData GetMappedTeamNumber(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Team/GetMappedTeamNumber/{scheduleNumber:int}/{teamNumber:int}")] HttpRequestData req,
            int scheduleNumber, int teamNumber)
        {
            if (scheduleNumber <= 0 || teamNumber <= 0)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }
            var mapped = _scheduleDivTeamsRepository.GetTeamNo(scheduleNumber, teamNumber);
            var resp = req.CreateResponse();
            WriteJsonAsync(resp, mapped).GetAwaiter().GetResult();
            return resp;
        }

        [Function("GetMappedTeamNumberBySeason")]
        public HttpResponseData GetMappedTeamNumberBySeason(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Team/GetMappedTeamNumber/{scheduleNumber:int}/{teamNumber:int}/{seasonId:int}")] HttpRequestData req,
            int scheduleNumber, int teamNumber, int seasonId)
        {
            if (scheduleNumber <= 0 || teamNumber <= 0 || seasonId <= 0)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }
            var mapped = _scheduleDivTeamsRepository.GetTeamNo(scheduleNumber, teamNumber, seasonId);
            var resp = req.CreateResponse();
            WriteJsonAsync(resp, mapped).GetAwaiter().GetResult();
            return resp;
        }

        [Function("GetValidScheduleTeams")]
        public async Task<HttpResponseData> GetValidScheduleTeams(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Team/GetValidScheduleTeams/{scheduleNumber:int}/{seasonId:int}")] HttpRequestData req,
            int scheduleNumber, int seasonId)
        {
            if (scheduleNumber <= 0 || seasonId <= 0)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }

            var scheduleDivTeams = await _scheduleDivTeamsRepository.GetAllAsync();
            var validTeams = scheduleDivTeams
                .Where(sdt => sdt.ScheduleNumber == scheduleNumber && sdt.SeasonId == seasonId)
                .OrderBy(sdt => sdt.ScheduleTeamNumber)
                .Select(sdt => new
                {
                    scheduleTeamNumber = sdt.ScheduleTeamNumber,
                    teamNumber = sdt.TeamNumber,
                    displayName = $"Team {sdt.ScheduleTeamNumber}"
                })
                .ToList();

            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, validTeams);
            return resp;
        }
        private static TeamDto ToDto(Team t) => new TeamDto
        {
            TeamId = t.TeamId,
            DivisionId = t.DivisionId,
            SeasonId = t.SeasonId,
            TeamColorId = t.TeamColorId,
            TeamName = t.TeamName,
            Name = t.TeamName,
            TeamNumber = t.TeamNumber,
            CreatedDate = t.CreatedDate,
            CreatedUser = t.CreatedUser
        };
    }
}
