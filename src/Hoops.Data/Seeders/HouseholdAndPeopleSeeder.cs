using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

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
            try
            {
                Console.WriteLine("[DEBUG] Starting DeleteAllAsync() with raw SQL");
                
                // Delete People first (they have foreign key to Households)
                Console.WriteLine("[DEBUG] Attempting to delete all people using raw SQL");
                var deletedPeopleCount = await context.Database.ExecuteSqlRawAsync("DELETE FROM People");
                Console.WriteLine($"[DEBUG] Successfully deleted people using raw SQL");

                // Then delete Households
                Console.WriteLine("[DEBUG] Attempting to delete all households using raw SQL");
                var deletedHouseholdsCount = await context.Database.ExecuteSqlRawAsync("DELETE FROM Households");
                Console.WriteLine($"[DEBUG] Successfully deleted households using raw SQL");

                Console.WriteLine("[DEBUG] Successfully completed DeleteAllAsync()");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Error deleting households and people: {ex.Message}");
                Console.WriteLine($"[ERROR] Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task SeedAsync()
        {
            var random = new Random();
            var householdNames = new[] { "Adams", "Boomers", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis" };
            var firstNames = new[] { "John", "Jane", "Alex", "Chris", "Pat", "Taylor", "Jordan", "Morgan", "Casey", "Sam", "Jamie", "Riley", "Cameron", "Avery", "Skyler", "Drew", "Bailey", "Peyton", "Reese", "Quinn", "Charlie", "Dakota", "Finley", "Harper", "Rowan", "Sage", "Tatum", "Emerson", "Kendall", "Parker", "Sydney", "Aidan", "Blake", "Carter", "Dylan", "Evan", "Gavin", "Hunter", "Isaac", "Jaxon", "Liam", "Mason", "Noah", "Owen", "Ryan", "Tyler", "Zachary", "Aiden", "Brayden", "Caleb", "Ethan", "Logan", "Lucas", "Michael", "Nathan", "Samuel", "William" };

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