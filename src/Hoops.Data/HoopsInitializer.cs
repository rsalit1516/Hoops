using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Data;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;

namespace Hoops.Data
{

    public class HoopsInitializer
    {
        public const string companyName = "Test Basketball Club";
        public int CompanyId = Convert.ToInt32(1); // TODO: get companyID from config file
        public List<string> HouseholdLastNames = new List<string>(new string[] { "Fallon", "Leno", "Obrien", "Letterman", "Morgan", "Johnson", "Smith", "Clapton", "Bruce", "Tweedy", "Franks", "Garcia", "Lesh", "Hart", "Weir", "Kreutzman" });
        public List<string> FirstNames = new List<string>(new string[] { "Mike", "Rich", "Conan", "David", "Fred", "Brenda", "Ann", "Wilbur", "Harry", "Jack", "Jill", "Robert", "William", "Carol", "James", "Harold", "Skye", "Beatrice", "Thomas" });

        public const string Household1 = "Schwartz";
        public const string Household2 = "Smith";
        public const string Household3 = "Jones";
        public const string Household4 = "Lesh";
        public const string Household5 = "Weir";
        public const string Household6 = "Johnson";
        public const string PersonFirstName1 = "John";
        public const string PersonFirstName2 = "Barry";
        public const string PersonFirstName3 = "Edward";
        public const string PersonFirstName4 = "Richard";
        public const string PersonFirstName5 = "Phil";


        public List<string> ColorNames = new List<string>(new string[] { "Red", "Blue", "Green", "Yellow", "Black", "White", "Orange", "Heather", "Tan" });

        public ScheduleGame scheduleGame1 = new ScheduleGame
        {
            ScheduleNumber = 1001,
            GameNumber = 1,
            HomeTeamNumber = 10,
            LocationNumber = 1,
            GameDate = DateTime.Today,
            GameTime = "6:00 PM",
            VisitingTeamNumber = 3
        };

        public Season CurrentSeason
        {
            get
            {
                var rep = new SeasonRepository(new hoopsContext());
                return rep.GetCurrentSeason(CompanyId).Result;
            }
        }

        public async Task Seed(hoopsContext context)
        {
            await CustomSeed(context);
        }
        public async Task CustomSeed(hoopsContext context)
        {
            DeleteTestSponsors(context);
            DeleteTestCoaches(context);
            DeleteTestColors(context);
            //DeleteTestPlayers(context);
            DeleteTestPeople(context);
            DeleteTestTeams();
            await DeleteTestDivisions(context);
            DeleteTestSeasons();
            DeleteTestHouseholds(context);
            InitColors(context);
            InitSeasons(context);
            InitHouseholds(context);
            InitPersonTest(context);
            InitComments(context);
            await InitDivision(context);
            InitTeams(context);
            InitDirectorTest();
            InitPlayers(context);
            InitCoaches(context);
            InitSponsors();
        }


