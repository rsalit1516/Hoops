
using System;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Data;
using Microsoft.Extensions.Logging;
using Hoops.Core.Interface;

namespace Hoops.Data
{
    public class Seed
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
        public Seed(ISeasonRepository seasonRepo,
        ITeamRepository teamRepo,
        IColorRepository colorRepo,
        IPersonRepository personRepo,
        ILocationRepository locationRepo,
        IWebContentTypeRepository webContentTypeRepo,
        IWebContentRepository webContentRepo,
        hoopsContext context)
        {
            this.seasonRepo = seasonRepo;
            this.teamRepo = teamRepo;
            this.colorRepo = colorRepo;
            this.personRepo = personRepo;
            this.locationRepo = locationRepo;
            this.webContentTypeRepo = webContentTypeRepo;
            this.webContentRepo = webContentRepo;
            this.context = context;
        }
        public async Task InitializeDataAsync()
        {
            await DeleteTeamsAsync();
            await DeleteColorsAsync();
            await DeleteDivisionsAsync();
            await DeleteSeasonDataAsync();
            await DeleteAllAsync();
            await DeleteWebContentAsync();
            await CreateColorsAsync();
            await CreateSeasonsAsync();
            await CreateDivisionsAsync();
            await CreateTeamsAsync();
            await CreateWebContentTypeAsync();
            await CreateWebContentAsync();

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

            await seasonRepo.InsertAsync(new Season
            {
                Description = "Summer 2020",
                CurrentSchedule = true,
                CurrentSignUps = true,
                CurrentSeason = true,
                CompanyId = 1,
                FromDate = new DateTime(2020, 6, 15),
                ToDate = new DateTime(2020, 8, 31),
                ParticipationFee = 110

            });
            await seasonRepo.InsertAsync(new Season
            {
                Description = "Spring 2020",
                CurrentSchedule = false,
                CurrentSignUps = false,
                CurrentSeason = false,
                CompanyId = 1,
                FromDate = new DateTime(2020, 3, 15),
                ToDate = new DateTime(2020, 5, 16),
                ParticipationFee = 110
            });
            await seasonRepo.InsertAsync(new Season
            {
                Description = "Winter 2020",
                CurrentSchedule = false,
                CurrentSignUps = false,
                CurrentSeason = false,
                CompanyId = 1,
                FromDate = new DateTime(2019, 11, 15),
                ToDate = new DateTime(2020, 3, 6),
                ParticipationFee = 110
            });

        }
        private async Task InitializeDivisionsAsync()
        {
            var seasons = await seasonRepo.GetAllAsync();
            foreach (var season in seasons)
            {
                await divisionRepo.InsertAsync(new Division
                {
                    CompanyId = 1,
                    SeasonId = season.SeasonId,
                    DivisionDescription = "HS Boys",
                    Gender = "M",
                    MinDate = new DateTime(2020, 08, 31).AddYears(-18),
                    MaxDate = new DateTime(2020, 09, 1).AddYears(-16)

                });
                await divisionRepo.InsertAsync(new Division
                {
                    CompanyId = 1,
                    SeasonId = season.SeasonId,
                    DivisionDescription = "JV Boys",
                    Gender = "M",
                    MinDate = new DateTime(2020, 08, 31).AddYears(-16),
                    MaxDate = new DateTime(2020, 09, 1).AddYears(-14)

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
                            TeamColorId = colors.ElementAt(ranColor.Next(1, colors.Count())).ColorId
                        });
                    }
                }
            }
        }
        private async Task InitializeColorsAsync()
        {
            await colorRepo.InsertAsync(new Color
            {
                CompanyId = 1,
                ColorName = "Red"
            });
            await colorRepo.InsertAsync(new Color
            {
                CompanyId = 1,
                ColorName = "Blue"
            });
            await colorRepo.InsertAsync(new Color
            {
                CompanyId = 1,
                ColorName = "Black"
            });
            await colorRepo.InsertAsync(new Color
            {
                CompanyId = 1,
                ColorName = "Yellow"
            });
            await colorRepo.InsertAsync(new Color
            {
                CompanyId = 1,
                ColorName = "Orange"
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
        private async Task DeleteAllAsync()
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
        //private Array
    }
}