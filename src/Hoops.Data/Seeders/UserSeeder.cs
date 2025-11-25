using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

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
        private readonly ILogger<UserSeeder> _logger;

        public UserSeeder(IUserRepository userRepo, IPersonRepository personRepo, hoopsContext context, ILogger<UserSeeder> logger)
        {
            this.context = context;
            _userRepo = userRepo;
            _personRepo = personRepo;
            _logger = logger;
        }

        public async Task DeleteAllAsync()
        {
            try
            {
                _logger.LogDebug("Attempting to delete all users using raw SQL");
                var deletedCount = await context.Database.ExecuteSqlRawAsync("DELETE FROM Users");
                _logger.LogDebug("Successfully deleted users using raw SQL");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting users: {Message}", ex.Message);
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
                _logger.LogWarning("Expected at least 8 parent/AD people records, found {Count}", parentAdPeople.Count);
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
                _logger.LogDebug("Created admin user: {UserName} (UserType = 3)", user.UserName);
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
                _logger.LogDebug("Created AD user: {UserName} (UserType = 2)", user.UserName);
            }

            await context.SaveChangesAsync();
            _logger.LogDebug("Created {AdminCount} admin users and {AdCount} AD users", adminPeople.Count, adPeople.Count);
            _logger.LogDebug("All users created with default password (encrypted): {Password}", defaultPassword);
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