        public void InitHouseholds(hoopsContext context)
        {
            var rand = new Random();
            int days = 0;
            days = (rand.Next((1), (365 * 18)));
            List<string> StreetNames = new List<string>(new string[] { "Minute Way", "Main Street", "Adams Place", "First Ave", "Second Ave", "123rd Ave", "52nd Way" });
            var streets = (rand.Next((1), (StreetNames.Count)));
            var rep = new HouseholdRepository(context);
            for (int i = 0; i < HouseholdLastNames.Count; i++)
            {
                days = (rand.Next((1), (10000)));
                streets = (rand.Next((0), (StreetNames.Count - 1)));
                rep.Insert(new Household
                {
                    Name = HouseholdLastNames[i],
                    CompanyId = CompanyId,
                    Address1 = days.ToString() + " " + StreetNames[streets],
                    City = "Coral Springs",
                    State = "FL",
                    Email = HouseholdLastNames[1] + "@yahoo.com",
                    Phone = "954-222-2222"
                });
            }
            //rep.Insert(new Household { Name = HouseholdLastNames[0], CompanyId = CompanyId, Address1 = "10 Minute Lane", City = "Plainview", State = "NY", Email = "joe@aol.com", Phone = "516-222-2222" });
            //rep.Insert(new Household { Name = HouseholdLastNames[1], CompanyId = CompanyId, Address1 = "12 Second Street", City = "Keinview", State = "MO", Email = "Smith@aol.com", Phone = "206-222-2222" });
            //rep.Insert(new Household { Name = HouseholdLastNames[2], CompanyId = CompanyId, Address1 = "12 Hour Ave", City = "San Martin", State = "CA", Email = Household3 + "@mpgmail.com", Phone = "206-222-2223" });
            //rep.Insert(new Household { Name = HouseholdLastNames[3], CompanyId = CompanyId, Address1 = "Minute Road", City = "Fleping", State = "MO", Email = Household4 + "@gmnoail.com", Phone = "206-222-2224" });
            //rep.Insert(new Household { Name = HouseholdLastNames[4], CompanyId = CompanyId, Address1 = "12 Hour Ave", City = "Keinview", State = "MO", Email = HouseholdLastNames[4] + "@npgmail.com", Phone = "206-222-2225" });
            //rep.Insert(new Household { Name = HouseholdLastNames[5], CompanyId = CompanyId, Address1 = "12 Year Ave", City = "Keinview", State = "MO", Email = HouseholdLastNames[5] + "@npgmail.com", Phone = "206-222-2225" });
            //rep.Insert(new Household { Name = HouseholdLastNames[6], CompanyId = CompanyId, Address1 = "12 Hour Ave", City = "Keinview", State = "MO", Email = HouseholdLastNames[6] + "@npgmail.com", Phone = "206-222-2225" });
            //rep.Insert(new Household { Name = HouseholdLastNames[7], CompanyId = CompanyId, Address1 = "12 Hour Ave", City = "Keinview", State = "MO", Email = HouseholdLastNames[7] + "@npgmail.com", Phone = "206-222-2225" });
            //rep.Insert(new Household { Name = HouseholdLastNames[8], CompanyId = CompanyId, Address1 = "12 Hour Ave", City = "Keinview", State = "MO", Email = HouseholdLastNames[8] + "@npgmail.com", Phone = "206-222-2225" });
            //rep.Insert(new Household { Name = HouseholdLastNames[9], CompanyId = CompanyId, Address1 = "12 Hour Ave", City = "Keinview", State = "MO", Email = HouseholdLastNames[9] + "@npgmail.com", Phone = "206-222-2225" });
            //rep.Insert(new Household { Name = HouseholdLastNames[10], CompanyId = CompanyId, Address1 = "12 Hour Ave", City = "Keinview", State = "MO", Email = HouseholdLastNames[10] + "@npgmail.com", Phone = "206-222-2225" });
            //rep.Insert(new Household { Name = HouseholdLastNames[11], CompanyId = CompanyId, Address1 = "12 Hour Ave", City = "Keinview", State = "MO", Email = HouseholdLastNames[11] + "@npgmail.com", Phone = "206-222-2225" });
            //rep.Insert(new Household { Name = HouseholdLastNames[12], CompanyId = CompanyId, Address1 = "12 Hour Ave", City = "Keinview", State = "MO", Email = HouseholdLastNames[12] + "@npgmail.com", Phone = "206-222-2225" });

            var no = context.SaveChanges();

        }

