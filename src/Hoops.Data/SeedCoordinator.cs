
using System;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Data;
using Microsoft.Extensions.Logging;
using Hoops.Core.Interface;
using Hoops.Data.Seeders;
using Microsoft.Net.Http.Headers;

namespace Hoops.Data
{
    public class SeedCoordinator
    {

        public hoopsContext context { get; private set; }
        public ISeasonRepository seasonRepo { get; private set; }
        public IDivisionRepository divisionRepo { get; private set; }
        public ITeamRepository teamRepo { get; private set; }
        public IColorRepository colorRepo { get; private set; }
        public IHouseholdRepository householdRepo { get; private set; }
        public IPersonRepository personRepo { get; private set; }
        public ILocationRepository locationRepo { get; private set; }
        public IWebContentTypeRepository webContentTypeRepo { get; private set; }
        public IWebContentRepository webContentRepo { get; private set; }
        private WebContentTypeSeeder _webContentTypeSeeder { get; set; }
        private WebContentSeeder _webContentSeeder { get; set; }
        private HouseholdAndPeopleSeeder _householdAndPeopleSeeder { get; set; }
        public SeedCoordinator(ISeasonRepository seasonRepo,
        IDivisionRepository divisionRepo,
        ITeamRepository teamRepo,
        IColorRepository colorRepo,
        IHouseholdRepository householdRepo,
        IPersonRepository personRepo,
        ILocationRepository locationRepo,
        // IWebContentTypeRepository webContentTypeRepo,
        // IWebContentRepository webContentRepo,
        hoopsContext context,
                WebContentTypeSeeder webContentTypeSeeder,
        WebContentSeeder webContentSeeder,
        HouseholdAndPeopleSeeder householdAndPeopleSeeder)
        {
            this.seasonRepo = seasonRepo;
            this.divisionRepo = divisionRepo;
            this.teamRepo = teamRepo;
            this.colorRepo = colorRepo;
            this.householdRepo = householdRepo;
            this.personRepo = personRepo;
            this.locationRepo = locationRepo;
            // this.webContentTypeRepo = webContentTypeRepo;
            // this.webContentRepo = webContentRepo;
            this.context = context;
            _webContentTypeSeeder = webContentTypeSeeder;
            _webContentSeeder = webContentSeeder;
            _householdAndPeopleSeeder = householdAndPeopleSeeder;
        }
        public async Task InitializeDataAsync()
        {
            //first delete all records    
            await DeleteTeamsAsync();
            await DeleteColorsAsync();
            // await DeleteDivisionsAsync();
            await DeleteSeasonDataAsync();
            await _webContentSeeder.DeleteAllAsync();
            await _webContentTypeSeeder.DeleteAllAsync();
            await _householdAndPeopleSeeder.DeleteAllAsync();

            //then create new records
            await CreateColorsAsync();
            await CreateSeasonsAsync();
            await CreateDivisionsAsync();
            await CreateTeamsAsync();
            await _webContentTypeSeeder.SeedAsync();
            await _webContentSeeder.SeedAsync();
            await _householdAndPeopleSeeder.SeedAsync();
        }

        private async Task CreateSeasonsAsync()
        {
            await InitializeSeasonsAsync();
            await context.SaveChangesAsync();
        }
        private async Task CreateDivisionsAsync()
        {
            await InitializeDivisionsAsync();
            await context.SaveChangesAsync();
        }
        private async Task CreateColorsAsync()
        {
            await InitializeColorsAsync();
            await context.SaveChangesAsync();
        }
        private async Task CreateTeamsAsync()
        {
            await InitializeTeamsAsync();
            await context.SaveChangesAsync();
        }

        private async Task DeleteSeasonDataAsync()
        {
            var records = await seasonRepo.GetAllAsync();
            foreach (var record in records)
            {
                await seasonRepo.DeleteAsync(record.SeasonId);
            }
        }
        private async Task DeleteDivisionsAsync()
        {
            var records = await divisionRepo.GetAllAsync();
            Console.WriteLine($"[DEBUG] Deleting {records.Count()} divisions");
            foreach (var record in records)
            {
                await divisionRepo.DeleteAsync(record.DivisionId);
            }
        }
        private async Task DeleteTeamsAsync()
        {
            var records = await teamRepo.GetAllAsync();
            foreach (var record in records)
            {
                await teamRepo.DeleteAsync(record.TeamId);
            }
        }
        private async Task DeleteColorsAsync()
        {
            var records = await colorRepo.GetAllAsync();
            foreach (var record in records)
            {
                await colorRepo.DeleteAsync(record.ColorId);
            }
        }

