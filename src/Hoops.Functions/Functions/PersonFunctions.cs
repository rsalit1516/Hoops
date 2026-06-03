using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Functions.Mapping;
using Hoops.Functions.Models;
using Hoops.Functions.Utils;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Hoops.Functions.Functions
{
    public class PersonFunctions
    {
        private readonly IPersonRepository _repository;
        private const int DefaultCompanyId = 1;

        public PersonFunctions(IPersonRepository repository)
        {
            _repository = repository;
        }

        [Function("GetPeople")]
        public async Task<HttpResponseData> GetPeople(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Person")] HttpRequestData req)
        {
            var people = await _repository.GetAllAsync();
            var dtos = people.Select(EntityMapper.ToDto).ToList();
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, dtos);
            return resp;
        }

        [Function("GetADs")]
        public HttpResponseData GetADs(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Person/GetADs")] HttpRequestData req)
        {
            var ads = _repository.GetADs(DefaultCompanyId).ToList();
            var dtos = ads.Select(EntityMapper.ToDto).ToList();
            var resp = req.CreateResponse();
            ResponseUtils.WriteJsonAsync(resp, dtos).GetAwaiter().GetResult();
            return resp;
        }

        [Function("GetHouseholdMembers")]
        public HttpResponseData GetHouseholdMembers(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Person/GetHouseholdMembers/{id:int}")] HttpRequestData req,
            int id)
        {
            var people = _repository.GetByHousehold(id) ?? new List<Person>();
            var dtos = people.Select(EntityMapper.ToDto).ToList();
            var resp = req.CreateResponse();
            ResponseUtils.WriteJsonAsync(resp, dtos).GetAwaiter().GetResult();
            return resp;
        }

        [Function("SearchPeople")]
        public HttpResponseData SearchPeople(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Person/search")] HttpRequestData req)
        {
            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
            var lastName = query["lastName"] ?? string.Empty;
            var firstName = query["firstName"] ?? string.Empty;
            var playerOnly = bool.TryParse(query["playerOnly"], out var po) && po;
            var results = _repository.FindPeopleByLastAndFirstName(lastName, firstName, playerOnly).ToList();
            var dtos = results.Select(EntityMapper.ToDto).ToList();
            var resp = req.CreateResponse();
            ResponseUtils.WriteJsonAsync(resp, dtos).GetAwaiter().GetResult();
            return resp;
        }

        [Function("PostPerson")]
        public async Task<HttpResponseData> PostPerson(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Person")] HttpRequestData req)
        {
            try
            {
                PersonDto? dto;
                using (var sr = new StreamReader(req.Body))
                {
                    var json = await sr.ReadToEndAsync();
                    dto = JsonSerializer.Deserialize<PersonDto>(json, ResponseUtils.JsonOptions);
                }
                if (dto == null)
                {
                    return req.CreateResponse(HttpStatusCode.BadRequest);
                }

                var person = EntityMapper.FromDto(dto);

                var createdPerson = _repository.Insert(person);
                await _repository.SaveChangesAsync();

                var resp = req.CreateResponse(HttpStatusCode.Created);
                await ResponseUtils.WriteJsonAsync(resp, EntityMapper.ToDto(createdPerson), HttpStatusCode.Created);
                return resp;
            }
            catch (Exception ex)
            {
                var errorResp = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResp.WriteStringAsync($"Error creating person: {ex.Message}\n{ex.StackTrace}");
                return errorResp;
            }
        }

        [Function("PutPerson")]
        public async Task<HttpResponseData> PutPerson(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "Person/{id:int}")] HttpRequestData req,
            int id)
        {
            try
            {
                PersonDto? dto;
                using (var sr = new StreamReader(req.Body))
                {
                    var json = await sr.ReadToEndAsync();
                    dto = JsonSerializer.Deserialize<PersonDto>(json, ResponseUtils.JsonOptions);
                }
                if (dto == null || id != dto.PersonId)
                {
                    return req.CreateResponse(HttpStatusCode.BadRequest);
                }

                var person = EntityMapper.FromDto(dto);

                var updatedPerson = _repository.Update(person);
                try
                {
                    await _repository.SaveChangesAsync();
                }
                catch (Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException)
                {
                    Person? exists = null;
                    try { exists = await _repository.FindByAsync(id); } catch { exists = null; }
                    if (exists == null)
                    {
                        return req.CreateResponse(HttpStatusCode.NotFound);
                    }
                    throw;
                }

                var resp = req.CreateResponse();
                await ResponseUtils.WriteJsonAsync(resp, EntityMapper.ToDto(updatedPerson));
                return resp;
            }
            catch (Exception ex)
            {
                var errorResp = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResp.WriteStringAsync($"Error updating person: {ex.Message}\n{ex.StackTrace}");
                return errorResp;
            }
        }

        [Function("GetPersonById")]
        public async Task<HttpResponseData> GetPersonById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Person/{id:int}")] HttpRequestData req,
            int id)
        {
            Person? entity = null;
            try { entity = await _repository.FindByAsync(id); } catch { entity = null; }
            if (entity == null)
            {
                return req.CreateResponse(HttpStatusCode.NotFound);
            }
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, EntityMapper.ToDto(entity));
            return resp;
        }

        [Function("DeletePerson")]
        public async Task<HttpResponseData> DeletePerson(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "Person/{id:int}")] HttpRequestData req,
            int id)
        {
            try
            {
                Person? entity = null;
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
            catch (Exception ex)
            {
                var errorResp = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResp.WriteStringAsync($"Error deleting person: {ex.Message}\n{ex.StackTrace}");
                return errorResp;
            }
        }
    }
}