        public bool InitPersonTest(hoopsContext context)
        {
            ILogger<PersonRepository> _logger = NullLogger<PersonRepository>.Instance;
            Household house;
            IQueryable<Household> houses;
            var rep = new PersonRepository(context, _logger);
            Random rnd = new Random();
            Person no;
            var rand = new Random();
            int days = 0;
            days = -(rand.Next((365 * 5), (365 * 18)));
            var repHouse = new HouseholdRepository(context);

            for (int i = 0; i < HouseholdLastNames.Count; i++)
            {
                houses = repHouse.GetByName(HouseholdLastNames[i]);
                house = houses.FirstOrDefault();
                if (house != null)
                {
                    days = -(rand.Next((365 * 5), (365 * 18)));
                    var person = new Person();
                    person.CompanyId = CompanyId;
                    person.FirstName = FirstNames[i];
                    person.LastName = HouseholdLastNames[i];
                    person.HouseId = house.HouseId;
                    person.Ad = false;
                    person.Coach = false;
                    person.Parent = false;
                    person.Player = true;
                    person.Gender = "M";
                    person.Sponsor = ((i % 4) == 0);
                    person.BirthDate = DateTime.Today.AddDays(days);

                    no = rep.Insert(person);
                }
            }
            for (int i = 0; i < HouseholdLastNames.Count; i++)
            {
                houses = repHouse.GetByName(HouseholdLastNames[i]);
                house = houses.FirstOrDefault();
                if (house != null)
                {
                    days = -(rand.Next((365 * 18), (365 * 70)));
                    no = rep.Insert(new Person
                    {
                        CompanyId = CompanyId,
                        FirstName = FirstNames[i + 1],
                        LastName = HouseholdLastNames[i],
                        HouseId = house.HouseId,
                        Ad = true,
                        Coach = true,
                        Parent = true,
                        Player = false,
                        Gender = "M",
                        BirthDate = DateTime.Today.AddDays(days)
                    });
                }
            }
            context.SaveChanges();
            return (true);  //may want to change this
        }
        public bool InitComments(hoopsContext context)
        {
            // Clear existing data
            context.Comments.RemoveRange(context.Comments);

            // Add test data
            context.Comments.AddRange(new List<Comment>
        {
            new Comment { CommentID = 1, LinkID = 101, CommentType = "General", Comment1 = "Test Comment 1", CompanyID = 1 },
            new Comment { CommentID = 2, LinkID = 102, CommentType = "Feedback", Comment1 = "Test Comment 2", CompanyID = 1 },
            new Comment { CommentID = 3, LinkID = 101, CommentType = "General", Comment1 = "Test Comment 3", CompanyID = 1 }
        });

            // Add more entities as needed for other tests
            // e.g., context.Users.AddRange(...);

            context.SaveChanges();
            return true;
        }
        public bool InitDirectorTest()
        {
            ILogger<PersonRepository> _logger = NullLogger<PersonRepository>.Instance;
            using (var db = new hoopsContext())
            {
                var rep = new DirectorRepository(db);
                InitHouseholds(db);
                InitPersonTest(db);
                var personRep = new PersonRepository(db, _logger);
                Person person;
                for (int i = 0; i < HouseholdLastNames.Count; i++)
                {
                    person = personRep.FindPersonByLastAndFirstName(HouseholdLastNames[i], FirstNames[i]);
                    rep.Insert(new Director { CompanyId = CompanyId, PersonId = person.PersonId, Title = "Assistant" });
                }
                return true;
            }
        }

        public bool InitUser(hoopsContext context)
        {
            ILogger<PersonRepository> _logger = NullLogger<PersonRepository>.Instance;
            using (var db = new hoopsContext())
            {
                var personRep = new PersonRepository(db, _logger);
                InitHouseholds(db);
                InitPersonTest(db);
                Person person;
                var rep = new UserRepository(db);

                for (int i = 0; i < HouseholdLastNames.Count; i++)
                {
                    person = personRep.FindPersonByLastAndFirstName(HouseholdLastNames[i], FirstNames[i + 1]); //find adults
                    rep.Insert(new User
                    {
                        HouseId = (int)person.HouseId,
                        UserName = person.LastName + "1",
                        Name = person.FirstName + " " + person.LastName,
                        Pword = person.LastName,
                        PassWord = person.LastName,
                        PersonId = person.PersonId,
                        CompanyId = person.CompanyId,
                        UserType = 1,
                        CreatedDate = DateTime.Today,
                        CreatedUser = "Tester"
                    }
                    );

                }

                db.SaveChanges();
            }
            return true;
        }


