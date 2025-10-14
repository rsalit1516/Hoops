using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Data.Seeders
{
    /// <summary>
    /// Seeds user accounts linked to parent/AD people records.
    /// Creates admin users (UserType = 3) and AD users (UserType = 2).
    /// </summary>
    public class UserSeeder : ISeeder<User>
    {
        public hoopsContext context { get; private set; }
        private readonly IUserRepository _userRepo;
        private readonly IPersonRepository _personRepo;

        public UserSeeder(IUserRepository userRepo, IPersonRepository personRepo, hoopsContext context)
        {
            this.context = context;
            _userRepo = userRepo;
            _personRepo = personRepo;
        }

        public async Task DeleteAllAsync()
        {
            try
            {
                Console.WriteLine("[DEBUG] Attempting to delete all users using raw SQL");
                var deletedCount = await context.Database.ExecuteSqlRawAsync("DELETE FROM Users");
                Console.WriteLine($"[DEBUG] Successfully deleted users using raw SQL");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Error deleting users: {ex.Message}");
                Console.WriteLine($"[ERROR] Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task SeedAsync()
        {
            // Create UserRepository instance to access HashPassword method
            var userRepo = new UserRepository(context);

            // Get parent/AD people records created by HouseholdAndPeopleSeeder
            var parentAdPeople = await context.People
                .Where(p => p.Parent == true && p.Ad == true)
                .ToListAsync();

            if (parentAdPeople.Count < 8)
            {
                Console.WriteLine($"[WARNING] Expected at least 8 parent/AD people records, found {parentAdPeople.Count}");
                return;
            }

            const string defaultPassword = "p@ssword1";
            string hashedPassword = userRepo.HashPassword(defaultPassword);

            // Create 3 admin users (UserType = 3)
            var adminPeople = parentAdPeople.Take(3).ToList();
            for (int i = 0; i < adminPeople.Count; i++)
            {
                var person = adminPeople[i];
                var user = new User
                {
                    UserId = i + 1, // Sequential user IDs starting from 1
                    CompanyId = 1,
                    UserName = GenerateUserName(person.FirstName, person.LastName),
                    Name = $"{person.FirstName} {person.LastName}",
                    Pword = defaultPassword, // Plain text for backwards compatibility
                    PassWord = hashedPassword, // Encrypted password for production use
                    UserType = 3, // Admin users
                    PersonId = person.PersonId,
                    HouseId = person.HouseId ?? 1, // Default to household 1 if null
                    CreatedDate = DateTime.Now,
                    CreatedUser = "Seed"
                };

                await _userRepo.InsertAsync(user);
                Console.WriteLine($"[DEBUG] Created admin user: {user.UserName} (UserType = 3)");
            }

            // Create 5 AD users (UserType = 2) 
            var adPeople = parentAdPeople.Skip(3).Take(5).ToList();
            for (int i = 0; i < adPeople.Count; i++)
            {
                var person = adPeople[i];
                var user = new User
                {
                    UserId = i + 4, // Continue sequential numbering after admins
                    CompanyId = 1,
                    UserName = GenerateUserName(person.FirstName, person.LastName),
                    Name = $"{person.FirstName} {person.LastName}",
                    Pword = defaultPassword, // Plain text for backwards compatibility
                    PassWord = hashedPassword, // Encrypted password for production use
                    UserType = 2, // AD users (Athletic Directors)
                    PersonId = person.PersonId,
                    HouseId = person.HouseId ?? 1, // Default to household 1 if null
                    CreatedDate = DateTime.Now,
                    CreatedUser = "Seed"
                };

                await _userRepo.InsertAsync(user);
                Console.WriteLine($"[DEBUG] Created AD user: {user.UserName} (UserType = 2)");
            }

            await context.SaveChangesAsync();
            Console.WriteLine($"[DEBUG] Created {adminPeople.Count} admin users and {adPeople.Count} AD users");
            Console.WriteLine($"[DEBUG] All users created with default password (encrypted): {defaultPassword}");
        }

        /// <summary>
        /// Generates username from first letter of first name + last name (e.g., 'rsalit')
        /// </summary>
        private string GenerateUserName(string firstName, string lastName)
        {
            if (string.IsNullOrEmpty(firstName) || string.IsNullOrEmpty(lastName))
                return "user" + new Random().Next(1000, 9999);

            var firstInitial = firstName.Substring(0, 1).ToLower();
            var lastNameLower = lastName.ToLower();
            return firstInitial + lastNameLower;
        }
    }
}