        private async Task InitializeSeasonsAsync()
        {
            var startyear = 2024;
            await seasonRepo.InsertAsync(new Season
            {
                Description = "Summer " + startyear.ToString(),
                CurrentSchedule = true,
                CurrentSignUps = true,
                CurrentSeason = true,
                CompanyId = 1,
                FromDate = new DateTime(startyear, 6, 15),
                ToDate = new DateTime(startyear, 8, 31),
                ParticipationFee = 110

            });
            await seasonRepo.InsertAsync(new Season
            {
                Description = "Spring " + startyear.ToString(),
                CurrentSchedule = false,
                CurrentSignUps = false,
                CurrentSeason = false,
                CompanyId = 1,
                FromDate = new DateTime(startyear, 3, 15),
                ToDate = new DateTime(startyear, 5, 16),
                ParticipationFee = 110
            });
            await seasonRepo.InsertAsync(new Season
            {
                Description = "Winter " + startyear++.ToString(),
                CurrentSchedule = false,
                CurrentSignUps = false,
                CurrentSeason = false,
                CompanyId = 1,
                FromDate = new DateTime(startyear, 11, 15),
                ToDate = new DateTime(startyear++, 3, 6),
                ParticipationFee = 110
            });

        }
        private async Task InitializeDivisionsAsync()
        {
            var seasons = await seasonRepo.GetAllAsync();
            Console.WriteLine($"[DEBUG] Found {seasons.Count()} seasons to initialize divisions for.");
            if (seasons.Count() == 0)
            {
                Console.WriteLine("[DEBUG] No seasons found, skipping division initialization.");
                return;
            }
            Console.WriteLine($"[DEBUG] divisionRepo is null: {divisionRepo == null}");
            Console.WriteLine($"[DEBUG] seasonRepo is null: {seasonRepo == null}");
            Console.WriteLine($"[DEBUG] seasons is null: {seasons == null}");
            foreach (var season in seasons)
            {
                Console.WriteLine($"[DEBUG] Initializing divisions for season: {season.SeasonId}");
                await divisionRepo.InsertAsync(new Division
                {
                    CompanyId = 1,
                    SeasonId = season.SeasonId,
                    DivisionDescription = "HS Boys",
                    Gender = "M",
                    Gender2 = "F",
                    MinDate = new DateTime(2020, 08, 31).AddYears(-18),
                    MaxDate = new DateTime(2020, 09, 1).AddYears(-16),
                    Stats = true,
                    DraftVenue = "Mullins Hall",
                    DraftTime = "7:00 PM",
                    CreatedDate = DateTime.Now,
                    CreatedUser = "Seed"

                });
                await divisionRepo.InsertAsync(new Division
                {
                    CompanyId = 1,
                    SeasonId = season.SeasonId,
                    DivisionDescription = "JV Boys",
                    Gender = "M",
                    MinDate = new DateTime(2020, 08, 31).AddYears(-16),
                    MaxDate = new DateTime(2020, 09, 1).AddYears(-14),
                    Gender2 = "F",
                    Stats = true,
                    DraftVenue = "Mullins Hall",
                    DraftTime = "7:00 PM",
                    CreatedDate = DateTime.Now,
                    CreatedUser = "Seed"
                });
            }
        }
        private async Task InitializeTeamsAsync()
        {
            var seasons = await seasonRepo.GetAllAsync();
            var colors = await colorRepo.GetAllAsync();
            var ranColor = new Random();
            var ranTeams = new Random();
            foreach (var season in seasons)
            {
                var divisions = await divisionRepo.GetSeasonDivisionsAsync(season.SeasonId);
                var counter = 0;
                foreach (var division in divisions)
                {
                    for (var i = 1; i <= ranTeams.Next(4, 12); i++)
                    {
                        counter++;
                        await teamRepo.InsertAsync(new Team
                        {
                            // CompanyId = 1,
                            SeasonId = season.SeasonId,
                            DivisionId = division.DivisionId,
                            TeamNumber = i.ToString(),
                            TeamColorId = colors.ElementAt(ranColor.Next(1, colors.Count())).ColorId,
                            CreatedDate = DateTime.Now,
                            CreatedUser = "Seed",

                        });
                    }
                }
            }
        }
        private async Task InitializeColorsAsync()
        {
            int maxColorId = context.Colors.Any() ? context.Colors.Max(c => c.ColorId) : 0;
            maxColorId++;
            await colorRepo.InsertAsync(new Color
            {
                CompanyId = 1,
                ColorId = maxColorId,
                ColorName = "Red",
                Discontinued = false,
                CreatedDate = DateTime.Now,
                CreatedUser = "Seed",
            });
            maxColorId++;
            await colorRepo.InsertAsync(new Color
            {
                CompanyId = 1,
                ColorId = maxColorId,
                ColorName = "Blue",
                Discontinued = false,
                CreatedDate = DateTime.Now,
                CreatedUser = "Seed",

            });
            maxColorId++;
            await colorRepo.InsertAsync(new Color
            {
                CompanyId = 1,
                ColorId = maxColorId,
                ColorName = "Black",
                Discontinued = false,
                CreatedDate = DateTime.Now,
                CreatedUser = "Seed",

            });
            maxColorId++;
            await colorRepo.InsertAsync(new Color
            {
                CompanyId = 1,
                ColorId = maxColorId,
                ColorName = "Yellow",
                Discontinued = false,
                CreatedDate = DateTime.Now,
                CreatedUser = "Seed",

            });
            maxColorId++;
            await colorRepo.InsertAsync(new Color
            {
                CompanyId = 1,
                ColorId = maxColorId,
                ColorName = "Orange",
                Discontinued = false,
                CreatedDate = DateTime.Now,
                CreatedUser = "Seed",

            });
        }
        private async Task InitializeHouseholds()
        {
            var randomPhone = new Random();

            await householdRepo.InsertAsync(new Household
            {
                CompanyId = 1,
                Name = "Blarney",
                Phone = "954" + randomPhone.Next(1111110, 9999999).ToString(),
                City = "Coral Springs",
                State = "FL",
                Email = "Blarney@xyz.com"
            });
        }

    }
}