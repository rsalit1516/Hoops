using System;
using System.IO;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Hoops.Functions.Functions
{
    public class PlayerFunctions
    {
        private readonly IPlayerRepository _repository;
        private readonly IPlayerService _playerService;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };

        public PlayerFunctions(IPlayerRepository repository, IPlayerService playerService)
        {
            _repository = repository;
            _playerService = playerService;
        }

        private static async Task WriteJsonAsync<T>(HttpResponseData resp, T payload, HttpStatusCode status = HttpStatusCode.OK)
        {
            resp.StatusCode = status;
            resp.Headers.Add("Content-Type", "application/json; charset=utf-8");
            await JsonSerializer.SerializeAsync(resp.Body, payload!, JsonOptions);
        }

        [Function("GetPlayer")]
        public async Task<HttpResponseData> GetPlayer(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Players/{id:int}")] HttpRequestData req,
            int id)
        {
            try
            {
                var player = await _playerService.GetPlayerByIdAsync(id);
                var resp = req.CreateResponse();
                await WriteJsonAsync(resp, player);
                return resp;
            }
            catch (InvalidOperationException)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }
        }

        [Function("GetPlayerByPersonId")]
        public HttpResponseData GetPlayerByPersonId(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Players/Person/{personId:int}")] HttpRequestData req,
            int personId)
        {
            var player = _repository.GetByPersonId(personId);
            if (player == null || player.PlayerId == 0)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            var resp = req.CreateResponse();
            WriteJsonAsync(resp, player).GetAwaiter().GetResult();
            return resp;
        }

        [Function("GetPlayerByPersonAndSeason")]
        public HttpResponseData GetPlayerByPersonAndSeason(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Players/Person/{personId:int}/Season/{seasonId:int}")] HttpRequestData req,
            int personId,
            int seasonId)
        {
            var player = _repository.GetPlayerByPersonAndSeasonId(personId, seasonId);
            if (player == null || player.PlayerId == 0)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }

            var resp = req.CreateResponse();
            WriteJsonAsync(resp, player).GetAwaiter().GetResult();
            return resp;
        }

        [Function("PostPlayer")]
        public async Task<HttpResponseData> PostPlayer(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Players")] HttpRequestData req)
        {
            try
            {
                Player? player;
                using (var sr = new StreamReader(req.Body))
                {
                    var json = await sr.ReadToEndAsync();
                    player = JsonSerializer.Deserialize<Player>(json, JsonOptions);
                }

                if (player == null)
                {
                    return req.CreateResponse(HttpStatusCode.BadRequest);
                }

                if (player.SeasonId == null || player.SeasonId == 0)
                {
                    var badReq = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badReq.WriteStringAsync("SeasonId is required");
                    return badReq;
                }

                // If division is not set, determine it automatically
                if (player.DivisionId == null || player.DivisionId == 0)
                {
                    var divisionId = await _playerService.DetermineDivisionAsync(
                        player.PersonId,
                        player.SeasonId.Value);
                    player.DivisionId = divisionId;
                }

                // Set default values if not provided
                player.CompanyId ??= 1;
                player.CreatedDate ??= DateTime.Now;

                var createdPlayer = _repository.Insert(player);
                await _repository.SaveChangesAsync();

                var resp = req.CreateResponse(HttpStatusCode.Created);
                await WriteJsonAsync(resp, createdPlayer, HttpStatusCode.Created);
                return resp;
            }
            catch (InvalidOperationException ex)
            {
                var errorResp = req.CreateResponse(HttpStatusCode.BadRequest);
                await errorResp.WriteStringAsync($"Error creating player: {ex.Message}");
                return errorResp;
            }
            catch (Exception ex)
            {
                var errorResp = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResp.WriteStringAsync($"Error creating player: {ex.Message}\n{ex.StackTrace}");
                return errorResp;
            }
        }

        [Function("PutPlayer")]
        public async Task<HttpResponseData> PutPlayer(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "Players/{id:int}")] HttpRequestData req,
            int id)
        {
            try
            {
                Player? player;
                using (var sr = new StreamReader(req.Body))
                {
                    var json = await sr.ReadToEndAsync();
                    player = JsonSerializer.Deserialize<Player>(json, JsonOptions);
                }

                if (player == null || id != player.PlayerId)
                {
                    return req.CreateResponse(HttpStatusCode.BadRequest);
                }

                var updatedPlayer = await _playerService.UpdatePlayerAsync(player);
                var resp = req.CreateResponse();
                await WriteJsonAsync(resp, updatedPlayer);
                return resp;
            }
            catch (InvalidOperationException)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException)
            {
                Player? exists = null;
                try { exists = _repository.GetById(id); } catch { exists = null; }
                if (exists == null)
                {
                    return req.CreateResponse(HttpStatusCode.NotFound);
                }
                throw;
            }
            catch (Exception ex)
            {
                var errorResp = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResp.WriteStringAsync($"Error updating player: {ex.Message}\n{ex.StackTrace}");
                return errorResp;
            }
        }

        [Function("DeletePlayer")]
        public async Task<HttpResponseData> DeletePlayer(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "Players/{id:int}")] HttpRequestData req,
            int id)
        {
            try
            {
                var player = _repository.GetById(id);
                if (player == null)
                {
                    return req.CreateResponse(HttpStatusCode.NotFound);
                }

                _repository.Delete(player);
                await _repository.SaveChangesAsync();

                var resp = req.CreateResponse();
                await WriteJsonAsync(resp, player);
                return resp;
            }
            catch (Exception ex)
            {
                var errorResp = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResp.WriteStringAsync($"Error deleting player: {ex.Message}\n{ex.StackTrace}");
                return errorResp;
            }
        }
    }
}
