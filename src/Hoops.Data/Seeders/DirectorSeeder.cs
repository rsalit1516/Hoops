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
    public class DirectorSeeder : ISeeder<Director>
    {
        public hoopsContext context { get; private set; }
        private readonly IDirectorRepository _directorRepo;
        private readonly IPersonRepository _personRepo;

        public DirectorSeeder(IDirectorRepository directorRepo, IPersonRepository personRepo, hoopsContext context)
        {
            _directorRepo = directorRepo;
            _personRepo = personRepo;
            this.context = context;
        }

        public async Task DeleteAllAsync()
        {
            // Delete Directors with raw SQL for reliability and speed
            await context.Database.ExecuteSqlRawAsync("DELETE FROM Directors");
        }

        public async Task SeedAsync()
        {
            // Ensure there are eligible people to link directors to
            var today = DateTime.Today;

            // Eligible adults: BirthDate is null OR age >= 21; prefer Parents/ADs
            var eligibleAdults = context.People
                .Where(p => (p.BirthDate == null) || (p.BirthDate != null && EF.Functions.DateDiffYear(p.BirthDate.Value, today) >= 21))
                .Where(p => p.Parent == true || p.Ad == true)
                .OrderByDescending(p => p.Ad) // Prefer ADs first if available
                .ThenByDescending(p => p.Parent)
                .ThenBy(p => p.LastName)
                .ThenBy(p => p.FirstName)
                .Take(10) // take some buffer
                .ToList();

            if (eligibleAdults.Count < 5)
            {
                // Fallback: broaden to any adults in the system
                eligibleAdults = context.People
                    .Where(p => (p.BirthDate == null) || (p.BirthDate != null && EF.Functions.DateDiffYear(p.BirthDate.Value, today) >= 21))
                    .OrderBy(p => p.LastName)
                    .ThenBy(p => p.FirstName)
                    .Take(10)
                    .ToList();
            }

            if (eligibleAdults.Count == 0)
            {
                // Nothing to do
                return;
            }

            var titles = new List<string>
            {
                "President",
                "Vice - President",
                "Secretary",
                "Treasurer",
                "Club AD"
            };

            // Choose up to 5 distinct people
            var chosen = eligibleAdults.Take(titles.Count).ToList();

            int seq = 1;
            for (int i = 0; i < chosen.Count; i++)
            {
                var person = chosen[i];

                // Ensure BoardMember flag is set per requirement
                if (person.BoardMember != true)
                {
                    person.BoardMember = true;
                }

                // Optionally set BoardOfficer for the first (President)
                if (i == 0 && person.BoardOfficer != true)
                {
                    person.BoardOfficer = true;
                }

                // Persist person updates
                context.People.Update(person);

                var director = new Director
                {
                    CompanyId = 1,
                    PersonId = person.PersonId,
                    Seq = seq++,
                    Title = titles[i],
                    CreatedDate = DateTime.Now,
                    CreatedUser = "Seed"
                };

                // Use repository to insert to honor ID/Seq assignment behavior
                _directorRepo.Insert(director);
            }

            await context.SaveChangesAsync();
        }
    }
}
