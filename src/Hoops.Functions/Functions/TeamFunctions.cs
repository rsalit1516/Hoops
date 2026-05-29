using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Functions.Mapping;
using Hoops.Functions.Utils;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Hoops.Functions.Functions
{
    public class TeamFunctions
    {
        private readonly ITeamRepository _repository;
        private readonly IScheduleDivTeamsRepository _scheduleDivTeamsRepository;
        private readonly ILogger<TeamFunctions> _logger;

        public TeamFunctions(ITeamRepository repository, IScheduleDivTeamsRepository scheduleDivTeamsRepository, ILogger<TeamFunctions> logger)
        {
            _repository = repository;
            _scheduleDivTeamsRepository = scheduleDivTeamsRepository;
            _logger = logger;
        }

        [Function("GetTeams")]
        public async Task<HttpResponseData> GetTeams(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Team")] HttpRequestData req)
        {
            var teams = await _repository.GetAllAsync();
            var dtos = teams.Select(EntityMapper.ToDto).ToList();
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, dtos);
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
            await ResponseUtils.WriteJsonAsync(resp, EntityMapper.ToDto(team));
            return resp;
        }

        [Function("PutTeam")]
        [RequireAuth]
        public async Task<HttpResponseData> PutTeam(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "Team/{id:int}")] HttpRequestData req,
            int id,
            FunctionContext context)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            Team? body;
            using (var sr = new StreamReader(req.Body))
            {
                var json = await sr.ReadToEndAsync();
                try
                {
                    body = JsonSerializer.Deserialize<Team>(json, ResponseUtils.JsonOptions);
                }
                catch (JsonException)
                {
                    return req.CreateResponse(HttpStatusCode.BadRequest);
                }
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
        [RequireAuth]
        public async Task<HttpResponseData> PostTeam(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Team")] HttpRequestData req,
            FunctionContext context)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            Team? body;
            using (var sr = new StreamReader(req.Body))
            {
                var json = await sr.ReadToEndAsync();
                try
                {
                    body = JsonSerializer.Deserialize<Team>(json, ResponseUtils.JsonOptions);
                }
                catch (JsonException)
                {
                    return req.CreateResponse(HttpStatusCode.BadRequest);
                }
            }
            if (body == null)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }
            _repository.Insert(body);
            await _repository.SaveChangesAsync();
            var created = req.CreateResponse(HttpStatusCode.Created);
            await ResponseUtils.WriteJsonAsync(created, EntityMapper.ToDto(body), HttpStatusCode.Created);
            return created;
        }

        [Function("DeleteTeam")]
        [RequireAuth]
        public async Task<HttpResponseData> DeleteTeam(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "Team/{id:int}")] HttpRequestData req,
            int id,
            FunctionContext context)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            var team = await _repository.GetByIdAsync(id);
            if (team == null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }
            _repository.Delete(team);
            await _repository.SaveChangesAsync();
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, EntityMapper.ToDto(team));
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
            var dtos = teams.Select(EntityMapper.ToDto).ToList();
            var resp = req.CreateResponse();
            ResponseUtils.WriteJsonAsync(resp, dtos).GetAwaiter().GetResult();
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
            ResponseUtils.WriteJsonAsync(resp, mapped).GetAwaiter().GetResult();
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
            ResponseUtils.WriteJsonAsync(resp, mapped).GetAwaiter().GetResult();
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

            var validTeams = _scheduleDivTeamsRepository.GetValidScheduleTeams(scheduleNumber, seasonId);

            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, validTeams);
            return resp;
        }
    }
}