        public void InitPlayers(hoopsContext context)
        {
            ILogger<PersonRepository> _logger = NullLogger<PersonRepository>.Instance;
            context = new hoopsContext();
            var currentSeason = CurrentSeason.SeasonId;
            var repPeople = new PersonRepository(new hoopsContext(), _logger);
            var people = repPeople.GetPlayers(CompanyId);

            int division = 0;
            Dictionary<int, int> list = new Dictionary<int, int>();
            var repDivision = new DivisionRepository(new hoopsContext());
            var rep = new PlayerRepository(new hoopsContext());
            foreach (Person person in people)
            {
                division = repDivision.GetPlayerDivision(CompanyId, currentSeason, person.PersonId);
                if (division != 0)
                {
                    rep.Insert(
                        new Player
                        {
                            CompanyId = CompanyId,
                            SeasonId = currentSeason,
                            DivisionId = division,
                            PersonId = person.PersonId

                        });
                    context.SaveChanges();
                }
            }

        }

        public void InitCoaches(hoopsContext context)
        {
            ILogger<PersonRepository> _logger = NullLogger<PersonRepository>.Instance;
            context = new hoopsContext();
            var currentSeason = CurrentSeason.SeasonId;
            var repPeople = new PersonRepository(new hoopsContext(), _logger);
            var people = context.People.Where(p => p.Coach == true);

            var rep = new CoachRepository(new hoopsContext());
            foreach (Person person in people)
            {
                rep.Insert(
                    new Coach
                    {
                        CompanyId = CompanyId,
                        SeasonId = currentSeason,
                        PersonId = person.PersonId,
                    });
                context.SaveChanges();

            }

        }
        public void InitSponsors()
        {
            ILogger<PersonRepository> _logger = NullLogger<PersonRepository>.Instance;
            using (var db = new hoopsContext())
            {
                var currentSeason = CurrentSeason.SeasonId;
                var repPeople = new PersonRepository(new hoopsContext(), _logger);
                var people = db.People.Where(p => p.Sponsor == true).ToList();

                var rep = new SponsorRepository(new hoopsContext());
                var repColor = new ColorRepository(new hoopsContext());
                var color = repColor.GetByName(1, ColorNames[2].ToString());
                var colorId = color == null ? 0 : color.ColorId;
                var repProfile = new SponsorProfileRepository(new hoopsContext());
                var id = new Random();
                foreach (Person person in people)
                {
                    var sponsorProfile = repProfile.Insert(new SponsorProfile
                    {
                        SpoName = person.LastName.Trim() + "Company",
                        SponsorProfileId = 0,
                        CompanyId = CompanyId,
                        HouseId = person.HouseId,
                        State = "FL",
                        City = "Coral Springs",
                        Address = person.Household.Address1,
                        ContactName = person.FirstName.Trim() + " " + person.LastName.Trim()

                    });

                    rep.Insert(
                        new Sponsor
                        {
                            SponsorId = 0,
                            CompanyId = CompanyId,
                            SeasonId = currentSeason,
                            Color1Id = colorId,
                            SponsorProfileId = sponsorProfile.SponsorProfileId
                        });
                    db.SaveChanges();
                }
            }

        }

