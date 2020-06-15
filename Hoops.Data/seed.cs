
using System;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Entities;
using Hoops.Infrastructure.Repository;

namespace Hoops.Data
{
    public class Seed
    {

        public hoopsContext Context { get; private set; }
        public SeasonRepository SeasonRepo { get; private set; }
        public DivisionRepository DivisionRepo { get; private set; }
        public TeamRepository TeamRepo { get; private set; }
        public ColorRepository ColorRepo { get; private set; }
        public HouseholdRepository HouseholdRepo { get; private set; }
        public PersonRepository PersonRepo { get; private set; }
        public ScheduleLocationRepository LocationRepo { get; private set; }
        public Seed()
        {
            Context = new hoopsContext();
            SeasonRepo = new SeasonRepository(Context);
            DivisionRepo = new DivisionRepository(Context);
            TeamRepo = new TeamRepository(Context);
            ColorRepo = new ColorRepository(Context);
            HouseholdRepo = new HouseholdRepository(Context);
            PersonRepo = new PersonRepository(Context);
            LocationRepo = new ScheduleLocationRepository(Context);
        }
        public async Task InitializeDataAsync()
        {
            await DeleteTeamsAsync();
            await DeleteColorsAsync();
            await DeleteDivisionsAsync();
            await DeleteSeasonDataAsync();
            await CreateColorsAsync();
            await CreateSeasonsAsync();
            await CreateDivisionsAsync();
            await CreateTeamsAsync();
        }

        private async Task CreateSeasonsAsync()
        {
            await InitializeSeasonsAsync();
            await Context.SaveChangesAsync();
        }
        private async Task CreateDivisionsAsync()
        {
            await InitializeDivisionsAsync();
            await Context.SaveChangesAsync();
        }
        private async Task CreateColorsAsync()
        {
            await InitializeColorsAsync();
            await Context.SaveChangesAsync();
        }
        private async Task CreateTeamsAsync()
        {
            await InitializeTeamsAsync();
            await Context.SaveChangesAsync();
        }

        private async Task DeleteSeasonDataAsync()
        {
            var records = await SeasonRepo.GetAllAsync();
            foreach (var record in records)
            {
                await SeasonRepo.DeleteAsync(record.SeasonId);
            }
        }
        private async Task DeleteDivisionsAsync()
        {
            var records = await DivisionRepo.GetAllAsync();
            foreach (var record in records)
            {
                await DivisionRepo.DeleteAsync(record.DivisionId);
            }
        }
        private async Task DeleteTeamsAsync()
        {
            var records = await TeamRepo.GetAllAsync();
            foreach (var record in records)
            {
                await TeamRepo.DeleteAsync(record.TeamId);
            }
        }
        private async Task DeleteColorsAsync()
        {
            var records = await ColorRepo.GetAllAsync();
            foreach (var record in records)
            {
                await ColorRepo.DeleteAsync(record.ColorId);
            }
        }

        private async Task InitializeSeasonsAsync()
        {

            await SeasonRepo.InsertAsync(new Season
            {
                SeaDesc = "Summer 2020",
                CurrentSchedule = true,
                CurrentSignUps = true,
                CurrentSeason = true,
                CompanyId = 1,
                FromDate = new DateTime(2020, 6, 15),
                ToDate = new DateTime(2020, 8, 31),
                ParticipationFee = 110

            });
            await SeasonRepo.InsertAsync(new Season
            {
                SeaDesc = "Spring 2020",
                CurrentSchedule = false,
                CurrentSignUps = false,
                CurrentSeason = false,
                CompanyId = 1,
                FromDate = new DateTime(2020, 3, 15),
                ToDate = new DateTime(2020, 5, 16),
                ParticipationFee = 110
            });
            await SeasonRepo.InsertAsync(new Season
            {
                SeaDesc = "Winter 2020",
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
            var seasons = await SeasonRepo.GetAllAsync();
            foreach (var season in seasons)
            {
                await DivisionRepo.InsertAsync(new Division
                {
                    CompanyId = 1,
                    SeasonId = season.SeasonId,
                    DivisionDescription = "HS Boys",
                    Gender = "M",
                    MinDate = new DateTime(2020, 08, 31).AddYears(-18),
                    MaxDate = new DateTime(2020, 09, 1).AddYears(-16)

                });
                await DivisionRepo.InsertAsync(new Division
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
            var seasons = await SeasonRepo.GetAllAsync();
            var colors = await ColorRepo.GetAllAsync();
            var ranColor = new Random();
            var ranTeams = new Random();
            foreach (var season in seasons)
            {
                var divisions = await DivisionRepo.GetSeasonDivisionsAsync(season.SeasonId);
                var counter = 0;
                foreach (var division in divisions)
                {
                    for (var i = 1; i <= ranTeams.Next(4, 12); i++)
                    {
                        counter++;
                        await TeamRepo.InsertAsync(new Team
                        {
                            CompanyId = 1,
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
            await ColorRepo.InsertAsync(new Color
            {
                CompanyId = 1,
                ColorName = "Red"
            });
            await ColorRepo.InsertAsync(new Color
            {
                CompanyId = 1,
                ColorName = "Blue"
            });
            await ColorRepo.InsertAsync(new Color
            {
                CompanyId = 1,
                ColorName = "Black"
            });
            await ColorRepo.InsertAsync(new Color
            {
                CompanyId = 1,
                ColorName = "Yellow"
            });
            await ColorRepo.InsertAsync(new Color
            {
                CompanyId = 1,
                ColorName = "Orange"
            });
        }
        private async Task InitializeHouseholds()
        {
            var randomPhone = new Random();

            await HouseholdRepo.InsertAsync(new Household
            {
                CompanyId = 1,
                Name = "Blarney",
                Phone = "954" + randomPhone.Next(1111110, 9999999).ToString(),
                City = "Coral Springs",
                State = "FL",
                Email = "Blarney@xyz.com"
            });
        }
        //private Array
    }
}