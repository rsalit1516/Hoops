using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Functions.Mapping;
using Hoops.Functions.Utils;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Hoops.Functions.Functions
{
    public class HouseholdFunctions
    {
        private readonly IHouseholdRepository _repository;
        private readonly ILogger<HouseholdFunctions> _logger;

        public HouseholdFunctions(IHouseholdRepository repository, ILogger<HouseholdFunctions> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        [Function("GetHouseholds")]
        public async Task<HttpResponseData> GetHouseholds(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Household")] HttpRequestData req)
        {
            var list = await _repository.GetAllAsync();
            var dtos = list.Select(EntityMapper.ToDto).ToList();
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, dtos);
            return resp;
        }

        [Function("GetHouseholdById")]
        public async Task<HttpResponseData> GetHouseholdById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Household/{id:int}")] HttpRequestData req,
            int id)
        {
            Household? entity = null;
            try
            {
                entity = await _repository.FindByAsync(id);
            }
            catch
            {
                entity = null;
            }
            if (entity == null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, EntityMapper.ToDto(entity));
            return resp;
        }

        [Function("PutHousehold")]
        [RequireAuth]
        public async Task<HttpResponseData> PutHousehold(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "Household/{id:int}")] HttpRequestData req,
            int id,
            FunctionContext context)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            Household? body;
            using (var sr = new StreamReader(req.Body))
            {
                var json = await sr.ReadToEndAsync();
                body = JsonSerializer.Deserialize<Household>(json, ResponseUtils.JsonOptions);
            }
            if (body == null || id != body.HouseId)
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
                Household? exists = null;
                try { exists = await _repository.FindByAsync(id); } catch { exists = null; }
                if (exists == null)
                {
                    return req.CreateResponse(HttpStatusCode.NotFound);
                }
                throw;
            }
            return req.CreateResponse(HttpStatusCode.NoContent);
        }

        [Function("PostHousehold")]
        [RequireAuth]
        public async Task<HttpResponseData> PostHousehold(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Household")] HttpRequestData req,
            FunctionContext context)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            Household? body;
            using (var sr = new StreamReader(req.Body))
            {
                var json = await sr.ReadToEndAsync();
                body = JsonSerializer.Deserialize<Household>(json, ResponseUtils.JsonOptions);
            }
            if (body == null)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }

            var createdEntity = _repository.Insert(body);
            await _repository.SaveChangesAsync();

            var resp = req.CreateResponse(HttpStatusCode.Created);
            await ResponseUtils.WriteJsonAsync(resp, EntityMapper.ToDto(createdEntity), HttpStatusCode.Created);
            return resp;
        }

        [Function("DeleteHousehold")]
        [RequireAuth]
        public async Task<HttpResponseData> DeleteHousehold(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "Household/{id:int}")] HttpRequestData req,
            int id,
            FunctionContext context)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            Household? entity = null;
            try { entity = await _repository.FindByAsync(id); } catch { entity = null; }
            if (entity == null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }
            _repository.Delete(entity);
            await _repository.SaveChangesAsync();
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, EntityMapper.ToDto(entity));
            return resp;
        }

        [Function("SearchHousehold")]
        public HttpResponseData SearchHousehold(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Household/search")] HttpRequestData req)
        {
            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
            var criteria = new HouseholdSearchCriteria
            {
                Name = query["name"],
                Address = query["address"],
                Email = query["email"],
                Phone = query["phone"]
            };
            var results = _repository.SearchHouseholds(criteria) ?? new List<Household>();
            var dtos = results.Select(EntityMapper.ToDto).ToList();
            var resp = req.CreateResponse();
            ResponseUtils.WriteJsonAsync(resp, dtos).GetAwaiter().GetResult();
            return resp;
        }
    }
}