        public async Task<bool> InitDivision(hoopsContext context)
        {
            ILogger<PersonRepository> _logger = NullLogger<PersonRepository>.Instance;
            var init = new HoopsInitializer();
            var divisionRep = new DivisionRepository(context);

            InitPersonTest(new hoopsContext());
            init.InitSeasons(new hoopsContext());
            var seasonRep = new SeasonRepository(context);
            var season = await seasonRep.GetCurrentSeason(CompanyId);

            var repPerson = new PersonRepository(context, _logger);
            var today = DateTime.Now;
            var schoolYearStart = DateTime.Parse("09/01/2013");

            var person = repPerson.GetADs(CompanyId);

            divisionRep.Insert(
                    new Division
                    {
                        CompanyId = CompanyId,
                        SeasonId = season.SeasonId,
                        DivisionDescription = "T2_Coed",
                        DirectorId = (person).FirstOrDefault()?.PersonId ?? 0,
                        Gender = "M",
                        MinDate = schoolYearStart.AddYears(-6),
                        MaxDate = schoolYearStart.AddYears(-5).AddDays(-1),
                        DraftDate = today.AddDays(12),
                        DraftTime = today.AddDays(12).ToShortTimeString()
                    });

            context.SaveChanges();
            divisionRep.Insert(
                   new Division
                   {
                       CompanyId = CompanyId,
                       SeasonId = season.SeasonId,
                       DivisionDescription = "T3_Coed",
                       DirectorId = (person).FirstOrDefault()?.PersonId ?? 0,
                       Gender = "M",
                       MinDate = schoolYearStart.AddYears(-8),
                       MaxDate = schoolYearStart.AddYears(-6).AddDays(-1),
                       DraftDate = today.AddDays(12),
                       DraftTime = today.AddDays(12).ToShortTimeString()
                   });

            context.SaveChanges();
            divisionRep.Insert(
                   new Division
                   {
                       CompanyId = CompanyId,
                       SeasonId = season.SeasonId,
                       DivisionDescription = "T4_Coed",
                       DirectorId = (person).FirstOrDefault()?.PersonId ?? 0,
                       Gender = "M",
                       MinDate = schoolYearStart.AddYears(-10),
                       MaxDate = schoolYearStart.AddYears(-8).AddDays(-1),
                       DraftDate = today.AddDays(12),
                       DraftTime = today.AddDays(12).ToShortTimeString()
                   });
            context.SaveChanges();
            divisionRep.Insert(
                   new Division
                   {
                       CompanyId = CompanyId,
                       SeasonId = season.SeasonId,
                       DivisionDescription = "SI_Boys",
                       DirectorId = (person).FirstOrDefault<Person>().PersonId,
                       Gender = "M",
                       MinDate = schoolYearStart.AddYears(-12),
                       MaxDate = schoolYearStart.AddYears(-10).AddDays(-1),
                       DraftDate = today.AddDays(12),
                       DraftTime = today.AddDays(12).ToShortTimeString()
                   });
            context.SaveChanges();
            divisionRep.Insert(
                   new Division
                   {
                       CompanyId = CompanyId,
                       SeasonId = season.SeasonId,
                       DivisionDescription = "FJV_Boys",
                       DirectorId = (person).FirstOrDefault<Person>().PersonId,
                       Gender = "M",
                       MinDate = schoolYearStart.AddYears(-14),
                       MaxDate = schoolYearStart.AddYears(-12).AddDays(-1),
                       DraftDate = today.AddDays(12),
                       DraftTime = today.AddDays(12).ToShortTimeString()
                   });
            context.SaveChanges();
            divisionRep.Insert(
                   new Division
                   {
                       CompanyId = CompanyId,
                       SeasonId = season.SeasonId,
                       DivisionDescription = "SJV_Boys",
                       DirectorId = (person).FirstOrDefault<Person>().PersonId,
                       Gender = "M",
                       MinDate = schoolYearStart.AddYears(-16),
                       MaxDate = schoolYearStart.AddYears(-14).AddDays(-1),
                       DraftDate = today.AddDays(12),
                       DraftTime = today.AddDays(12).ToShortTimeString()
                   });
            context.SaveChanges();
            divisionRep.Insert(
                   new Division
                   {
                       CompanyId = CompanyId,
                       SeasonId = season.SeasonId,
                       DivisionDescription = "HS_Boys",
                       DirectorId = (person).FirstOrDefault<Person>().PersonId,
                       Gender = "M",
                       MinDate = schoolYearStart.AddYears(-18),
                       MaxDate = schoolYearStart.AddYears(-16).AddDays(-1),
                       DraftDate = today.AddDays(12),
                       DraftTime = today.AddDays(12).ToShortTimeString()
                   });
            context.SaveChanges();
            divisionRep.Insert(
                    new Division
                    {
                        CompanyId = CompanyId,
                        SeasonId = season.SeasonId,
                        DivisionDescription = "JV_Girls",
                        DirectorId = (person).FirstOrDefault<Person>().PersonId,
                        Gender = "F",
                        MinDate = schoolYearStart.AddYears(-17),
                        MaxDate = schoolYearStart.AddYears(-14),
                        DraftDate = today.AddDays(12),
                        DraftTime = today.AddDays(12).ToShortTimeString()
                    });

            context.SaveChanges();
            return true;
        }
        public bool InitSeasons(hoopsContext context)
        {
            var rep = new SeasonRepository(context);
            var startDate = DateTime.Now.AddDays(-(365 * 2));
            for (int i = 0; i < 12; i++)
            {
                rep.Insert(new Season
                {
                    CompanyId = CompanyId,
                    Description = convertSeason(getSeason(startDate)) + "-" + startDate.Year.ToString(),
                    FromDate = startDate,
                    ToDate = startDate.AddDays(80),
                    ParticipationFee = 99,
                    SponsorFee = (decimal)112.50,
                    CurrentSeason = ((DateTime.Today > startDate) && (DateTime.Today <= startDate.AddDays(80))) ? true : false

                });
                startDate = startDate.AddDays(90);
            }
            var no = context.SaveChanges();
            return (no > 0);
        }
        private int getSeason(DateTime date)
        {
            float value = (float)date.Month + date.Day / 100;   // <month>.<day(2 digit)>
            if (value < 3.21 || value >= 12.22) return 3;   // Winter
            if (value < 6.21) return 0; // Spring
            if (value < 9.23) return 1; // Summer
            return 2;   // Autumn
        }
        private string convertSeason(int value)
        {
            string season = "Spring";
            if (value == 1) season = "Summer";
            else if (value == 2) season = "Autumn";
            else if (value == 3) season = "Winter";
            return season;
        }
        private void CreateDummyCompany(hoopsContext context)
        {
            var company = new List<Company>
            {
                new Company {CompanyName = "Coral Springs Basketball Club", CreatedDate = DateTime.Now, EmailSender = "registration@csbchoops.net"}
            };
            company.ForEach(s => context.Companies.Add(s));
            context.SaveChanges();
        }

