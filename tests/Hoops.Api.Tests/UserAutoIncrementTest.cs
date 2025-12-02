using Microsoft.EntityFrameworkCore;
using Xunit;
using Hoops.Core.Models;
using Hoops.Infrastructure.Data;

namespace Hoops.Api.Tests
{
    public class UserAutoIncrementTest
    {
        private hoopsContext GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new hoopsContext(options);

            // Ensure clean state
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            return context;
        }

        [Fact]
        public async Task UserAutoIncrement_WithNewUser_GeneratesUserId()
        {
            // Arrange
            using var context = GetInMemoryContext();

            var newUser = new User
            {
                UserId = 0, // This should be auto-generated
                UserName = "newuser",
                Name = "New User",
                UserType = 1,
                CreatedDate = DateTime.Now,
                CreatedUser = "test"
            };

            // Act - Test Entity Framework auto-increment directly
            context.Users.Add(newUser);
            await context.SaveChangesAsync();

            // Assert
            Assert.True(newUser.UserId > 0, $"Expected auto-generated UserId > 0, but got {newUser.UserId}");
            Assert.Equal("newuser", newUser.UserName);
            Assert.Equal("New User", newUser.Name);

            // Verify it was saved in the database with the auto-generated ID
            var savedUser = await context.Users.FirstOrDefaultAsync(u => u.UserName == "newuser");
            Assert.NotNull(savedUser);
            Assert.True(savedUser.UserId > 0);
            Assert.Equal(newUser.UserId, savedUser.UserId);
        }

        [Fact]
        public async Task UserAutoIncrement_WithMultipleUsers_GeneratesSequentialIds()
        {
            // Arrange
            using var context = GetInMemoryContext();

            var users = new List<User>
            {
                new User
                {
                    UserId = 0, // Auto-generated
                    UserName = "user1",
                    Name = "User One",
                    UserType = 1,
                    CreatedDate = DateTime.Now,
                    CreatedUser = "test"
                },
                new User
                {
                    UserId = 0, // Auto-generated
                    UserName = "user2",
                    Name = "User Two",
                    UserType = 1,
                    CreatedDate = DateTime.Now,
                    CreatedUser = "test"
                },
                new User
                {
                    UserId = 0, // Auto-generated
                    UserName = "user3",
                    Name = "User Three",
                    UserType = 1,
                    CreatedDate = DateTime.Now,
                    CreatedUser = "test"
                }
            };

            // Act
            context.Users.AddRange(users);
            await context.SaveChangesAsync();

            // Assert
            foreach (var user in users)
            {
                Assert.True(user.UserId > 0, $"Expected auto-generated UserId > 0 for {user.UserName}, but got {user.UserId}");
            }

            // Verify they have different IDs
            var userIds = users.Select(u => u.UserId).ToList();
            Assert.Equal(3, userIds.Distinct().Count()); // All IDs should be unique

            // Verify they were saved correctly
            var savedUsers = await context.Users.Where(u => u.Name.StartsWith("User")).ToListAsync();
            Assert.Equal(3, savedUsers.Count);
            Assert.All(savedUsers, user => Assert.True(user.UserId > 0));
        }

        [Fact]
        public async Task UserAutoIncrement_WithExistingData_ContinuesSequence()
        {
            // Arrange
            using var context = GetInMemoryContext();

            // Seed some existing data first
            var existingUsers = new List<User>
            {
                new User
                {
                    UserId = 0, // Will be auto-generated as 1
                    UserName = "johndoe",
                    Name = "John Doe",
                    UserType = 1,
                    CreatedDate = DateTime.Now,
                    CreatedUser = "seed"
                },
                new User
                {
                    UserId = 0, // Will be auto-generated as 2
                    UserName = "janesmith",
                    Name = "Jane Smith",
                    UserType = 1,
                    CreatedDate = DateTime.Now,
                    CreatedUser = "seed"
                }
            };

            context.Users.AddRange(existingUsers);
            await context.SaveChangesAsync();

            var newUser = new User
            {
                UserId = 0, // Auto-generated - should be 3 or higher
                UserName = "newuser",
                Name = "New User",
                UserType = 1,
                CreatedDate = DateTime.Now,
                CreatedUser = "test"
            };

            // Act
            context.Users.Add(newUser);
            await context.SaveChangesAsync();

            // Assert
            Assert.True(newUser.UserId > 2, $"Expected new UserId > 2, but got {newUser.UserId}");

            // Verify all users exist
            var allUsers = await context.Users.ToListAsync();
            Assert.Equal(3, allUsers.Count); // 2 seeded + 1 new

            var userIds = allUsers.Select(u => u.UserId).ToList();
            Assert.Equal(3, userIds.Distinct().Count()); // All IDs should be unique
        }

        [Fact]
        public async Task UserAutoIncrement_DatabaseConfiguration_IsCorrect()
        {
            // Arrange
            using var context = GetInMemoryContext();

            // Act & Assert - Test the database schema configuration
            var entityType = context.Model.FindEntityType(typeof(User));
            Assert.NotNull(entityType);

            var userIdProperty = entityType.FindProperty(nameof(User.UserId));
            Assert.NotNull(userIdProperty);

            // Verify auto-increment behavior by adding users without specifying ID
            var user1 = new User
            {
                UserName = "test1",
                Name = "Test User 1",
                UserType = 1,
                CreatedDate = DateTime.Now,
                CreatedUser = "test"
            };

            var user2 = new User
            {
                UserName = "test2",
                Name = "Test User 2",
                UserType = 1,
                CreatedDate = DateTime.Now,
                CreatedUser = "test"
            };

            context.Users.AddRange(user1, user2);
            await context.SaveChangesAsync();

            // Both should have different auto-generated IDs
            Assert.True(user1.UserId > 0, $"User1 expected auto-generated ID > 0, got {user1.UserId}");
            Assert.True(user2.UserId > 0, $"User2 expected auto-generated ID > 0, got {user2.UserId}");
            Assert.NotEqual(user1.UserId, user2.UserId);

            Console.WriteLine($"User1 ID: {user1.UserId}, User2 ID: {user2.UserId}");
        }

        [Fact]
        public async Task UserAutoIncrement_ZeroUserId_IsAutoGenerated()
        {
            // Arrange
            using var context = GetInMemoryContext();

            // This simulates exactly what the UserFunctions.Post method does
            var newUser = new User
            {
                UserId = 0, // Explicitly set to 0 like in the function
                UserName = "zerouser",
                Name = "Zero User",
                UserType = 1,
                CreatedDate = DateTime.Now,
                CreatedUser = "test"
            };

            // Act - Simulate the function logic
            if (newUser.UserId == 0)
            {
                // Let Entity Framework handle the auto-increment
                newUser.UserId = 0;
            }

            await context.Users.AddAsync(newUser);
            await context.SaveChangesAsync();

            // Assert
            Assert.True(newUser.UserId > 0, $"Expected UserId to be auto-generated > 0, but got {newUser.UserId}");

            // Verify in database
            var savedUser = await context.Users.FirstOrDefaultAsync(u => u.UserName == "zerouser");
            Assert.NotNull(savedUser);
            Assert.True(savedUser.UserId > 0);
            Assert.Equal(newUser.UserId, savedUser.UserId);
        }
    }
}