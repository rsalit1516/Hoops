using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Data;

namespace Hoops.Data.Seeders
{
    public class HouseholdAndPeopleSeeder : ISeeder<Household>, ISeeder<Person>
    {
        public hoopsContext context { get; private set; }
        private readonly IHouseholdRepository _householdRepo;
        private readonly IPersonRepository _personRepo;

        public HouseholdAndPeopleSeeder(IHouseholdRepository householdRepo, IPersonRepository personRep, hoopsContext context)
        {
            this.context = context;
            _householdRepo = householdRepo;
            _personRepo = personRep;
        }

        public async Task DeleteAllAsync()
        {
            var records = await _personRepo.GetAllAsync();
            foreach (var record in records)
                await _personRepo.DeleteAsync(record.PersonId);
            var hrecords = await _householdRepo.GetAllAsync();
            foreach (var record in hrecords)
                await _householdRepo.DeleteAsync(record.HouseId);

        }

        public async Task SeedAsync()
        {
            var random = new Random();
            var householdNames = new[] { "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez" };
            var firstNames = new[] { "John", "Jane", "Alex", "Chris", "Pat", "Taylor", "Jordan", "Morgan", "Casey", "Sam", "Jamie", "Riley", "Cameron", "Avery", "Skyler" };

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
                await _householdRepo.InsertAsync(household);

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
                    await _personRepo.InsertAsync(person);
                }
                context.SaveChanges();
            }
        }
    }
}