        private void CreateDummyPeople(hoopsContext context, int CompanyId)
        {
            var people = new List<Person>
            {
                new Person {CompanyId = CompanyId, FirstName = "James", LastName = "Chance", Cellphone = "954-321-3214", Email="test@ab.com", Gender="M", Grade=9, Player=true, CreatedDate=DateTime.Now, CreatedUser="Test"},
                new Person {CompanyId = CompanyId, FirstName = "Peter", LastName = "Afta", Cellphone = "954-321-3214", Email="test1@ab.com", Gender="M", Grade=9, Player=true, CreatedDate=DateTime.Now, CreatedUser="Test"},
            };
            people.ForEach(s => context.People.Add(s));
            context.SaveChanges();
        }

        private static List<Season> CreateDummySeasons(hoopsContext context)
        {
            var seasons = new List<Season>
            {
                new Season { Description = "Winter 2013", FromDate = Convert.ToDateTime("12/1/13"), ToDate = Convert.ToDateTime("2/1/14"),  ParticipationFee = 100.50M, CreatedDate = DateTime.Now, CurrentSchedule = true  },
                new Season { Description = "Summer 2013", FromDate = Convert.ToDateTime("8/1/13"), ToDate = Convert.ToDateTime("12/1/13"),  ParticipationFee = 100.50M, CreatedDate = DateTime.Now, CurrentSchedule = false  },
                new Season { Description = "Fall 2013", FromDate = Convert.ToDateTime("12/1/13"), ToDate = Convert.ToDateTime("2/1/14"),  ParticipationFee = 100.50M, CreatedDate = DateTime.Now, CurrentSchedule = false  }

            };
            seasons.ForEach(s => context.Seasons.Add(s));
            context.SaveChanges();
            return seasons;
        }

