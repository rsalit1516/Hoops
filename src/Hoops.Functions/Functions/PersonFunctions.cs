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
    public class PersonFunctions
    {
        private readonly IPersonRepository _repository;
        private const int DefaultCompanyId = 1;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };

        public PersonFunctions(IPersonRepository repository)
        {
            _repository = repository;
        }

        private static async Task WriteJsonAsync<T>(HttpResponseData resp, T payload, HttpStatusCode status = HttpStatusCode.OK)
        {
            resp.StatusCode = status;
            resp.Headers.Add("Content-Type", "application/json; charset=utf-8");
            await JsonSerializer.SerializeAsync(resp.Body, payload!, JsonOptions);
        }

        [Function("GetPeople")]
        public async Task<HttpResponseData> GetPeople(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Person")] HttpRequestData req)
        {
            var people = await _repository.GetAllAsync();
            var dtos = people.Select(ToDto).ToList();
            var resp = req.CreateResponse();
            await WriteJsonAsync(resp, dtos);
            return resp;
        }

        [Function("GetADs")]
        public HttpResponseData GetADs(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Person/GetADs")] HttpRequestData req)
        {
            var ads = _repository.GetADs(DefaultCompanyId).ToList();
            var dtos = ads.Select(ToDto).ToList();
            var resp = req.CreateResponse();
            WriteJsonAsync(resp, dtos).GetAwaiter().GetResult();
            return resp;
        }

        [Function("GetHouseholdMembers")]
        public HttpResponseData GetHouseholdMembers(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Person/GetHouseholdMembers/{id:int}")] HttpRequestData req,
            int id)
        {
            var people = _repository.GetByHousehold(id) ?? new List<Person>();
            var dtos = people.Select(ToDto).ToList();
            var resp = req.CreateResponse();
            WriteJsonAsync(resp, dtos).GetAwaiter().GetResult();
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
            var dtos = results.Select(ToDto).ToList();
            var resp = req.CreateResponse();
            WriteJsonAsync(resp, dtos).GetAwaiter().GetResult();
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
                    dto = JsonSerializer.Deserialize<PersonDto>(json, JsonOptions);
                }
                if (dto == null)
                {
                    return req.CreateResponse(HttpStatusCode.BadRequest);
                }

                // Map DTO to entity
                var person = FromDto(dto);

                var createdPerson = _repository.Insert(person);
                await _repository.SaveChangesAsync();

                var resp = req.CreateResponse(HttpStatusCode.Created);
                await WriteJsonAsync(resp, ToDto(createdPerson), HttpStatusCode.Created);
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
                    dto = JsonSerializer.Deserialize<PersonDto>(json, JsonOptions);
                }
                if (dto == null || id != dto.PersonId)
                {
                    return req.CreateResponse(HttpStatusCode.BadRequest);
                }

                // Map DTO to entity
                var person = FromDto(dto);

                var updatedPerson = _repository.Update(person);
                try
                {
                    await _repository.SaveChangesAsync();
                }
                catch (Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException)
                {
                    // if entity no longer exists
                    Person? exists = null;
                    try { exists = await _repository.FindByAsync(id); } catch { exists = null; }
                    if (exists == null)
                    {
                        return req.CreateResponse(HttpStatusCode.NotFound);
                    }
                    throw;
                }

                var resp = req.CreateResponse();
                await WriteJsonAsync(resp, ToDto(updatedPerson));
                return resp;
            }
            catch (Exception ex)
            {
                var errorResp = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResp.WriteStringAsync($"Error updating person: {ex.Message}\n{ex.StackTrace}");
                return errorResp;
            }
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
                await WriteJsonAsync(resp, ToDto(entity));
                return resp;
            }
            catch (Exception ex)
            {
                var errorResp = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResp.WriteStringAsync($"Error deleting person: {ex.Message}\n{ex.StackTrace}");
                return errorResp;
            }
        }

        private static PersonDto ToDto(Person p) => new PersonDto
        {
            PersonId = p.PersonId,
            CompanyId = p.CompanyId,
            HouseId = p.HouseId,
            FirstName = p.FirstName,
            LastName = p.LastName,
            Workphone = p.Workphone,
            Cellphone = p.Cellphone,
            Email = p.Email,
            Suspended = p.Suspended,
            LatestSeason = p.LatestSeason,
            LatestShirtSize = p.LatestShirtSize,
            LatestRating = p.LatestRating,
            BirthDate = p.BirthDate,
            Bc = p.Bc,
            Gender = p.Gender,
            SchoolName = p.SchoolName,
            Grade = p.Grade,
            GiftedLevelsUp = p.GiftedLevelsUp,
            FeeWaived = p.FeeWaived,
            Player = p.Player,
            Parent = p.Parent,
            Coach = p.Coach,
            AsstCoach = p.AsstCoach,
            BoardOfficer = p.BoardOfficer,
            BoardMember = p.BoardMember,
            Ad = p.Ad,
            Sponsor = p.Sponsor,
            SignUps = p.SignUps,
            TryOuts = p.TryOuts,
            TeeShirts = p.TeeShirts,
            Printing = p.Printing,
            Equipment = p.Equipment,
            Electrician = p.Electrician,
            CreatedDate = p.CreatedDate,
            CreatedUser = p.CreatedUser,
            TempId = p.TempId
        };

        private static Person FromDto(PersonDto dto) => new Person
        {
            PersonId = dto.PersonId,
            CompanyId = dto.CompanyId,
            HouseId = dto.HouseId,
            FirstName = dto.FirstName ?? string.Empty,
            LastName = dto.LastName ?? string.Empty,
            Workphone = dto.Workphone,
            Cellphone = dto.Cellphone,
            Email = dto.Email,
            Suspended = dto.Suspended,
            LatestSeason = dto.LatestSeason,
            LatestShirtSize = dto.LatestShirtSize,
            LatestRating = dto.LatestRating,
            BirthDate = dto.BirthDate,
            Bc = dto.Bc,
            Gender = dto.Gender,
            SchoolName = dto.SchoolName,
            Grade = dto.Grade,
            GiftedLevelsUp = dto.GiftedLevelsUp,
            FeeWaived = dto.FeeWaived,
            Player = dto.Player,
            Parent = dto.Parent,
            Coach = dto.Coach,
            AsstCoach = dto.AsstCoach,
            BoardOfficer = dto.BoardOfficer,
            BoardMember = dto.BoardMember,
            Ad = dto.Ad,
            Sponsor = dto.Sponsor,
            SignUps = dto.SignUps,
            TryOuts = dto.TryOuts,
            TeeShirts = dto.TeeShirts,
            Printing = dto.Printing,
            Equipment = dto.Equipment,
            Electrician = dto.Electrician,
            CreatedDate = dto.CreatedDate,
            CreatedUser = dto.CreatedUser,
            TempId = dto.TempId
            // Intentionally omitting navigation properties (Household, Comments)
        };
    }
}
