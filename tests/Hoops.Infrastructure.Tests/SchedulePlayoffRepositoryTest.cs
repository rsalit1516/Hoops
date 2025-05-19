using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Infrastructure.Tests
{
    public class SchedulePlayoffRepositoryTests
    {
        private readonly hoopsContext _context;
        private readonly SchedulePlayoffRepository _repository;

        public SchedulePlayoffRepositoryTests(TestDatabaseFixture fixture)
        {
            // Set up an in-memory database
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(databaseName: "HoopsTestDb")
                .Options;
            _context = new hoopsContext(options);
            _repository = new SchedulePlayoffRepository(_context);
            // Seed the database with test data
            SeedDatabase();

        }
        private void SeedDatabase()
        {
            _context.Seasons.AddRange(
                new Season
                {
                    Description = "Summer 2020",
                    CurrentSchedule = true,
                    CurrentSignUps = true,
                    CurrentSeason = true,
                    CompanyId = 1,
                    FromDate = new DateTime(2020, 6, 15),
                    ToDate = new DateTime(2020, 8, 31),
                    ParticipationFee = 110

                },
            new Season
            {
                Description = "Spring 2020",
                CurrentSchedule = false,
                CurrentSignUps = false,
                CurrentSeason = false,
                CompanyId = 1,
                FromDate = new DateTime(2020, 3, 15),
                ToDate = new DateTime(2020, 5, 16),
                ParticipationFee = 110
            },
            new Season
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
            _context.SaveChanges();

            var seasons = _context.Seasons;
            foreach (var season in seasons)
            {
                _context.Divisions.AddRange(
                    new Division
                    {
                        CompanyId = 1,
                        SeasonId = season.SeasonId,
                        DivisionDescription = "HS Boys",
                        Gender = "M",
                        MinDate = new DateTime(2020, 08, 31).AddYears(-18),
                        MaxDate = new DateTime(2020, 09, 1).AddYears(-16)

                    },
                new Division
                {
                    CompanyId = 1,
                    SeasonId = season.SeasonId,
                    DivisionDescription = "JV Boys",
                    Gender = "M",
                    MinDate = new DateTime(2020, 08, 31).AddYears(-16),
                    MaxDate = new DateTime(2020, 09, 1).AddYears(-14)

                });
                _context.SaveChanges();

            }
            ;

            var firstDivision = _context.Divisions.FirstOrDefault();
            var divisionid = firstDivision != null ? firstDivision.DivisionId : 0;


            // Add test data to the in-memory database
            _context.SchedulePlayoffs.AddRange(new List<SchedulePlayoff>
            {
  new SchedulePlayoff
        {
            ScheduleNumber = 1,
            GameNumber = 1,
            LocationNumber = 101,
            GameDate = new DateTime(2025, 6, 1),
            GameTime = "7:00 PM",
            VisitingTeam = "Tigers",
            HomeTeam = "Lions",
            Descr = "Quarterfinal",
            VisitingTeamScore = 55,
            HomeTeamScore = 60,
            DivisionId = divisionid
        },
        new SchedulePlayoff
        {
            ScheduleNumber = 1,
            GameNumber = 2,
            LocationNumber = 102,
            GameDate = new DateTime(2025, 6, 2),
            GameTime = "8:00 PM",
            VisitingTeam = "Bears",
            HomeTeam = "Wolves",
            Descr = "Quarterfinal",
            VisitingTeamScore = 48,
            HomeTeamScore = 52,
            DivisionId = divisionid
        },
        new SchedulePlayoff
        {
            ScheduleNumber = 2,
            GameNumber = 1,
            LocationNumber = 103,
            GameDate = new DateTime(2025, 6, 3),
            GameTime = "6:00 PM",
            VisitingTeam = "Eagles",
            HomeTeam = "Sharks",
            Descr = "Semifinal",
            VisitingTeamScore = 62,
            HomeTeamScore = 58,
            DivisionId = divisionid
        }
            });

            _context.SaveChanges();
        }

        [Fact]
        public void GetGamesBySeasonId_ShouldReturnGamesVm()
        {
            // Arrange
            var seasonId = 1;

            // Act
            var gamesVm = _repository.GetGamesBySeasonId(seasonId);

            // Assert
            Assert.NotNull(gamesVm);
            Assert.IsType<List<PlayoffGameVm>>(gamesVm);
        }
    }
}