        public void InitTeams(hoopsContext context)
        {
            // using (context)
            // {
            //     var rep = new TeamRepository(context);
            //     var repSeason = new SeasonRepository(context);
            //     var season = await repSeason.GetCurrentSeason(CompanyId);
            //     var repDivisions = new DivisionRepository(context);
            //     var divisions = repDivisions.GetDivisions(season.SeasonId).ToList<Division>();
            //     var repcolors = new ColorRepository(context);
            //     foreach (Division division in divisions)
            //     {
            //         for (int i = 1; i < 8; i++)
            //         {
            //             var color = repcolors.GetByName(CompanyId, ColorNames[i]);
            //             var team = new Team
            //             {
            //                 DivisionId = division.DivisionId,
            //                 SeasonId = season.SeasonId,
            //                 TeamName = "T-" + i.ToString() + "-" + division.DivisionDescription.Trim(),
            //                 // CompanyId = CompanyId,
            //                 TeamNumber = i.ToString(),
            //                 TeamColor = ColorNames[i],
            //                 TeamColorId = color.ColorId
            //             };
            //             rep.Insert(team);
            //         }
            //     }

            // }
            return;
        }
        public void InitColors(hoopsContext context)
        {
            var rep = new ColorRepository(context);
            for (int i = 0; i < ColorNames.Count; i++)
            {
                rep.Insert(new Color { ColorName = ColorNames[i], CompanyId = CompanyId });
            }
            rep.Insert(new Color { ColorName = "Chartreuse", CompanyId = CompanyId, Discontinued = true });
            context.SaveChanges();
        }

        public void DeleteTestColors(hoopsContext context)
        {
            var rep = new ColorRepository(context);
            for (int i = 0; i < ColorNames.Count; i++)
            {
                while (true)
                {
                    var color = rep.GetByName(1, ColorNames[i]);
                    if (color == null)
                    {
                        break;
                    }
                    else
                    {
                        rep.Delete(color);
                    }
                }
            }
        }
        public void DeleteTestHouseholds(hoopsContext context)
        {
            using (var db = new hoopsContext())
            {
                var rep = new HouseholdRepository(db);
                var people = rep.GetAll(CompanyId).ToList<Household>();
                foreach (Household person in people)
                {
                    rep.Delete(person);
                }
            }
        }
        public void DeleteTestPeople(hoopsContext context)
        {
            ILogger<PersonRepository> _logger = NullLogger<PersonRepository>.Instance;
            var rep = new PersonRepository(context, _logger);
            var people = rep.GetAll(CompanyId);
            foreach (Person person in people)
            {
                rep.Delete(person);
            }
        }
        public void DeleteTestComments(hoopsContext context)
        {
            // Use DbContext directly to avoid dependency on CommentRepository
            var comments = context.Comments.ToList();
            if (comments.Count > 0)
            {
                context.Comments.RemoveRange(comments);
                context.SaveChanges();
            }
        }
        public void DeleteTestPlayers(hoopsContext context)
        {
            var rep = new PlayerRepository(context);
            var seasonPlayers = rep.GetSeasonPlayers(CurrentSeason.SeasonId).ToList<SeasonPlayer>();
            foreach (SeasonPlayer seasonPlayer in seasonPlayers)
            {
                var player = rep.GetById(seasonPlayer.PlayerId);
                rep.Delete(player);
            }
        }
        public void DeleteTestCoaches(hoopsContext context)
        {
            var rep = new CoachRepository(context);
            var coaches = rep.GetAll().ToList<Coach>();
            foreach (Coach coach in coaches)
            {
                rep.Delete(coach);
            }
        }
        public void DeleteTestSponsors(hoopsContext context)
        {

            var rep = new SponsorRepository(context);
            var sponsors = rep.GetAll(CompanyId).ToList<Sponsor>();
            foreach (Sponsor sponsor in sponsors)
            {
                rep.Delete(sponsor);
            }

        }
        public void DeleteTestTeams()
        {
            using (var db = new hoopsContext())
            {
                var rep = new TeamRepository(db);
                foreach (Team team in rep.GetAll())
                {
                    rep.Delete(team);
                }
            }
        }
        public async Task DeleteTestDivisions(hoopsContext context)
        {
            var repSeason = new SeasonRepository(context);
            var season = await repSeason.GetCurrentSeason(CompanyId);
            if (season != null)
            {
                var rep = new DivisionRepository(context);
                var divisions = rep.GetDivisions(season.SeasonId).ToList<Division>();
                foreach (Division division in divisions)
                {
                    rep.Delete(division);
                }
            }
        }
        public async void DeleteTestSeasons()
        {
            using (var db = new hoopsContext())
            {
                var repSeason = new SeasonRepository(db);
                foreach (Season season in await repSeason.GetAllAsync(CompanyId))
                {
                    repSeason.Delete(season);
                }
            }
        }



    }
}
