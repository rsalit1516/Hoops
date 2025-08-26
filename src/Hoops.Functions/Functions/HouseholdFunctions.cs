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

namespace Hoops.Functions.Functions
{
    public class HouseholdFunctions
    {
        private readonly IHouseholdRepository _repository;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };

        public HouseholdFunctions(IHouseholdRepository repository)
        {
            _repository = repository;
        }

        private static async Task WriteJsonAsync<T>(HttpResponseData resp, T payload, HttpStatusCode status = HttpStatusCode.OK)
        {
            resp.StatusCode = status;
            resp.Headers.Add("Content-Type", "application/json; charset=utf-8");
            await JsonSerializer.SerializeAsync(resp.Body, payload!, JsonOptions);
        }

        [Function("GetHouseholds")]
        public async Task<HttpResponseData> GetHouseholds(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Household")] HttpRequestData req)
        {
            var list = await _repository.GetAllAsync();
            var dtos = list.Select(ToDto).ToList();
            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, dtos);
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
            await WriteJsonAsync(resp, ToDto(entity));
            return resp;
        }

        [Function("PutHousehold")]
        public async Task<HttpResponseData> PutHousehold(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = "Household/{id:int}")] HttpRequestData req,
            int id)
        {
            Household? body;
            using (var sr = new StreamReader(req.Body))
            {
                var json = await sr.ReadToEndAsync();
                body = JsonSerializer.Deserialize<Household>(json, JsonOptions);
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
                // if entity no longer exists
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
        public async Task<HttpResponseData> PostHousehold(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "Household")] HttpRequestData req)
        {
            Household? body;
            using (var sr = new StreamReader(req.Body))
            {
                var json = await sr.ReadToEndAsync();
                body = JsonSerializer.Deserialize<Household>(json, JsonOptions);
            }
            if (body == null)
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }

            var createdEntity = _repository.Insert(body);
            await _repository.SaveChangesAsync();

            var resp = req.CreateResponse(HttpStatusCode.Created);
            await WriteJsonAsync(resp, ToDto(createdEntity), HttpStatusCode.Created);
            return resp;
        }

        [Function("DeleteHousehold")]
        public async Task<HttpResponseData> DeleteHousehold(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "Household/{id:int}")] HttpRequestData req,
            int id)
        {
            Household? entity = null;
            try { entity = await _repository.FindByAsync(id); } catch { entity = null; }
            if (entity == null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }
            _repository.Delete(entity);
            await _repository.SaveChangesAsync();
            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, ToDto(entity));
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
            var dtos = results.Select(ToDto).ToList();
            var resp = req.CreateResponse();
            WriteJsonAsync(resp, dtos).GetAwaiter().GetResult();
            return resp;
        }

        private static HouseholdDto ToDto(Household h) => new HouseholdDto
        {
            HouseId = h.HouseId,
            Name = h.Name,
            Address1 = h.Address1,
            Address2 = h.Address2,
            City = h.City,
            State = h.State,
            Zip = h.Zip,
            Email = h.Email,
            Phone = h.Phone
        };
    }
}
