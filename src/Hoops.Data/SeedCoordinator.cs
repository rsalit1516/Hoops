using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Infrastructure.Data;
using Hoops.Core.Interface;
using Hoops.Data.Seeders;

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
        public IScheduleGameRepository scheduleGameRepo { get; private set; }
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
        IScheduleGameRepository scheduleGameRepo,
        // IWebContentTypeRepository webContentTypeRepo,
        // IWebContentRepository webContentRepo,
        hoopsContext context,
        SeasonSeeder seasonSeeder,
                DivisionSeeder divisionSeeder,
                ColorSeeder colorSeeder,
                TeamSeeder teamSeeder,
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
            this.scheduleGameRepo = scheduleGameRepo;
            // this.webContentTypeRepo = webContentTypeRepo;
            // this.webContentRepo = webContentRepo;
            this.context = context;
            _colorSeeder = colorSeeder;
            _seasonSeeder = seasonSeeder;
            _divisionSeeder = divisionSeeder;
            _teamSeeder = teamSeeder;
            _webContentTypeSeeder = webContentTypeSeeder;
            _webContentSeeder = webContentSeeder;
            _householdAndPeopleSeeder = householdAndPeopleSeeder;
        }
        public async Task InitializeDataAsync()
        {
            //first delete all records    
            await DeleteGamesAsync();
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
            await CreateGamesAsync();
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

        private async Task CreateGamesAsync()
        {
            await InitializeGamesAsync();
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

        private async Task DeleteGamesAsync()
        {
            var records = await scheduleGameRepo.GetAllAsync();
            foreach (var record in records)
            {
                await scheduleGameRepo.DeleteAsync(record.ScheduleGamesId);
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

        private async Task InitializeGamesAsync()
        {
            var seasons = await seasonRepo.GetAllAsync();
            var locations = await locationRepo.GetAllAsync();
            var locationsList = locations.ToList();

            if (!locationsList.Any())
            {
                // Create some sample locations if none exist
                await locationRepo.InsertAsync(new Location
                {
                    LocationNumber = 1,
                    LocationName = "Main Gym",
                    Notes = "Primary gymnasium"
                });
                await locationRepo.InsertAsync(new Location
                {
                    LocationNumber = 2,
                    LocationName = "Auxiliary Gym",
                    Notes = "Secondary gymnasium"
                });
                await locationRepo.InsertAsync(new Location
                {
                    LocationNumber = 3,
                    LocationName = "Community Center",
                    Notes = "Community center court"
                });
                await context.SaveChangesAsync();
                locationsList = (await locationRepo.GetAllAsync()).ToList();
            }

            foreach (var season in seasons)
            {
                var divisions = await divisionRepo.GetSeasonDivisionsAsync(season.SeasonId);
                
                foreach (var division in divisions)
                {
                    var teams = teamRepo.GetDivisionTeams(division.DivisionId);
                    var teamsList = teams.ToList();
                    
                    if (teamsList.Count >= 2)
                    {
                        await GenerateScheduleForDivision(season, division, teamsList, locationsList);
                    }
                }
            }
        }

        private async Task GenerateScheduleForDivision(Season season, Division division, List<Team> teams, List<Location> locations)
        {
            var gameSchedule = new List<ScheduleGame>();
            var gameId = 1;
            var scheduleNumber = division.DivisionId % 100; // Simple schedule number based on division
            
            // Create a round-robin schedule
            var totalRounds = teams.Count - 1;
            var gamesPerRound = teams.Count / 2;
            
            // Track when each team last played for rest day enforcement
            var teamLastGameDate = new Dictionary<int, DateTime>();
            
            // Current scheduling date - start from season start date
            var currentDate = season.FromDate ?? DateTime.Now;
            
            // Skip to first Monday for weeknight games or first Saturday for weekend games
            currentDate = GetNextSchedulingDate(currentDate, true); // Start with weeknight
            
            var locationRotation = 0;
            var timeSlotManager = new GameTimeSlotManager();
            
            for (int round = 0; round < totalRounds; round++)
            {
                var roundGames = GenerateRoundRobinRound(teams, round);
                
                foreach (var (homeTeam, visitingTeam) in roundGames)
                {
                    // Find next available date considering rest days
                    var gameDate = FindNextAvailableDate(currentDate, homeTeam, visitingTeam, teamLastGameDate);
                    
                    // Determine if this should be a weeknight or weekend game
                    bool isWeekend = gameDate.DayOfWeek == DayOfWeek.Saturday || gameDate.DayOfWeek == DayOfWeek.Sunday;
                    
                    // Get next available time slot for this date and location
                    var location = locations[locationRotation % locations.Count];
                    var timeSlot = timeSlotManager.GetNextAvailableTimeSlot(gameDate, location.LocationNumber, isWeekend);
                    
                    var game = new ScheduleGame
                    {
                        ScheduleGamesId = gameId++,
                        ScheduleNumber = scheduleNumber,
                        GameNumber = gameId,
                        LocationNumber = location.LocationNumber,
                        GameDate = gameDate,
                        GameTime = timeSlot,
                        HomeTeamNumber = int.Parse(homeTeam.TeamNumber),
                        VisitingTeamNumber = int.Parse(visitingTeam.TeamNumber),
                        SeasonId = season.SeasonId,
                        DivisionId = division.DivisionId,
                        HomeTeamScore = null,
                        VisitingTeamScore = null,
                        HomeForfeited = false,
                        VisitingForfeited = false
                    };
                    
                    await scheduleGameRepo.InsertAsync(game);
                    
                    // Update last game dates for both teams
                    teamLastGameDate[homeTeam.TeamId] = gameDate;
                    teamLastGameDate[visitingTeam.TeamId] = gameDate;
                    
                    locationRotation++;
                    
                    // Move to next potential game date
                    currentDate = timeSlotManager.GetNextGameDate(gameDate, isWeekend);
                }
            }
        }

        private DateTime FindNextAvailableDate(DateTime startDate, Team team1, Team team2, Dictionary<int, DateTime> teamLastGameDate)
        {
            var candidateDate = startDate;
            
            while (true)
            {
                // Check if both teams have at least one day rest
                bool team1HasRest = !teamLastGameDate.ContainsKey(team1.TeamId) || 
                                   (candidateDate - teamLastGameDate[team1.TeamId]).Days >= 1;
                bool team2HasRest = !teamLastGameDate.ContainsKey(team2.TeamId) || 
                                   (candidateDate - teamLastGameDate[team2.TeamId]).Days >= 1;
                
                if (team1HasRest && team2HasRest)
                {
                    return candidateDate;
                }
                
                // Move to next valid game day
                candidateDate = GetNextSchedulingDate(candidateDate.AddDays(1), 
                    candidateDate.DayOfWeek == DayOfWeek.Monday || candidateDate.DayOfWeek == DayOfWeek.Tuesday);
            }
        }

        private DateTime GetNextSchedulingDate(DateTime fromDate, bool preferWeeknight)
        {
            var date = fromDate;
            
            if (preferWeeknight)
            {
                // Find next Monday, Tuesday, Wednesday, or Thursday
                while (date.DayOfWeek != DayOfWeek.Monday && 
                       date.DayOfWeek != DayOfWeek.Tuesday && 
                       date.DayOfWeek != DayOfWeek.Wednesday && 
                       date.DayOfWeek != DayOfWeek.Thursday)
                {
                    date = date.AddDays(1);
                }
            }
            else
            {
                // Find next Saturday or Sunday
                while (date.DayOfWeek != DayOfWeek.Saturday && 
                       date.DayOfWeek != DayOfWeek.Sunday)
                {
                    date = date.AddDays(1);
                }
            }
            
            return date;
        }

        private List<(Team home, Team visiting)> GenerateRoundRobinRound(List<Team> teams, int round)
        {
            var games = new List<(Team home, Team visiting)>();
            var teamCount = teams.Count;
            
            // For odd number of teams, add a "bye" team
            if (teamCount % 2 == 1)
            {
                teams = new List<Team>(teams) { null }; // null represents bye
                teamCount++;
            }
            
            // Standard round-robin algorithm
            for (int i = 0; i < teamCount / 2; i++)
            {
                var homeIndex = i;
                var visitingIndex = teamCount - 1 - i;
                
                // Rotate teams (except the first one)
                if (round > 0)
                {
                    if (homeIndex > 0)
                    {
                        homeIndex = ((homeIndex - 1 + round) % (teamCount - 1)) + 1;
                    }
                    if (visitingIndex > 0)
                    {
                        visitingIndex = ((visitingIndex - 1 + round) % (teamCount - 1)) + 1;
                    }
                }
                
                var homeTeam = teams[homeIndex];
                var visitingTeam = teams[visitingIndex];
                
                // Skip games involving the bye team
                if (homeTeam != null && visitingTeam != null)
                {
                    games.Add((homeTeam, visitingTeam));
                }
            }
            
            return games;
        }

        // Helper class to manage game time slots
        private class GameTimeSlotManager
        {
            private readonly Dictionary<(DateTime date, int location), List<string>> _scheduledTimes = new();
            
            public string GetNextAvailableTimeSlot(DateTime gameDate, int locationNumber, bool isWeekend)
            {
                var key = (gameDate.Date, locationNumber);
                if (!_scheduledTimes.ContainsKey(key))
                {
                    _scheduledTimes[key] = new List<string>();
                }
                
                var scheduledTimes = _scheduledTimes[key];
                
                if (isWeekend)
                {
                    // Weekend games: 9:00 AM to 12:00 PM
                    var weekendTimes = new[] { "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM" };
                    foreach (var time in weekendTimes)
                    {
                        if (!scheduledTimes.Contains(time))
                        {
                            scheduledTimes.Add(time);
                            return time;
                        }
                    }
                }
                else
                {
                    // Weeknight games: 6:00 PM to 9:00 PM
                    var weeknightTimes = new[] { "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM" };
                    foreach (var time in weeknightTimes)
                    {
                        if (!scheduledTimes.Contains(time))
                        {
                            scheduledTimes.Add(time);
                            return time;
                        }
                    }
                }
                
                // If all slots are taken, return the first available time with a warning
                return isWeekend ? "9:00 AM" : "6:00 PM";
            }
            
            public DateTime GetNextGameDate(DateTime currentDate, bool wasWeekend)
            {
                // Alternate between weeknight and weekend games
                if (wasWeekend)
                {
                    return GetNextWeekday(currentDate.AddDays(1));
                }
                else
                {
                    return GetNextWeekend(currentDate.AddDays(1));
                }
            }
            
            private DateTime GetNextWeekday(DateTime fromDate)
            {
                var date = fromDate;
                while (date.DayOfWeek != DayOfWeek.Monday && 
                       date.DayOfWeek != DayOfWeek.Tuesday && 
                       date.DayOfWeek != DayOfWeek.Wednesday && 
                       date.DayOfWeek != DayOfWeek.Thursday)
                {
                    date = date.AddDays(1);
                }
                return date;
            }
            
            private DateTime GetNextWeekend(DateTime fromDate)
            {
                var date = fromDate;
                while (date.DayOfWeek != DayOfWeek.Saturday && 
                       date.DayOfWeek != DayOfWeek.Sunday)
                {
                    date = date.AddDays(1);
                }
                return date;
            }
        }
    }
}