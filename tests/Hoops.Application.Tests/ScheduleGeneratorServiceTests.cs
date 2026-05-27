using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Application.Services;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Core.Scheduling;
using Hoops.Core.ViewModels;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace Hoops.Application.Tests
{
    // ── GameTimeSlotManager tests ──────────────────────────────────────────────

    public class GameTimeSlotManagerTests
    {
        private static AvailableTimeSlot Slot(int divId, DayOfWeek day, int hour, int locationId) =>
            new() { DivisionId = divId, DayOfWeek = day, StartTime = TimeSpan.FromHours(hour), LocationId = locationId };

        [Fact]
        public void GetLocationsForDivisionAndDay_ReturnsConfiguredLocations()
        {
            var mgr = new GameTimeSlotManager(new[]
            {
                Slot(1, DayOfWeek.Saturday, 9, 1),
                Slot(1, DayOfWeek.Saturday, 10, 2),
                Slot(1, DayOfWeek.Monday, 18, 1),
            });

            var result = mgr.GetLocationsForDivisionAndDay(1, DayOfWeek.Saturday).ToList();

            Assert.Equal(2, result.Count);
            Assert.Contains(1, result);
            Assert.Contains(2, result);
        }

        [Fact]
        public void GetLocationsForDivisionAndDay_ReturnsEmpty_WhenNoneConfigured()
        {
            var mgr = new GameTimeSlotManager(new[] { Slot(1, DayOfWeek.Saturday, 9, 1) });

            var result = mgr.GetLocationsForDivisionAndDay(2, DayOfWeek.Saturday).ToList();

            Assert.Empty(result);
        }

        [Fact]
        public void GetLocationsForDivisionAndDay_DeduplicatesLocations()
        {
            var mgr = new GameTimeSlotManager(new[]
            {
                Slot(1, DayOfWeek.Saturday, 9, 1),
                Slot(1, DayOfWeek.Saturday, 10, 1),  // same location, different time
            });

            var result = mgr.GetLocationsForDivisionAndDay(1, DayOfWeek.Saturday).ToList();

            Assert.Single(result);
            Assert.Equal(1, result[0]);
        }

        [Fact]
        public void ClaimNextSlot_ReturnsFirstAvailableTime()
        {
            var mgr = new GameTimeSlotManager(new[]
            {
                Slot(1, DayOfWeek.Saturday, 9, 1),
                Slot(1, DayOfWeek.Saturday, 10, 1),
            });
            var saturday = new DateTime(2026, 1, 3); // a Saturday

            var result = mgr.ClaimNextSlot(1, saturday, 1);

            Assert.Equal(TimeSpan.FromHours(9), result);
        }

        [Fact]
        public void ClaimNextSlot_ReturnsNextTime_AfterFirstClaimed()
        {
            var mgr = new GameTimeSlotManager(new[]
            {
                Slot(1, DayOfWeek.Saturday, 9, 1),
                Slot(1, DayOfWeek.Saturday, 10, 1),
            });
            var saturday = new DateTime(2026, 1, 3);
            mgr.ClaimNextSlot(1, saturday, 1); // claim 9 AM

            var result = mgr.ClaimNextSlot(1, saturday, 1);

            Assert.Equal(TimeSpan.FromHours(10), result);
        }

        [Fact]
        public void ClaimNextSlot_ReturnsNull_WhenAllSlotsClaimed()
        {
            var mgr = new GameTimeSlotManager(new[] { Slot(1, DayOfWeek.Saturday, 9, 1) });
            var saturday = new DateTime(2026, 1, 3);
            mgr.ClaimNextSlot(1, saturday, 1);

            var result = mgr.ClaimNextSlot(1, saturday, 1);

            Assert.Null(result);
        }

        [Fact]
        public void ClaimNextSlot_ReturnsNull_WhenNoneConfiguredForDivision()
        {
            var mgr = new GameTimeSlotManager(new[] { Slot(1, DayOfWeek.Saturday, 9, 1) });
            var saturday = new DateTime(2026, 1, 3);

            var result = mgr.ClaimNextSlot(2, saturday, 1);

            Assert.Null(result);
        }

        [Fact]
        public void ClaimNextSlot_CourtSharedAcrossDivisions()
        {
            // Both divisions share court 1 on Saturday. Division 1 claims 9 AM first;
            // division 2 should get 10 AM because 9 AM is now occupied on that court.
            var mgr = new GameTimeSlotManager(new[]
            {
                Slot(1, DayOfWeek.Saturday, 9, 1),
                Slot(1, DayOfWeek.Saturday, 10, 1),
                Slot(2, DayOfWeek.Saturday, 9, 1),
                Slot(2, DayOfWeek.Saturday, 10, 1),
            });
            var saturday = new DateTime(2026, 1, 3);
            mgr.ClaimNextSlot(1, saturday, 1); // div 1 claims 9 AM

            var result = mgr.ClaimNextSlot(2, saturday, 1);

            Assert.Equal(TimeSpan.FromHours(10), result);
        }

        [Fact]
        public void ClaimNextSlot_DifferentDatesAreIndependent()
        {
            var mgr = new GameTimeSlotManager(new[] { Slot(1, DayOfWeek.Saturday, 9, 1) });
            var sat1 = new DateTime(2026, 1, 3);
            var sat2 = new DateTime(2026, 1, 10);
            mgr.ClaimNextSlot(1, sat1, 1); // claim on week 1

            var result = mgr.ClaimNextSlot(1, sat2, 1); // week 2 should be fresh

            Assert.Equal(TimeSpan.FromHours(9), result);
        }
    }

    // ── ScheduleGeneratorService tests ────────────────────────────────────────

    public class ScheduleGeneratorServiceTests
    {
        private ScheduleGeneratorService CreateService(
            TestTeamRepo? teamRepo = null,
            TestDivisionRepo? divRepo = null,
            TestLocationRepo? locRepo = null,
            TestGameRepo? gameRepo = null)
        {
            return new ScheduleGeneratorService(
                teamRepo ?? new TestTeamRepo(),
                divRepo ?? new TestDivisionRepo(),
                locRepo ?? new TestLocationRepo(),
                gameRepo ?? new TestGameRepo(),
                NullLogger<ScheduleGeneratorService>.Instance);
        }

        private static ScheduleGeneratorRequest BaseRequest(
            DateTime start, DateTime end, List<int> divIds,
            List<AvailableTimeSlot> slots) => new()
        {
            SeasonId = 1,
            StartDate = start,
            EndDate = end,
            DivisionIds = divIds,
            GamesPerTeam = 2,
            MaxGamesPerWeekPerTeam = 2,
            GameDurationMinutes = 60,
            TimeSlots = slots,
            BlackoutDates = new(),
            EnforceCoachConflicts = false,
        };

        private static AvailableTimeSlot Slot(int divId, DayOfWeek day, int hour, int loc) =>
            new() { DivisionId = divId, DayOfWeek = day, StartTime = TimeSpan.FromHours(hour), LocationId = loc };

        // ── Validation ──────────────────────────────────────────────────────

        [Fact]
        public async Task PreviewAsync_EmptyDivisionIds_ReturnsFailure()
        {
            var svc = CreateService();
            var req = BaseRequest(new DateTime(2026, 1, 1), new DateTime(2026, 6, 1), new List<int>(), new());

            var result = await svc.PreviewAsync(req);

            Assert.False(result.Success);
            Assert.Contains("division", result.ErrorMessage, StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task PreviewAsync_StartDateAfterEndDate_ReturnsFailure()
        {
            var svc = CreateService();
            var req = BaseRequest(new DateTime(2026, 6, 1), new DateTime(2026, 1, 1), new List<int> { 1 }, new());

            var result = await svc.PreviewAsync(req);

            Assert.False(result.Success);
            Assert.Contains("start date", result.ErrorMessage, StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task PreviewAsync_ZeroGamesPerTeam_ReturnsFailure()
        {
            var svc = CreateService();
            var req = BaseRequest(new DateTime(2026, 1, 1), new DateTime(2026, 6, 1), new List<int> { 1 }, new());
            req.GamesPerTeam = 0;

            var result = await svc.PreviewAsync(req);

            Assert.False(result.Success);
            Assert.Contains("games per team", result.ErrorMessage, StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task PreviewAsync_NoTimeSlots_ReturnsFailure()
        {
            var svc = CreateService();
            var req = BaseRequest(new DateTime(2026, 1, 1), new DateTime(2026, 6, 1), new List<int> { 1 }, new());

            var result = await svc.PreviewAsync(req);

            Assert.False(result.Success);
            Assert.Contains("time slot", result.ErrorMessage, StringComparison.OrdinalIgnoreCase);
        }

        // ── Scheduling ──────────────────────────────────────────────────────

        [Fact]
        public async Task PreviewAsync_TwoTeamsOneDivision_SchedulesOneGame()
        {
            // 2 teams, gamesPerTeam=1 → exactly 1 game
            var divRepo = new TestDivisionRepo();
            divRepo.Add(new Division { DivisionId = 1, DivisionDescription = "10U" });

            var teamRepo = new TestTeamRepo();
            teamRepo.AddTeamsForDivision(1, new List<Team>
            {
                new() { TeamId = 1, DivisionId = 1, TeamNumber = "1", TeamName = "Red" },
                new() { TeamId = 2, DivisionId = 1, TeamNumber = "2", TeamName = "Blue" },
            });

            var locRepo = new TestLocationRepo(new Location { LocationNumber = 1, LocationName = "Gym A" });
            var svc = CreateService(teamRepo, divRepo, locRepo);

            // First Saturday in range: 2026-01-03
            var req = BaseRequest(
                new DateTime(2026, 1, 1), new DateTime(2026, 1, 31),
                new List<int> { 1 },
                new List<AvailableTimeSlot> { Slot(1, DayOfWeek.Saturday, 9, 1) });
            req.GamesPerTeam = 1;

            var result = await svc.PreviewAsync(req);

            Assert.True(result.Success);
            Assert.Single(result.Games);
        }

        [Fact]
        public async Task PreviewAsync_GameTimesMatchConfiguredSlots()
        {
            // Saturday 9 AM slot — all games must be on Saturdays at 9 AM
            var divRepo = new TestDivisionRepo();
            divRepo.Add(new Division { DivisionId = 1, DivisionDescription = "10U" });

            var teamRepo = new TestTeamRepo();
            teamRepo.AddTeamsForDivision(1, new List<Team>
            {
                new() { TeamId = 1, DivisionId = 1, TeamNumber = "1" },
                new() { TeamId = 2, DivisionId = 1, TeamNumber = "2" },
                new() { TeamId = 3, DivisionId = 1, TeamNumber = "3" },
            });

            var locRepo = new TestLocationRepo(new Location { LocationNumber = 1, LocationName = "Gym A" });
            var svc = CreateService(teamRepo, divRepo, locRepo);

            var req = BaseRequest(
                new DateTime(2026, 1, 1), new DateTime(2026, 3, 31),
                new List<int> { 1 },
                new List<AvailableTimeSlot> { Slot(1, DayOfWeek.Saturday, 9, 1) });

            var result = await svc.PreviewAsync(req);

            Assert.True(result.Success);
            Assert.All(result.Games, g =>
            {
                Assert.Equal(DayOfWeek.Saturday, g.GameDate.DayOfWeek);
                Assert.Equal(9, g.GameDate.Hour);
                Assert.Equal(0, g.GameDate.Minute);
            });
        }

        [Fact]
        public async Task PreviewAsync_TwoDivisions_BothDivisionsGetGames()
        {
            var divRepo = new TestDivisionRepo();
            divRepo.Add(new Division { DivisionId = 1, DivisionDescription = "10U" });
            divRepo.Add(new Division { DivisionId = 2, DivisionDescription = "12U" });

            var teamRepo = new TestTeamRepo();
            teamRepo.AddTeamsForDivision(1, MakeTeams(1, 4));
            teamRepo.AddTeamsForDivision(2, MakeTeams(2, 4));

            var locRepo = new TestLocationRepo(
                new Location { LocationNumber = 1, LocationName = "Gym A" },
                new Location { LocationNumber = 2, LocationName = "Gym B" });
            var svc = CreateService(teamRepo, divRepo, locRepo);

            var req = BaseRequest(
                new DateTime(2026, 1, 1), new DateTime(2026, 6, 30),
                new List<int> { 1, 2 },
                new List<AvailableTimeSlot>
                {
                    Slot(1, DayOfWeek.Saturday, 9, 1),
                    Slot(1, DayOfWeek.Saturday, 10, 1),
                    Slot(2, DayOfWeek.Saturday, 9, 2),
                    Slot(2, DayOfWeek.Saturday, 10, 2),
                });
            req.GamesPerTeam = 2;

            var result = await svc.PreviewAsync(req);

            Assert.True(result.Success);
            var div1Games = result.Games.Where(g => g.DivisionId == 1).ToList();
            var div2Games = result.Games.Where(g => g.DivisionId == 2).ToList();
            Assert.NotEmpty(div1Games);
            Assert.NotEmpty(div2Games);
        }

        [Fact]
        public async Task PreviewAsync_RespectsMaxGamesPerWeekPerTeam()
        {
            var divRepo = new TestDivisionRepo();
            divRepo.Add(new Division { DivisionId = 1, DivisionDescription = "10U" });

            var teamRepo = new TestTeamRepo();
            teamRepo.AddTeamsForDivision(1, MakeTeams(1, 2));

            var locRepo = new TestLocationRepo(new Location { LocationNumber = 1, LocationName = "Gym A" });
            var svc = CreateService(teamRepo, divRepo, locRepo);

            var req = BaseRequest(
                new DateTime(2026, 1, 1), new DateTime(2026, 6, 30),
                new List<int> { 1 },
                new List<AvailableTimeSlot>
                {
                    Slot(1, DayOfWeek.Saturday, 9, 1),
                    Slot(1, DayOfWeek.Saturday, 10, 1),
                    Slot(1, DayOfWeek.Saturday, 11, 1),
                });
            req.GamesPerTeam = 4;
            req.MaxGamesPerWeekPerTeam = 1;

            var result = await svc.PreviewAsync(req);

            Assert.True(result.Success);
            // With 2 teams, max 1 game/week: they should be spread across different weeks
            var weekGroups = result.Games
                .GroupBy(g => GetWeekStart(g.GameDate))
                .ToList();
            Assert.All(weekGroups, wg => Assert.Single(wg));
        }

        [Fact]
        public async Task PreviewAsync_SkipsDivisionWithFewerThanTwoTeams()
        {
            var divRepo = new TestDivisionRepo();
            divRepo.Add(new Division { DivisionId = 1, DivisionDescription = "10U" });
            divRepo.Add(new Division { DivisionId = 2, DivisionDescription = "12U" });

            var teamRepo = new TestTeamRepo();
            teamRepo.AddTeamsForDivision(1, MakeTeams(1, 1)); // only 1 team
            teamRepo.AddTeamsForDivision(2, MakeTeams(2, 2));

            var locRepo = new TestLocationRepo(new Location { LocationNumber = 1, LocationName = "Gym A" });
            var svc = CreateService(teamRepo, divRepo, locRepo);

            var req = BaseRequest(
                new DateTime(2026, 1, 1), new DateTime(2026, 6, 30),
                new List<int> { 1, 2 },
                new List<AvailableTimeSlot>
                {
                    Slot(1, DayOfWeek.Saturday, 9, 1),
                    Slot(2, DayOfWeek.Saturday, 9, 1),
                });

            var result = await svc.PreviewAsync(req);

            Assert.True(result.Success);
            Assert.All(result.Games, g => Assert.Equal(2, g.DivisionId));
        }

        [Fact]
        public async Task PreviewAsync_RespectsBlackoutDates()
        {
            var divRepo = new TestDivisionRepo();
            divRepo.Add(new Division { DivisionId = 1, DivisionDescription = "10U" });

            var teamRepo = new TestTeamRepo();
            teamRepo.AddTeamsForDivision(1, MakeTeams(1, 2));

            var locRepo = new TestLocationRepo(new Location { LocationNumber = 1, LocationName = "Gym A" });
            var svc = CreateService(teamRepo, divRepo, locRepo);

            // Range contains two Saturdays: Jan 3 and Jan 10. Black out Jan 3.
            var req = BaseRequest(
                new DateTime(2026, 1, 1), new DateTime(2026, 1, 15),
                new List<int> { 1 },
                new List<AvailableTimeSlot> { Slot(1, DayOfWeek.Saturday, 9, 1) });
            req.GamesPerTeam = 1;
            req.BlackoutDates.Add(new ScheduleBlackoutDate
            {
                StartDate = new DateTime(2026, 1, 3),
                EndDate = new DateTime(2026, 1, 3),
            });

            var result = await svc.PreviewAsync(req);

            Assert.True(result.Success);
            Assert.All(result.Games, g => Assert.NotEqual(new DateTime(2026, 1, 3), g.GameDate.Date));
        }

        // ── CommitAsync ─────────────────────────────────────────────────────

        [Fact]
        public async Task CommitAsync_EmptyGames_ReturnsZeroCreated()
        {
            var svc = CreateService();

            var result = await svc.CommitAsync(new ScheduleCommitRequest { SeasonId = 1, Games = new() });

            Assert.Equal(0, result.GamesCreated);
            Assert.Empty(result.Errors);
        }

        [Fact]
        public async Task CommitAsync_AllGames_ReturnsCorrectCount()
        {
            var gameRepo = new TestGameRepo();
            var svc = CreateService(gameRepo: gameRepo);
            var games = Enumerable.Range(1, 5).Select(i => new ScheduleGamePreviewItem
            {
                DivisionId = 1, GameNumber = i, ScheduleNumber = 1,
                GameDate = new DateTime(2026, 1, 3, 9, 0, 0),
                GameTime = "1899-12-30 09:00:00",
                LocationNumber = 1,
                HomeTeamId = 1, VisitingTeamId = 2,
            }).ToList();

            var result = await svc.CommitAsync(new ScheduleCommitRequest { SeasonId = 1, Games = games });

            Assert.Equal(5, result.GamesCreated);
            Assert.Empty(result.Errors);
        }

        [Fact]
        public async Task CommitAsync_ThrowingRepo_RecordsErrorAndContinues()
        {
            var gameRepo = new TestGameRepo(throwOnInsert: true);
            var svc = CreateService(gameRepo: gameRepo);
            var games = new List<ScheduleGamePreviewItem>
            {
                new() { DivisionId = 1, GameNumber = 1, ScheduleNumber = 1,
                    GameDate = DateTime.Now, GameTime = "1899-12-30 09:00:00",
                    LocationNumber = 1, HomeTeamId = 1, VisitingTeamId = 2 },
            };

            var result = await svc.CommitAsync(new ScheduleCommitRequest { SeasonId = 1, Games = games });

            Assert.Equal(0, result.GamesCreated);
            Assert.Single(result.Errors);
        }

        // ── Helpers ─────────────────────────────────────────────────────────

        private static List<Team> MakeTeams(int divisionId, int count) =>
            Enumerable.Range(1, count).Select(i => new Team
            {
                TeamId = divisionId * 100 + i,
                DivisionId = divisionId,
                TeamNumber = i.ToString(),
            }).ToList();

        private static DateTime GetWeekStart(DateTime date)
        {
            var diff = (int)date.DayOfWeek - (int)DayOfWeek.Monday;
            if (diff < 0) diff += 7;
            return date.AddDays(-diff).Date;
        }

        // ── Test doubles ────────────────────────────────────────────────────

        private class TestTeamRepo : ITeamRepository
        {
            private readonly Dictionary<int, List<Team>> _byDiv = new();

            public void AddTeamsForDivision(int divId, List<Team> teams) => _byDiv[divId] = teams;

            public List<Team> GetDivisionTeamsWithCoaches(int divisionId) =>
                _byDiv.TryGetValue(divisionId, out var t) ? t : new();

            // Minimal stubs
            public IQueryable<Team> GetTeams(int d) => Enumerable.Empty<Team>().AsQueryable();
            public int GetNumberofDivisionTeams(int d) => 0;
            public bool DeleteById(int id) => false;
            public List<Team> GetSeasonTeams(int s) => new();
            public IQueryable<Team> GetDivisionTeams(int d) => Enumerable.Empty<Team>().AsQueryable();
            public Team Insert(Team e) => e;
            public Task<Team> InsertAsync(Team e) => Task.FromResult(e);
            public void Delete(Team e) { }
            public Task DeleteAsync(int id) => Task.CompletedTask;
            public IEnumerable<Team> GetAll() => Enumerable.Empty<Team>();
            public Task<IEnumerable<Team>> GetAllAsync() => Task.FromResult(Enumerable.Empty<Team>());
            public Team GetById(int id) => null!;
            public Task<Team> GetByIdAsync(int id) => Task.FromResult<Team>(null!);
            public Task<Team> FindByAsync(int id) => Task.FromResult<Team>(null!);
            public Team Update(Team e) => e;
            public Task<bool> UpdateAsync(Team e) => Task.FromResult(true);
            public void SaveChanges() { }
            public Task SaveChangesAsync() => Task.CompletedTask;
        }

        private class TestDivisionRepo : IDivisionRepository
        {
            private readonly List<Division> _divisions = new();

            public void Add(Division d) => _divisions.Add(d);

            public Task<Division> GetByIdAsync(int id) =>
                Task.FromResult(_divisions.FirstOrDefault(d => d.DivisionId == id)!);

            // Minimal stubs
            public IQueryable<VwDivision> LoadDivisions(int s) => Enumerable.Empty<VwDivision>().AsQueryable();
            public IQueryable<Division> GetDivisions(int s) => _divisions.AsQueryable();
            public Task<IEnumerable<Division>> GetSeasonDivisionsAsync(int s) =>
                Task.FromResult(_divisions.AsEnumerable());
            public int GetPlayerDivision(int c, int s, int p) => 0;
            public Division Insert(Division e) => e;
            public Task<Division> InsertAsync(Division e) => Task.FromResult(e);
            public void Delete(Division e) { }
            public Task DeleteAsync(int id) => Task.CompletedTask;
            public IEnumerable<Division> GetAll() => _divisions;
            public Task<IEnumerable<Division>> GetAllAsync() => Task.FromResult(_divisions.AsEnumerable());
            public Division GetById(int id) => _divisions.First(d => d.DivisionId == id);
            public Task<Division> FindByAsync(int id) => GetByIdAsync(id);
            public Division Update(Division e) => e;
            public Task<bool> UpdateAsync(Division e) => Task.FromResult(true);
            public void SaveChanges() { }
            public Task SaveChangesAsync() => Task.CompletedTask;
        }

        private class TestLocationRepo : ILocationRepository
        {
            private readonly List<Location> _locations;

            public TestLocationRepo(params Location[] locations) => _locations = locations.ToList();

            public Task<IEnumerable<Location>> GetAll() =>
                Task.FromResult<IEnumerable<Location>>(_locations);

            // IRepository<Location>.GetAll() — explicit to avoid return-type conflict
            IEnumerable<Location> IRepository<Location>.GetAll() => _locations;

            public Task<IEnumerable<Location>> GetAllAsync() =>
                Task.FromResult<IEnumerable<Location>>(_locations);

            // Minimal stubs
            public Location Insert(Location e) => e;
            public Task<Location> InsertAsync(Location e) => Task.FromResult(e);
            public void Delete(Location e) { }
            public Task DeleteAsync(int id) => Task.CompletedTask;
            public Location GetById(int id) => null!;
            public Task<Location> GetByIdAsync(int id) => Task.FromResult<Location>(null!);
            public Task<Location> FindByAsync(int id) => Task.FromResult<Location>(null!);
            public Location Update(Location e) => e;
            public Task<bool> UpdateAsync(Location e) => Task.FromResult(true);
            public void SaveChanges() { }
            public Task SaveChangesAsync() => Task.CompletedTask;
        }

        private class TestGameRepo : IScheduleGameRepository
        {
            private readonly bool _throwOnInsert;
            private readonly List<ScheduleGame> _games = new();

            public TestGameRepo(bool throwOnInsert = false) => _throwOnInsert = throwOnInsert;

            public ScheduleGame Insert(ScheduleGame e)
            {
                if (_throwOnInsert) throw new InvalidOperationException("Insert failed");
                _games.Add(e);
                return e;
            }

            public Task<ScheduleGame> InsertAsync(ScheduleGame e)
            {
                if (_throwOnInsert) throw new InvalidOperationException("Insert failed");
                _games.Add(e);
                return Task.FromResult(e);
            }

            public void Add(ScheduleGame e) => Insert(e);
            public bool Exists(int id) => _games.Any(g => g.ScheduleGamesId == id);

            // Minimal stubs
            public IQueryable<ScheduleGame> GetByDate(DateTime d) => Enumerable.Empty<ScheduleGame>().AsQueryable();
            public ScheduleGame GetByScheduleAndGameNo(int s, int g) => null!;
            public IEnumerable<ScheduleGame> GetSeasonGames() => _games;
            public Task<IEnumerable<ScheduleGame>> GetSeasonGamesAsync(int s) =>
                Task.FromResult(_games.AsEnumerable());
            public IEnumerable<ScheduleStandingsVM> GetStandings(int s, int d) =>
                Enumerable.Empty<ScheduleStandingsVM>();
            public List<vmGameSchedule> GetGames(int s) => new();
            public void Delete(ScheduleGame e) { }
            public Task DeleteAsync(int id) => Task.CompletedTask;
            public IEnumerable<ScheduleGame> GetAll() => _games;
            public Task<IEnumerable<ScheduleGame>> GetAllAsync() =>
                Task.FromResult(_games.AsEnumerable());
            public ScheduleGame GetById(int id) => null!;
            public Task<ScheduleGame> GetByIdAsync(int id) => Task.FromResult<ScheduleGame>(null!);
            public Task<ScheduleGame> FindByAsync(int id) => Task.FromResult<ScheduleGame>(null!);
            public ScheduleGame Update(ScheduleGame e) => e;
            public Task<bool> UpdateAsync(ScheduleGame e) => Task.FromResult(true);
            public void SaveChanges() { }
            public Task SaveChangesAsync() => Task.CompletedTask;
        }
    }
}
