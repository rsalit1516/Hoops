
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
        private WebContentSeeder _webContentSeeder { get; set; }
        public SeedCoordinator(ISeasonRepository seasonRepo,
        IDivisionRepository divisionRepo,
        ITeamRepository teamRepo,
        IColorRepository colorRepo,
        IHouseholdRepository householdRepo,
        IPersonRepository personRepo,
        ILocationRepository locationRepo,
        IWebContentTypeRepository webContentTypeRepo,
        IWebContentRepository webContentRepo,
        hoopsContext context,
        WebContentSeeder webContentSeeder)
        {
            this.seasonRepo = seasonRepo;
            this.divisionRepo = divisionRepo;
            this.teamRepo = teamRepo;
            this.colorRepo = colorRepo;
            this.householdRepo = householdRepo;
            this.personRepo = personRepo;
            this.locationRepo = locationRepo;
            this.webContentTypeRepo = webContentTypeRepo;
            this.webContentRepo = webContentRepo;
            this.context = context;
            _webContentSeeder = webContentSeeder;
        }
        public async Task InitializeDataAsync()
        {
            //first delete all records    
            await DeleteTeamsAsync();
            await DeleteColorsAsync();
            // await DeleteDivisionsAsync();
            await DeleteSeasonDataAsync();
            await DeleteWebContentAsync();
            await DeleteWebContentTypeAsync();
            await DeletePersonsAsync();
            await DeleteHouseholdsAsync();
            //then create new records
            await CreateColorsAsync();
            await CreateSeasonsAsync();
            await CreateDivisionsAsync();
            await CreateTeamsAsync();
            await CreateWebContentTypeAsync();
            await _webContentSeeder.SeedAsync();
            await CreateWebContentAsync();
            await CreateHouseholdsAndPersonsAsync();
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

        private async Task CreateWebContentTypeAsync()
        {
            await InitializeWebContentTypeAsync();
            await context.SaveChangesAsync();
        }
        private async Task CreateWebContentAsync()
        {
            await InitializeWebContentAsync();
            await context.SaveChangesAsync();
        }

        private async Task CreateHouseholdsAndPersonsAsync()
        {
            await InitializeHouseholdsAndPersonsAsync();
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
        private async Task InitializeWebContentTypeAsync()
        {
            var entity = new WebContentType
            {
                WebContentTypeDescription = "Meeting"
            };
            var actual = await webContentTypeRepo.InsertAsync(entity);

            await webContentTypeRepo.InsertAsync(new WebContentType
            {
                WebContentTypeDescription = "Season Info"
            });

        }
        private async Task DeleteWebContentTypeAsync()
        {
            var records = await webContentTypeRepo.GetAllAsync();
            foreach (var record in records)
            {
                await webContentTypeRepo.DeleteAsync(record.WebContentTypeId);
            }
        }
        private async Task DeleteWebContentAsync()
        {
            var repo = webContentRepo;
            var records = await repo.GetAllAsync();
            foreach (var record in records)
            {
                await repo.DeleteAsync(record.WebContentId);
            }
        }
        private async Task InitializeWebContentAsync()
        {
            var repoType = webContentTypeRepo;
            var seasonInfo = await repoType.GetByDescriptionAsync("Season Info");
            var meeting = await repoType.GetByDescriptionAsync("Meeting");
            var repo = webContentRepo;
            await repo.InsertAsync(new WebContent
            {
                // WebContentId
                CompanyId = 1,
                Page = "1",
                WebContentTypeId = seasonInfo.WebContentTypeId,
                Title = "Second Test",
                ContentSequence = 2,
                SubTitle = "Second Subtitle",
                Location = "Mullins",
                DateAndTime = "7AM",
                Body = "I ain't go no body",
                ExpirationDate = DateTime.Now.AddDays(30)
            });

            await repo.InsertAsync(new WebContent
            {
                // WebContentId
                CompanyId = 1,
                Page = "1",
                WebContentTypeId = seasonInfo.WebContentTypeId,
                Title = "First Test",
                ContentSequence = 1,
                SubTitle = "First Subtitle",
                Location = "Mullins",
                DateAndTime = "6AM",
                Body = "I ain't go no body",
                ExpirationDate = DateTime.Now.AddDays(30)
            });
            await repo.InsertAsync(new WebContent
            {
                // WebContentId
                CompanyId = 1,
                Page = "1",
                WebContentTypeId = meeting.WebContentTypeId,
                Title = "Meeting",
                ContentSequence = 1,
                SubTitle = "Meet by the school",
                Location = "Mullins Hall",
                DateAndTime = "7PM",
                Body = "Meeting info",
                ExpirationDate = DateTime.Now.AddDays(30)
            });
            await repo.InsertAsync(new WebContent
            {
                // WebContentId
                CompanyId = 1,
                Page = "1",
                WebContentTypeId = seasonInfo.WebContentTypeId,
                Title = "Second Test",
                ContentSequence = 1,
                SubTitle = "Second Subtitle",
                Location = "Mullins",
                DateAndTime = "7AM",
                Body = "I ain't go no body",
                ExpirationDate = DateTime.Now.AddDays(-3)
            });
        }
        // ...existing code...

        private async Task DeleteHouseholdsAsync()
        {
            var records = await householdRepo.GetAllAsync();
            foreach (var record in records)
            {
                await householdRepo.DeleteAsync(record.HouseId);
            }
        }

        private async Task DeletePersonsAsync()
        {
            var records = await personRepo.GetAllAsync();
            foreach (var record in records)
            {
                await personRepo.DeleteAsync(record.PersonId);
            }
        }

        private async Task InitializeHouseholdsAndPersonsAsync()
        {
            var random = new Random();
            var householdNames = new[] { "Smith", "Johnson", "Williams", "Brown", "Jones" };
            var firstNames = new[] { "John", "Jane", "Alex", "Chris", "Pat", "Taylor", "Jordan", "Morgan", "Casey", "Sam" };

            // Insert 5 households
            for (int i = 0; i < householdNames.Length; i++)
            {
                var household = new Household
                {
                    CompanyId = 1,
                    HouseId = i + 1, // Assuming HouseId is sequential starting from 1
                    Name = householdNames[i],
                    Phone = "954" + random.Next(1000000, 9999999).ToString(),
                    City = "Coral Springs",
                    State = "FL",
                    Email = $"{householdNames[i].ToLower()}@example.com"
                };
                await householdRepo.InsertAsync(household);

                // Insert 2-5 people for each household
                int peopleCount = random.Next(2, 6);
                for (int j = 0; j < peopleCount; j++)
                {
                    var person = new Person
                    {
                        FirstName = firstNames[random.Next(firstNames.Length)],
                        LastName = householdNames[i],
                        HouseId = household.HouseId,
                        CompanyId = 1,
                        BirthDate = DateTime.Now.AddYears(-random.Next(5, 50)).AddDays(random.Next(1, 365)),
                        CreatedDate = DateTime.Now,
                        CreatedUser = "Seed"
                    };
                    await personRepo.InsertAsync(person);
                }
            }
        }
    }
}