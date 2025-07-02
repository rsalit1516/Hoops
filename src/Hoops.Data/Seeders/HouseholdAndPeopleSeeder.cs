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
                    var birthDate = j == 0 ? DateTime.Now.AddYears(-random.Next(28, 50)).AddDays(random.Next(1, 365)) : DateTime.Now.AddYears(-random.Next(5, 18)).AddDays(random.Next(1, 365));
                    var person = new Person
                    {
                        FirstName = firstNames[random.Next(firstNames.Length)],
                        LastName = householdNames[i],
                        HouseId = household.HouseId,
                        CompanyId = 1,
                        BirthDate = birthDate,
                        Gender = random.Next(2) == 0 ? "M" : "F",
                        CreatedDate = DateTime.Now,
                        CreatedUser = "Seed",
                        Parent = j == 0 ? true : false, // First person is the parent
                        Player = j > 0 ? true : false, // First person is a player
                        Grade = j > 0 ? CalculateGrade(birthDate, DateTime.Today) : null, // Only players have grades
                        SchoolName = "Coral Springs HS", // Assuming all players go to the same school
                        Bc = j == 0 ? false : true, // First person is a parent, others are players
                    };
                    await _personRepo.InsertAsync(person);
                }
                context.SaveChanges();
            }
        }
        public static int? CalculateGrade(DateTime birthDate, DateTime? asOf = null)
        {
            var today = asOf ?? DateTime.Today;
            int age = today.Year - birthDate.Year;
            if (birthDate > today.AddYears(-age)) age--;

            int grade = age - 5; // Kindergarten at age 5
            return grade >= 0 && grade <= 12 ? grade : (int?)null;
        }
    }
}