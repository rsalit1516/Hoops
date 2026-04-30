using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Data.Seeders
{
    public class SponsorSeeder : ISeeder<SponsorProfile>
    {
        public hoopsContext context { get; private set; }
        private readonly ISponsorRepository _sponsorRepo;
        private readonly ISponsorProfileRepository _sponsorProfileRepo;

        public SponsorSeeder(ISponsorRepository sponsorRepo, ISponsorProfileRepository sponsorProfileRepo, hoopsContext context)
        {
            _sponsorRepo = sponsorRepo;
            _sponsorProfileRepo = sponsorProfileRepo;
            this.context = context;
        }

        public async Task DeleteAllAsync()
        {
            // Sponsors FK → SponsorProfiles, so delete Sponsors first
            await context.Database.ExecuteSqlRawAsync("DELETE FROM Sponsors");
            await context.Database.ExecuteSqlRawAsync("DELETE FROM SponsorProfiles");
        }

        public async Task SeedAsync()
        {
            var seasons = context.Set<Season>()
                .Where(s => s.CompanyId == 1)
                .OrderBy(s => s.SeasonId)
                .ToList();

            if (!seasons.Any())
                return;

            var currentSeason = seasons.FirstOrDefault(s => s.CurrentSeason == true) ?? seasons.Last();
            var pastSeasons = seasons
                .Where(s => s.SeasonId < currentSeason.SeasonId)
                .OrderByDescending(s => s.SeasonId)
                .ToList();

            int profileId = context.Set<SponsorProfile>().Any()
                ? context.Set<SponsorProfile>().Max(s => s.SponsorProfileId)
                : 0;

            var sponsorData = new[]
            {
                new { Name = "Sunrise Dental Group",      Contact = "Dr. Mark Ellis",     Email = "info@sunrisedental.com",       Phone = "954-555-0101", Type = "Dental"         },
                new { Name = "Big 5 Sporting Goods",      Contact = "Karen Webb",          Email = "sponsor@big5sports.com",       Phone = "954-555-0102", Type = "Retail"         },
                new { Name = "Pizza Palace Restaurant",   Contact = "Tony Romano",         Email = "tony@pizzapalace.com",         Phone = "954-555-0103", Type = "Restaurant"     },
                new { Name = "Gold's Gym",                Contact = "Lisa Monroe",         Email = "lisa@goldsgym.com",            Phone = "954-555-0104", Type = "Fitness"        },
                new { Name = "State Farm Insurance",      Contact = "Bob Hartley",         Email = "bob.hartley@statefarm.com",    Phone = "954-555-0105", Type = "Insurance"      },
                new { Name = "Sunrise Orthodontics",      Contact = "Dr. Amy Chen",        Email = "info@sunriseortho.com",        Phone = "954-555-0106", Type = "Medical"        },
                new { Name = "Crown Automotive Group",    Contact = "Dave Nguyen",         Email = "dave@crownauto.com",           Phone = "954-555-0107", Type = "Auto Dealer"    },
                new { Name = "Top Notch Plumbing",        Contact = "Steve Garza",         Email = "steve@topnotchplumbing.com",   Phone = "954-555-0108", Type = "Contractor"     },
                new { Name = "Sunset Pool Service",       Contact = "Maria Flores",        Email = "maria@sunsetpools.com",        Phone = "954-555-0109", Type = "Pool Service"   },
                new { Name = "Smith & Associates Law",    Contact = "James Smith",         Email = "jsmith@smithlaw.com",          Phone = "954-555-0110", Type = "Legal"          },
                new { Name = "Florida Eye Care Center",   Contact = "Dr. Sandra Park",     Email = "info@floridaeyecare.com",      Phone = "954-555-0111", Type = "Medical"        },
                new { Name = "Pro Basketball Academy",    Contact = "Coach Ray Turner",    Email = "ray@proballacademy.com",       Phone = "954-555-0112", Type = "Sports Training"},
            };

            var profiles = new List<SponsorProfile>();
            foreach (var d in sponsorData)
            {
                var profile = new SponsorProfile
                {
                    SponsorProfileId = ++profileId,
                    CompanyId = 1,
                    SpoName = d.Name,
                    ContactName = d.Contact,
                    Email = d.Email,
                    Phone = d.Phone,
                    TypeOfBuss = d.Type,
                    City = "Coral Springs",
                    State = "FL",
                    ShowAd = false,
                    CreatedDate = DateTime.Now,
                    CreatedUser = "Seed"
                };
                context.Set<SponsorProfile>().Add(profile);
                profiles.Add(profile);
            }
            await context.SaveChangesAsync();

            // Sponsor season participation:
            //   profiles[0-7]  → current season  (8 current sponsors)
            //   profiles[0-3]  → oldest past season as well
            //   profiles[4-7]  → next-oldest past season as well
            //   profiles[8-11] → most-recent past season only (not current)
            int sponsorId = context.Set<Sponsor>().Any()
                ? context.Set<Sponsor>().Max(s => s.SponsorId)
                : 0;

            void AddSponsor(SponsorProfile profile, int seasonId)
            {
                context.Set<Sponsor>().Add(new Sponsor
                {
                    SponsorId = ++sponsorId,
                    CompanyId = 1,
                    SeasonId = seasonId,
                    SponsorProfileId = profile.SponsorProfileId,
                    Color1Id = 0,
                    Color2Id = 0,
                    CreatedDate = DateTime.Now,
                    CreatedUser = "Seed"
                });
            }

            // Current season (profiles 0-7)
            for (int i = 0; i < Math.Min(8, profiles.Count); i++)
                AddSponsor(profiles[i], currentSeason.SeasonId);

            if (pastSeasons.Count >= 1)
            {
                var recentPast = pastSeasons[0];

                // Past-only sponsors (profiles 8-11) go in the most recent past season
                for (int i = 8; i < profiles.Count; i++)
                    AddSponsor(profiles[i], recentPast.SeasonId);

                // Profiles 0-3 also participated in the most recent past season
                for (int i = 0; i < Math.Min(4, profiles.Count); i++)
                    AddSponsor(profiles[i], recentPast.SeasonId);
            }

            if (pastSeasons.Count >= 2)
            {
                var olderPast = pastSeasons[1];

                // Profiles 4-7 also participated in the second-most recent past season
                for (int i = 4; i < Math.Min(8, profiles.Count); i++)
                    AddSponsor(profiles[i], olderPast.SeasonId);
            }

            await context.SaveChangesAsync();
        }
    }
}
