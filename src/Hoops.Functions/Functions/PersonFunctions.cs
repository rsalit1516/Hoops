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
    }
}
