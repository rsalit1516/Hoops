using System;
using System.Threading.Tasks;
using Xunit;

namespace Hoops.Application.Tests
{
    public class SeasonServiceTest
    {
        [Fact]
        public async Task GetCurrentSeason_ReturnsActiveSeason()
        {
            // Arrange
            var repo = new TestSeasonRepository();
            var season = new Hoops.Core.Models.Season { SeasonId = 1, CompanyId = 1, Description = "Summer 2025", CurrentSeason = true };
            repo.AddSeason(season);
            var service = new Hoops.Application.Services.SeasonService(repo);

            // Act
            var result = await service.GetCurrentSeasonAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.SeasonId);
            Assert.True(result.CurrentSeason);
        }
        [Fact]
        public async Task AddDivisionToSeason_AddsDivision()
        {
            var repo = new TestSeasonRepository();
            var season = new Hoops.Core.Models.Season { SeasonId = 2, CompanyId = 1, Description = "Fall 2025" };
            repo.AddSeason(season);
            var service = new Hoops.Application.Services.SeasonService(repo);
            var division = new Hoops.Core.Models.Division { DivisionId = 10, SeasonId = 2, DivisionDescription = "10U Boys" };

            var result = await service.AddDivisionToSeason(2, division);

            Assert.NotNull(result);
            Assert.Equal(10, result.DivisionId);
            var updatedSeason = await repo.GetByIdAsync(2);
            Assert.Contains(updatedSeason.Divisions, d => d.DivisionId == 10);
        }

        [Fact]
        public async Task AddTeamToSeason_AddsTeam()
        {
            var repo = new TestSeasonRepository();
            var season = new Hoops.Core.Models.Season { SeasonId = 3, CompanyId = 1, Description = "Winter 2025" };
            repo.AddSeason(season);
            var service = new Hoops.Application.Services.SeasonService(repo);
            var team = new Hoops.Core.Models.Team { TeamId = 20, DivisionId = 1 };

            var result = await service.AddTeamToSeason(3, team);

            Assert.NotNull(result);
            Assert.Equal(20, result.TeamId);
            var updatedSeason = await repo.GetByIdAsync(3);
            Assert.Contains(updatedSeason.Teams, t => t.TeamId == 20);
        }

        [Fact]
        public async Task AddScheduleGameToSeason_AddsGame()
        {
            var repo = new TestSeasonRepository();
            var season = new Hoops.Core.Models.Season { SeasonId = 4, CompanyId = 1, Description = "Spring 2026" };
            repo.AddSeason(season);
            var service = new Hoops.Application.Services.SeasonService(repo);
            var game = new Hoops.Core.Models.ScheduleGame { ScheduleGamesId = 30, ScheduleNumber = 1, GameNumber = 1 };

            var result = await service.AddScheduleGameToSeason(4, game);

            Assert.NotNull(result);
            Assert.Equal(30, result.ScheduleGamesId);
            var updatedSeason = await repo.GetByIdAsync(4);
            Assert.Contains(updatedSeason.ScheduleGames, g => g.ScheduleGamesId == 30);
        }

        [Fact]
        public async Task AddScheduleDivTeamToSeason_AddsScheduleDivTeam()
        {
            var repo = new TestSeasonRepository();
            var season = new Hoops.Core.Models.Season { SeasonId = 5, CompanyId = 1, Description = "Summer 2026" };
            repo.AddSeason(season);
            var service = new Hoops.Application.Services.SeasonService(repo);
            var sdt = new Hoops.Core.Models.ScheduleDivTeam { ScheduleDivTeamsId = 40, SeasonId = 5 };

            var result = await service.AddScheduleDivTeamToSeason(5, sdt);

            Assert.NotNull(result);
            Assert.Equal(40, result.ScheduleDivTeamsId);
            var updatedSeason = await repo.GetByIdAsync(5);
            Assert.Contains(updatedSeason.ScheduleDivTeams, sdt2 => sdt2.ScheduleDivTeamsId == 40);
        }

        [Fact]
        public async Task GetCurrentSeason_Throws_WhenNoCurrentSeason()
        {
            var repo = new TestSeasonRepository();
            // No seasons added -> repository returns null
            var service = new Hoops.Application.Services.SeasonService(repo);

            await Assert.ThrowsAsync<InvalidOperationException>(() => service.GetCurrentSeasonAsync(1));
        }
    }
}
